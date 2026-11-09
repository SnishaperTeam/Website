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
  if (!path) return json({ overrides: {} })

  const row = await getDb(context.env)
    .prepare('SELECT overrides FROM page_edits WHERE path = ?')
    .bind(path)
    .first<{ overrides: string }>()
  if (!row) return json({ overrides: {} })

  try {
    const data = JSON.parse(row.overrides)
    if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ overrides: {} })
    return json({ overrides: data })
  } catch {
    return json({ overrides: {} })
  }
}

export const onRequestPost = async (context: { request: Request; env: AdminEnv }) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const path = normalizePath(str(body.path))
  if (!path) return failJson('path 不能为空', 400)
  const raw = body.overrides
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return failJson('overrides 格式错误', 400)
  }
  const entries = Object.entries(raw as Record<string, unknown>)
  if (entries.length > 2000) return failJson('内容过多', 400)
  const overrides: Record<string, string> = {}
  for (const [key, value] of entries) {
    if (key.length > 600 || typeof value !== 'string') continue
    overrides[key] = value
  }

  await getDb(context.env)
    .prepare(
      `INSERT INTO page_edits (path, overrides, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(path) DO UPDATE SET overrides = excluded.overrides, updated_at = excluded.updated_at`,
    )
    .bind(path, JSON.stringify(overrides))
    .run()

  return okJson({ path })
}
