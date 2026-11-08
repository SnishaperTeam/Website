import {
  isExpired,
  jsonResponse,
  publicNotice,
  readDocument,
  requireAdmin,
  sanitizeNotice,
  writeDocument,
  type NoticeRecord,
  type StoreEnv,
} from '../_lib/notices-store'

export const onRequestOptions = async (): Promise<Response> => jsonResponse({ ok: true })

export const onRequestGet = async (context: any): Promise<Response> => {
  const request = context.request as Request
  const env = context.env as StoreEnv
  const url = new URL(request.url)
  const includeExpired = ['1', 'true', 'yes'].includes((url.searchParams.get('all') || '').toLowerCase())
  const limitRaw = Number(url.searchParams.get('limit') || '0')
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 200) : 0
  try {
    const { document, source } = await readDocument(env, {
      bypassCache: url.searchParams.get('fresh') === '1',
    })
    const now = Date.now()
    let notices = document.notices.filter((item) => includeExpired || !isExpired(item, now))
    if (limit > 0) notices = notices.slice(0, limit)
    const payload = {
      ok: true,
      version: document.version,
      updated_at: document.updated_at,
      count: notices.length,
      total: document.notices.length,
      source,
      notices: notices.map(publicNotice),
    }
    return jsonResponse(payload, 200, {
      'Cache-Control': 'public, max-age=30',
      ETag: `"v${document.version}"`,
    })
  } catch (error) {
    return jsonResponse({ ok: false, error: String((error as Error)?.message || error) }, 502)
  }
}

export const onRequestPost = async (context: any): Promise<Response> => {
  const request = context.request as Request
  const env = context.env as StoreEnv
  const denied = requireAdmin(request, env)
  if (denied) return denied
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400)
  }
  let notice: NoticeRecord
  try {
    notice = sanitizeNotice(body)
  } catch (error) {
    return jsonResponse({ ok: false, error: String((error as Error)?.message || error) }, 400)
  }
  try {
    const { document, sha } = await readDocument(env, { bypassCache: true })
    const existing = document.notices.findIndex((item) => item.id === notice.id)
    const notices = document.notices.filter((item) => item.id !== notice.id)
    notices.unshift(notice)
    notices.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return String(b.published_at).localeCompare(String(a.published_at))
    })
    const next = {
      version: document.version + 1,
      updated_at: new Date().toISOString(),
      notices: notices.map(publicNotice),
    }
    await writeDocument(env, next, sha, `notice: publish ${notice.id}`)
    return jsonResponse({ ok: true, replaced: existing >= 0, version: next.version, notice }, existing >= 0 ? 200 : 201)
  } catch (error) {
    return jsonResponse({ ok: false, error: String((error as Error)?.message || error) }, 502)
  }
}
