import { getDb } from '../../../_shared/db'
import { fail, json, type Env } from '../../../_shared/types'

export const onRequestPost = async (context: {
  request: Request
  env: Env
  params: { slug: string }
}) => {
  const row = await getDb(context.env)
    .prepare('SELECT id, likes FROM user_posts WHERE slug = ? AND published = 1')
    .bind(context.params.slug)
    .first<{ id: string; likes: number }>()
  if (!row) return fail('文章不存在', 404)

  const likes = row.likes + 1
  await getDb(context.env)
    .prepare('UPDATE user_posts SET likes = ? WHERE id = ?')
    .bind(likes, row.id)
    .run()
  return json({ likes })
}
