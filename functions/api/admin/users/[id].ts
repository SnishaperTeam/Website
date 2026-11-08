import { requireAdmin, okJson, failJson, type AdminEnv } from '../../../_shared/adminAuth'
import { getDb } from '../../../_shared/db'

export const onRequestPost = async (context: {
  request: Request
  env: AdminEnv
  params: { id: string }
}) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const id = context.params.id
  let action = ''
  try {
    const body = (await context.request.json()) as { action?: string }
    action = String(body.action || '')
  } catch {
    return failJson('invalid_json', 400)
  }
  if (action !== 'ban' && action !== 'unban') return failJson('invalid_action', 400)

  await getDb(context.env)
    .prepare('UPDATE users SET banned = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .bind(action === 'ban' ? 1 : 0, id)
    .run()

  return okJson({ id, banned: action === 'ban' })
}

export const onRequestDelete = async (context: {
  request: Request
  env: AdminEnv
  params: { id: string }
}) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const id = context.params.id
  const db = getDb(context.env)
  await db.prepare('DELETE FROM comments WHERE user_id = ?').bind(id).run()
  await db.prepare('DELETE FROM user_favorites WHERE user_id = ?').bind(id).run()
  await db.prepare('DELETE FROM user_test_history WHERE user_id = ?').bind(id).run()
  await db.prepare('DELETE FROM user_posts WHERE author_id = ?').bind(id).run()
  await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run()

  return okJson({ id })
}
