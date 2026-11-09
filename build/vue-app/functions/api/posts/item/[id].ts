import { readBody, requireUser, str } from '../../../_shared/auth'
import { getDb } from '../../../_shared/db'
import { fail, json, type Env } from '../../../_shared/types'
import { requireAdmin, type AdminEnv } from '../../../_shared/adminAuth'
import { toPost, type PostRow } from '../../../_shared/posts'

async function loadPost(env: Env, id: string) {
  return getDb(env).prepare('SELECT * FROM user_posts WHERE id = ?').bind(id).first<PostRow>()
}

export const onRequestPatch = async (context: {
  request: Request
  env: AdminEnv
  params: { id: string }
}) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const post = await loadPost(context.env, context.params.id)
  if (!post) return fail('文章不存在', 404)
  if (post.author_id !== auth.userId) return fail('无权编辑该文章', 403)

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const updates: string[] = []
  const values: unknown[] = []
  const setStr = (col: string, key: string) => {
    if (body[key] !== undefined) {
      updates.push(`${col} = ?`)
      values.push(str(body[key]))
    }
  }
  setStr('title', 'title')
  setStr('excerpt', 'excerpt')
  setStr('content', 'content')
  setStr('category', 'category')
  setStr('color', 'color')
  if (body.tags !== undefined) {
    updates.push('tags = ?')
    values.push(Array.isArray(body.tags) ? (body.tags as unknown[]).map((t) => String(t)).join(',') : str(body.tags))
  }
  if (body.published !== undefined) {
    updates.push('published = ?')
    values.push(body.published ? 1 : 0)
  }
  if (updates.length === 0) return fail('没有需要更新的内容')
  updates.push("updated_at = datetime('now')")
  values.push(context.params.id)

  await getDb(context.env)
    .prepare(`UPDATE user_posts SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run()

  const updated = await loadPost(context.env, context.params.id)
  return json({ post: toPost(updated as PostRow) })
}

export const onRequestDelete = async (context: {
  request: Request
  env: AdminEnv
  params: { id: string }
}) => {
  const auth = await requireUser(context.request, context.env)
  const post = await loadPost(context.env, context.params.id)
  if (!post) return fail('文章不存在', 404)

  const adminOk = (await requireAdmin(context.request, context.env)) === null

  if (!(auth instanceof Response)) {
    if (post.author_id !== auth.userId && !adminOk) return fail('无权删除该文章', 403)
  } else if (!adminOk) {
    return auth
  }

  const db = getDb(context.env)
  await db.prepare('DELETE FROM comments WHERE post_slug = ?').bind(post.slug).run()
  await db.prepare('DELETE FROM user_posts WHERE id = ?').bind(context.params.id).run()
  return json({ ok: true })
}
