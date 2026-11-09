import { readBody, str } from '../../../_shared/auth'
import { getDb } from '../../../_shared/db'
import { sessionForUser } from '../../../_shared/oauthFlow'
import { fail, json, type Env } from '../../../_shared/types'

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const code = str(body.code)
  if (!code) return fail('缺少登录码')

  const db = getDb(context.env)
  const row = await db.prepare('SELECT user_id, expires_at FROM oauth_codes WHERE code = ?')
    .bind(code)
    .first<{ user_id: string; expires_at: number }>()
  if (!row || row.expires_at < Date.now()) return fail('登录码无效或已过期', 401)

  await db.prepare('DELETE FROM oauth_codes WHERE code = ?').bind(code).run()
  const session = await sessionForUser(context.env, db, row.user_id)
  return json(session)
}
