import { requireUser } from '../../../../_shared/auth'
import { getDb } from '../../../../_shared/db'
import { fail, json, type Env } from '../../../../_shared/types'

export const onRequestDelete = async (context: {
  request: Request
  env: Env
  params: { provider: string }
}) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const db = getDb(context.env)
  const remaining = await db.prepare('SELECT COUNT(*) AS n FROM oauth_accounts WHERE user_id = ?')
    .bind(auth.userId)
    .first<{ n: number }>()
  if (!auth.row.password_hash && (remaining?.n ?? 0) <= 1) {
    return fail('这是唯一的登录方式，请先设置密码')
  }

  await db.prepare('DELETE FROM oauth_accounts WHERE user_id = ? AND provider = ?')
    .bind(auth.userId, context.params.provider)
    .run()
  return json({ ok: true })
}
