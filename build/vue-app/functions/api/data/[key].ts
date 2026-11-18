import { requireUser } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { fail, type Env } from '../../_shared/types'

// 用户 KV 数据（桌面端云同步）：
//   GET /api/data/:key → 返回存储的 JSON blob（404 表示无数据）
//   PUT /api/data/:key → body 即 JSON blob（上限 10MB）
const KEY_RE = /^[A-Za-z0-9_-]{1,64}$/
const MAX_VALUE_BYTES = 10 * 1024 * 1024

export const onRequestGet = async (context: {
  request: Request
  env: Env
  params: { key: string }
}) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const key = decodeURIComponent(context.params.key)
  if (!KEY_RE.test(key)) return fail('key 格式不正确')

  const row = await getDb(context.env)
    .prepare('SELECT value FROM user_data WHERE user_id = ? AND key = ?')
    .bind(auth.userId, key)
    .first<{ value: string }>()
  if (!row) return fail('云端没有该数据', 404)

  return new Response(row.value, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

export const onRequestPut = async (context: {
  request: Request
  env: Env
  params: { key: string }
}) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const key = decodeURIComponent(context.params.key)
  if (!KEY_RE.test(key)) return fail('key 格式不正确')

  const length = Number(context.request.headers.get('content-length') || '0')
  if (!length || length > MAX_VALUE_BYTES) return fail('数据为空或超过 10MB 上限')

  const value = await context.request.text()

  // DELETE + INSERT 兼容 Postgres/SQLite，桌面端是唯一写入方，无并发冲突
  const db = getDb(context.env)
  await db.prepare('DELETE FROM user_data WHERE user_id = ? AND key = ?')
    .bind(auth.userId, key)
    .run()
  await db.prepare('INSERT INTO user_data (user_id, key, value) VALUES (?, ?, ?)')
    .bind(auth.userId, key, value)
    .run()

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
