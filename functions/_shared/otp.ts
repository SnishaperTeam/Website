import { sendMail } from './smtp'
import { otpHtml, otpSubject, otpText } from './otpMail'
import { fail, json, type D1Database, type Env } from './types'

export type OtpPurpose = 'register' | 'password_reset'

const CODE_TTL = 10 * 60 * 1000
const SEND_COOLDOWN = 60 * 1000

function sha256Hex(input: string): Promise<string> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)).then((buffer) =>
    [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join(''),
  )
}

async function codeHash(code: string, email: string, purpose: OtpPurpose, secret: string): Promise<string> {
  return sha256Hex(`${secret}:${purpose}:${email}:${code}`)
}

export async function sendOtp(db: D1Database, email: string, purpose: OtpPurpose, env: Env): Promise<Response> {
  const now = Date.now()
  const existing = await db
    .prepare('SELECT created_at FROM otp_codes WHERE email = ? AND purpose = ?')
    .bind(email, purpose)
    .first<{ created_at: number }>()

  if (existing && now - Number(existing.created_at) < SEND_COOLDOWN) {
    return fail('发送过于频繁，请稍后再试', 429)
  }

  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0')
  const hash = await codeHash(code, email, purpose, env.JWT_SECRET)
  const expiresAt = now + CODE_TTL

  await db
    .prepare(
      `INSERT INTO otp_codes (email, purpose, code_hash, expires_at, attempts, created_at)
       VALUES (?, ?, ?, ?, 0, ?)
       ON CONFLICT(email, purpose) DO UPDATE SET
         code_hash = excluded.code_hash,
         expires_at = excluded.expires_at,
         attempts = 0,
         created_at = excluded.created_at`,
    )
    .bind(email, purpose, hash, expiresAt, now)
    .run()

  try {
    await sendMail(
      env.SMTP_USER,
      env.SMTP_PASSWORD,
      env.SMTP_FROM || env.SMTP_USER,
      email,
      otpSubject(purpose),
      otpText(code),
      otpHtml(code, purpose),
    )
  } catch (e) {
    return fail(e instanceof Error ? e.message : '验证码邮件发送失败', 502)
  }

  return json({ ok: true })
}

export async function verifyOtp(
  db: D1Database,
  email: string,
  purpose: OtpPurpose,
  code: string,
  secret: string,
): Promise<Response | null> {
  const row = await db
    .prepare('SELECT code_hash, expires_at, attempts FROM otp_codes WHERE email = ? AND purpose = ?')
    .bind(email, purpose)
    .first<{ code_hash: string; expires_at: number; attempts: number }>()

  if (!row || Number(row.expires_at) < Date.now()) return fail('验证码错误或已过期')
  if (Number(row.attempts) >= 5) return fail('验证码错误次数过多，请重新获取')

  const matches = (await codeHash(code, email, purpose, secret)) === row.code_hash
  if (!matches) {
    await db
      .prepare('UPDATE otp_codes SET attempts = attempts + 1 WHERE email = ? AND purpose = ?')
      .bind(email, purpose)
      .run()
    return fail('验证码错误或已过期')
  }

  await db.prepare('DELETE FROM otp_codes WHERE email = ? AND purpose = ?').bind(email, purpose).run()
  return null
}
