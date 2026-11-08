import { requireAdmin, okJson, type AdminEnv } from '../../../_shared/adminAuth'
import { getDb } from '../../../_shared/db'

interface AdminPostRow {
  id: string
  author_id: string
  title: string
  slug: string
  category: string | null
  published: number
  views: number
  likes: number
  created_at: string
  nickname: string | null
}

export const onRequestGet = async (context: { request: Request; env: AdminEnv }) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const rows = await getDb(context.env)
    .prepare(
      `SELECT p.id, p.author_id, p.title, p.slug, p.category, p.published, p.views, p.likes, p.created_at, u.nickname
       FROM user_posts p LEFT JOIN users u ON u.id = p.author_id
       ORDER BY p.created_at DESC LIMIT 200`,
    )
    .all<AdminPostRow>()

  return okJson({
    posts: rows.results.map((row) => ({
      id: row.id,
      authorId: row.author_id,
      author: row.nickname || '未知',
      title: row.title,
      slug: row.slug,
      category: row.category,
      published: !!row.published,
      views: row.views,
      likes: row.likes,
      createdAt: row.created_at,
    })),
  })
}
