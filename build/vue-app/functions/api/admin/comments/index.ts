import { requireAdmin, okJson, type AdminEnv } from '../../../_shared/adminAuth'
import { getDb } from '../../../_shared/db'

interface AdminCommentRow {
  id: string
  post_slug: string
  user_id: string
  content: string
  created_at: string
  nickname: string | null
}

export const onRequestGet = async (context: { request: Request; env: AdminEnv }) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const rows = await getDb(context.env)
    .prepare(
      `SELECT c.id, c.post_slug, c.user_id, c.content, c.created_at, u.nickname
       FROM comments c LEFT JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at DESC LIMIT 200`,
    )
    .all<AdminCommentRow>()

  return okJson({
    comments: rows.results.map((row) => ({
      id: row.id,
      postSlug: row.post_slug,
      userId: row.user_id,
      author: row.nickname || '已注销用户',
      content: row.content,
      createdAt: row.created_at,
    })),
  })
}
