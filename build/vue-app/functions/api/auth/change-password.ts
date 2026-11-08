import { hashPassword, newSalt, signJwt } from '../../_shared/crypto'
import { readBody, requireUser, str } from '../../_shared/auth'
import { fail, json, type Env } from '../../_shared/types'

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const currentPassword = str(body.currentPassword)
  const newPassword = str(body.newPassword)

  if (!currentPassword) return fail('请输入当前密码')
  if (newPassword.length < 8) return fail('新密码至少 8 位')

  const currentHash = await hashPassword(currentPassword, auth.row.password_salt)
  if (currentHash !== auth.row.password_hash) return fail('当前密码错误', 401)

  const salt = newSalt()
  const passwordHash = await hashPassword(newPassword, salt)

  await context.env.DB.prepare(
    'UPDATE users SET password_hash = ?, password_salt = ?, updated_at = datetime(\'now\') WHERE id = ?',
  )
    .bind(passwordHash, salt, auth.userId)
    .run()

  const token = await signJwt({ sub: auth.userId, email: auth.email }, context.env.JWT_SECRET)
  return json({ token })
}
