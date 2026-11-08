import { hashPassword } from '../../_shared/crypto'
import { readBody, requireUser, str } from '../../_shared/auth'
import { fail, json, type Env } from '../../_shared/types'

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const password = str(body.password)
  if (!password) return fail('请输入密码以确认删除')

  const hash = await hashPassword(password, auth.row.password_salt)
  if (hash !== auth.row.password_hash) return fail('密码错误', 401)

  await context.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(auth.userId).run()
  return json({ ok: true })
}
