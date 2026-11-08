import { readBody, requireUser, str } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { fail, json, newId, type Env } from '../../_shared/types'
import { toPost, type PostRow } from '../../_shared/posts'

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const rows = await getDb(context.env)
    .prepare(
      `SELECT p.*, u.nickname FROM user_posts p LEFT JOIN users u ON u.id = p.author_id
       WHERE p.published = 1 ORDER BY p.created_at DESC LIMIT 100`,
    )
    .all<PostRow>()
  return json({ posts: rows.results.map(toPost) })
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const title = str(body.title)
  const slug = str(body.slug).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
  const content = str(body.content)
  const excerpt = str(body.excerpt)
  const category = str(body.category) || '个人文章'
  const color = str(body.color)
  const tags = Array.isArray(body.tags) ? (body.tags as unknown[]).map((t) => str(t)).filter(Boolean).join(',') : str(body.tags)
  const published = body.published === false ? 0 : 1

  if (!title) return fail('标题不能为空')
  if (!slug) return fail('slug 不合法')
  if (!content) return fail('正文不能为空')

  const exists = await getDb(context.env).prepare('SELECT id FROM user_posts WHERE slug = ?')
    .bind(slug)
    .first<{ id: string }>()
  if (exists) return fail('该 slug 已被占用', 409)

  const id = newId()
  await getDb(context.env)
    .prepare(
      'INSERT INTO user_posts (id, author_id, title, slug, excerpt, content, category, color, tags, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )
    .bind(id, auth.userId, title, slug, excerpt, content, category, color || null, tags || null, published)
    .run()

  return json({ post: toPost({
    id, author_id: auth.userId, title, slug, excerpt, content, category,
    color: color || null, tags: tags || null, published, views: 0, likes: 0,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  } as PostRow) }, 201)
}
