import { readBody, str } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { requireAdmin, okJson, failJson, type AdminEnv } from '../../_shared/adminAuth'
import { json } from '../../_shared/types'

function normalizePath(value: string): string {
  const path = value.split('?')[0].trim()
  if (!path.startsWith('/')) return ''
  return path.length > 1 ? path.replace(/\/$/, '') : path
}

export const onRequestGet = async (context: { request: Request; env: AdminEnv }) => {
  const path = normalizePath(new URL(context.request.url).searchParams.get('path') || '')
  if (!path) return json({ overrides: [] })

  const row = await getDb(context.env)
    .prepare('SELECT overrides FROM page_edits WHERE path = ?')
    .bind(path)
    .first<{ overrides: string }>()
  if (!row) return json({ overrides: [] })

  try {
    const data = JSON.parse(row.overrides)
    return json({ overrides: Array.isArray(data) ? data : [] })
  } catch {
    return json({ overrides: [] })
  }
}

export const onRequestPost = async (context: { request: Request; env: AdminEnv }) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const path = normalizePath(str(body.path))
  if (!path) return failJson('path 不能为空', 400)
  const overrides = Array.isArray(body.overrides)
    ? (body.overrides as unknown[]).map((v) => (typeof v === 'string' ? v : ''))
    : []
  if (overrides.length > 2000) return failJson('内容过多', 400)

  await getDb(context.env)
    .prepare(
      `INSERT INTO page_edits (path, overrides, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(path) DO UPDATE SET overrides = excluded.overrides, updated_at = excluded.updated_at`,
    )
    .bind(path, JSON.stringify(overrides))
    .run()

  return okJson({ path })
}
