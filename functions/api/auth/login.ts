import { hashPassword, signJwt } from '../../_shared/crypto'
import { readBody, str } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { fail, json, toPrivateUser, type Env, type UserRow } from '../../_shared/types'

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const email = str(body.email).toLowerCase()
  const password = str(body.password)
  if (!email || !password) return fail('请输入邮箱和密码')

  const row = await getDb(context.env).prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first<UserRow>()
  if (!row) return fail('邮箱或密码错误', 401)
  if (row.banned) return fail('账号已被封禁', 403)
  if (!row.password_hash) return fail('该账号使用第三方登录，请先设置密码或使用快捷登录', 401)

  const hash = await hashPassword(password, row.password_salt)
  if (hash !== row.password_hash) return fail('邮箱或密码错误', 401)

  const token = await signJwt({ sub: row.id, email: row.email }, context.env.JWT_SECRET)
  return json({ token, user: toPrivateUser(row) })
}
