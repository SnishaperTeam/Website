import { requireUser } from '../../../_shared/auth'
import { getDb } from '../../../_shared/db'
import { fail, json, type Env } from '../../../_shared/types'
import { requireAdmin, type AdminEnv } from '../../../_shared/adminAuth'

export const onRequestDelete = async (context: {
  request: Request
  env: AdminEnv
  params: { id: string }
}) => {
  const db = getDb(context.env)
  const row = await db.prepare('SELECT user_id FROM comments WHERE id = ?')
    .bind(context.params.id)
    .first<{ user_id: string }>()
  if (!row) return fail('评论不存在', 404)

  const auth = await requireUser(context.request, context.env)
  const adminOk = (await requireAdmin(context.request, context.env)) === null

  if (!(auth instanceof Response)) {
    if (row.user_id !== auth.userId && !adminOk) return fail('无权删除该评论', 403)
  } else if (!adminOk) {
    return auth
  }

  await db.prepare('DELETE FROM comments WHERE id = ?').bind(context.params.id).run()
  return json({ ok: true })
}
