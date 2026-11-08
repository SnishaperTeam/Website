import { readBody, requireUser, str } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { fail, json, newId, type Env } from '../../_shared/types'

interface CommentRow {
  id: string
  post_slug: string
  user_id: string
  content: string
  created_at: string
  nickname?: string | null
  avatar_url?: string | null
}

function toComment(row: CommentRow) {
  return {
    id: row.id,
    postSlug: row.post_slug,
    userId: row.user_id,
    author: row.nickname || '匿名',
    avatarUrl: row.avatar_url || null,
    content: row.content,
    createdAt: row.created_at,
  }
}

export const onRequestGet = async (context: {
  request: Request
  env: Env
  params: { slug: string }
}) => {
  const slug = context.params.slug
  if (!slug) return fail('缺少 slug', 400)

  const rows = await getDb(context.env)
    .prepare(
      `SELECT c.*, u.nickname, u.avatar_url FROM comments c LEFT JOIN users u ON u.id = c.user_id
       WHERE c.post_slug = ? ORDER BY c.created_at ASC LIMIT 500`,
    )
    .bind(slug)
    .all<CommentRow>()

  return json({ comments: rows.results.map(toComment) })
}

export const onRequestPost = async (context: {
  request: Request
  env: Env
  params: { slug: string }
}) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const slug = context.params.slug
  if (!slug) return fail('缺少 slug', 400)

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const content = str(body.content)
  if (!content) return fail('评论内容不能为空')
  if (content.length > 2000) return fail('评论过长')

  const id = newId()
  await getDb(context.env)
    .prepare('INSERT INTO comments (id, post_slug, user_id, content) VALUES (?, ?, ?, ?)')
    .bind(id, slug, auth.userId, content)
    .run()

  return json({
    comment: toComment({
      id,
      post_slug: slug,
      user_id: auth.userId,
      content,
      created_at: new Date().toISOString(),
      nickname: auth.row.nickname,
      avatar_url: auth.row.avatar_url,
    }),
  }, 201)
}
