import { hashPassword, newSalt, signJwt } from '../../_shared/crypto'
import { readBody, str } from '../../_shared/auth'
import {
  fail,
  isValidEmail,
  json,
  newId,
  toPrivateUser,
  type Env,
  type UserRow,
} from '../../_shared/types'

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const email = str(body.email).toLowerCase()
  const password = str(body.password)
  const nickname = str(body.nickname) || email.split('@')[0]

  if (!isValidEmail(email)) return fail('邮箱格式不正确')
  if (password.length < 8) return fail('密码至少 8 位')
  if (nickname.length < 2 || nickname.length > 24) return fail('昵称长度需在 2-24 个字符之间')

  const exists = await context.env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(email)
    .first<{ id: string }>()
  if (exists) return fail('该邮箱已注册', 409)

  const salt = newSalt()
  const passwordHash = await hashPassword(password, salt)
  const id = newId()

  await context.env.DB.prepare(
    'INSERT INTO users (id, email, password_hash, password_salt, nickname) VALUES (?, ?, ?, ?, ?)',
  )
    .bind(id, email, passwordHash, salt, nickname)
    .run()

  const row = await context.env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
    .first<UserRow>()

  const token = await signJwt({ sub: id, email }, context.env.JWT_SECRET)
  return json({ token, user: toPrivateUser(row as UserRow) }, 201)
}
