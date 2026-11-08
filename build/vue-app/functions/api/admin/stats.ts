import { requireAdmin, okJson, type AdminEnv } from '../../_shared/adminAuth'
import { getDb } from '../../_shared/db'

export const onRequestGet = async (context: { request: Request; env: AdminEnv }) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const db = getDb(context.env)
  const count = async (sql: string) => {
    const row = await db.prepare(sql).first<{ n: number }>()
    return row?.n ?? 0
  }

  return okJson({
    stats: {
      users: await count('SELECT COUNT(*) AS n FROM users'),
      posts: await count('SELECT COUNT(*) AS n FROM user_posts'),
      publishedPosts: await count('SELECT COUNT(*) AS n FROM user_posts WHERE published = 1'),
      comments: await count('SELECT COUNT(*) AS n FROM comments'),
      favorites: await count('SELECT COUNT(*) AS n FROM user_favorites'),
      history: await count('SELECT COUNT(*) AS n FROM user_test_history'),
    },
  })
}
