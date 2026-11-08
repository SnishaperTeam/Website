import { getDb } from '../../_shared/db'
import { fail, json, type Env } from '../../_shared/types'
import { toPost, type PostRow } from '../../_shared/posts'

export const onRequestGet = async (context: {
  request: Request
  env: Env
  params: { slug: string }
}) => {
  const slug = context.params.slug
  if (!slug) return fail('缺少 slug', 400)

  const db = getDb(context.env)
  const row = await db.prepare(
    `SELECT p.*, u.nickname FROM user_posts p LEFT JOIN users u ON u.id = p.author_id WHERE p.slug = ?`,
  ).bind(slug).first<PostRow>()
  if (!row) return fail('文章不存在', 404)

  await db.prepare('UPDATE user_posts SET views = views + 1 WHERE id = ?').bind(row.id).run()
  return json({ post: toPost({ ...row, views: row.views + 1 }) })
}
