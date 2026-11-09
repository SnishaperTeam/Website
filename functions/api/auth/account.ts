import { hashPassword } from '../../_shared/crypto'
import { readBody, requireUser, str } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { fail, json, type Env } from '../../_shared/types'

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const password = str(body.password)
  if (!password) return fail('请输入密码以确认删除')

  const hash = await hashPassword(password, auth.row.password_salt)
  if (hash !== auth.row.password_hash) return fail('密码错误', 401)

  const db = getDb(context.env)
  const owned = await db.prepare('SELECT slug FROM user_posts WHERE author_id = ?')
    .bind(auth.userId)
    .all<{ slug: string }>()
  for (const post of owned.results) {
    await db.prepare('DELETE FROM comments WHERE post_slug = ?').bind(post.slug).run()
  }
  await db.prepare('DELETE FROM comments WHERE user_id = ?').bind(auth.userId).run()
  await db.prepare('DELETE FROM user_posts WHERE author_id = ?').bind(auth.userId).run()
  await db.prepare('DELETE FROM user_favorites WHERE user_id = ?').bind(auth.userId).run()
  await db.prepare('DELETE FROM user_test_history WHERE user_id = ?').bind(auth.userId).run()
  await db.prepare('DELETE FROM oauth_accounts WHERE user_id = ?').bind(auth.userId).run()
  await db.prepare('DELETE FROM users WHERE id = ?').bind(auth.userId).run()
  return json({ ok: true })
}
