import { hashPassword, newSalt } from '../../_shared/crypto'
import { readBody, str } from '../../_shared/auth'
import { verifyOtp } from '../../_shared/otp'
import { getDb } from '../../_shared/db'
import { fail, isValidEmail, json, type Env, type UserRow } from '../../_shared/types'

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const email = str(body.email).toLowerCase()
  const otpCode = str(body.otpCode)
  const password = str(body.password)

  if (!isValidEmail(email)) return fail('邮箱格式不正确')
  if (!/^\d{6}$/.test(otpCode)) return fail('请输入 6 位邮箱验证码')
  if (password.length < 8) return fail('密码至少 8 位')

  const db = getDb(context.env)
  const row = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserRow>()
  if (!row) return fail('验证码错误或已过期')
  if (row.banned) return fail('账号已被封禁', 403)

  const otpError = await verifyOtp(db, email, 'password_reset', otpCode, context.env.JWT_SECRET)
  if (otpError) return otpError

  const salt = newSalt()
  const passwordHash = await hashPassword(password, salt)
  await db
    .prepare(
      `UPDATE users SET password_hash = ?, password_salt = ?, updated_at = datetime('now')
       WHERE id = ?`,
    )
    .bind(passwordHash, salt, row.id)
    .run()

  return json({ ok: true })
}
