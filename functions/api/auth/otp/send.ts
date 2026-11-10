import { readBody, str } from '../../../_shared/auth'
import { sendOtp } from '../../../_shared/otp'
import { getDb } from '../../../_shared/db'
import { fail, isValidEmail, type Env } from '../../../_shared/types'

const PURPOSES = new Set(['register', 'password_reset'])

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const email = str(body.email).toLowerCase()
  const purpose = str(body.purpose)
  if (!isValidEmail(email)) return fail('邮箱格式不正确')
  if (!PURPOSES.has(purpose)) return fail('验证码用途不正确')

  const db = getDb(context.env)
  if (purpose === 'register') {
    const exists = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
    if (exists) return fail('该邮箱已注册', 409)
  } else {
    const exists = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
    if (!exists) return json()
  }

  return sendOtp(db, email, purpose as 'register' | 'password_reset', context.env)
}

function json(): Response {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
