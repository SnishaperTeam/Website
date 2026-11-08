import { readBody, requireUser, str } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { fail, json, toPrivateUser, type Env, type UserRow } from '../../_shared/types'

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth
  return json({ user: toPrivateUser(auth.row) })
}

export const onRequestPatch = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const nickname = str(body.nickname)
  const avatarUrl = body.avatarUrl === null ? null : str(body.avatarUrl)

  if (body.nickname !== undefined && (nickname.length < 2 || nickname.length > 24)) {
    return fail('昵称长度需在 2-24 个字符之间')
  }
  if (body.avatarUrl !== undefined && avatarUrl && !/^https?:\/\//.test(avatarUrl)) {
    return fail('头像需为 http(s) 链接')
  }

  const updates: string[] = []
  const values: unknown[] = []
  if (body.nickname !== undefined) {
    updates.push('nickname = ?')
    values.push(nickname)
  }
  if (body.avatarUrl !== undefined) {
    updates.push('avatar_url = ?')
    values.push(avatarUrl || null)
  }
  if (updates.length === 0) return fail('没有需要更新的内容')

  updates.push("updated_at = datetime('now')")
  values.push(auth.userId)

  await getDb(context.env).prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run()

  const row = await getDb(context.env).prepare('SELECT * FROM users WHERE id = ?')
    .bind(auth.userId)
    .first<UserRow>()
  return json({ user: toPrivateUser(row as UserRow) })
}
