import { requireAdmin, okJson, type AdminEnv } from '../../../_shared/adminAuth'
import { getDb } from '../../../_shared/db'

export const onRequestDelete = async (context: {
  request: Request
  env: AdminEnv
  params: { id: string }
}) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const db = getDb(context.env)
  const row = await db.prepare('SELECT slug FROM user_posts WHERE id = ?')
    .bind(context.params.id)
    .first<{ slug: string }>()
  if (row) {
    await db.prepare('DELETE FROM comments WHERE post_slug = ?').bind(row.slug).run()
  }
  await db.prepare('DELETE FROM user_posts WHERE id = ?').bind(context.params.id).run()
  return okJson({ id: context.params.id })
}
