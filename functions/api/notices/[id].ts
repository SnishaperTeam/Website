import {
  jsonResponse,
  publicNotice,
  readDocument,
  requireAdmin,
  sanitizeNotice,
  writeDocument,
  type StoreEnv,
} from '../../_lib/notices-store'

export const onRequestOptions = async (): Promise<Response> => jsonResponse({ ok: true })

export const onRequestGet = async (context: any): Promise<Response> => {
  const env = context.env as StoreEnv
  const id = String(context.params?.id || '')
  try {
    const { document } = await readDocument(env)
    const notice = document.notices.find((item) => item.id === id)
    if (!notice) return jsonResponse({ ok: false, error: 'not_found' }, 404)
    return jsonResponse({ ok: true, version: document.version, notice: publicNotice(notice) })
  } catch (error) {
    return jsonResponse({ ok: false, error: String((error as Error)?.message || error) }, 502)
  }
}

export const onRequestPatch = async (context: any): Promise<Response> => {
  const request = context.request as Request
  const env = context.env as StoreEnv
  const denied = requireAdmin(request, env)
  if (denied) return denied
  const id = String(context.params?.id || '')
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400)
  }
  try {
    const { document, sha } = await readDocument(env, { bypassCache: true })
    const previous = document.notices.find((item) => item.id === id)
    if (!previous) return jsonResponse({ ok: false, error: 'not_found' }, 404)
    const notice = sanitizeNotice({ ...(body as object), id }, previous)
    const notices = document.notices.filter((item) => item.id !== id)
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
    await writeDocument(env, next, sha, `notice: update ${id}`)
    return jsonResponse({ ok: true, version: next.version, notice })
  } catch (error) {
    return jsonResponse({ ok: false, error: String((error as Error)?.message || error) }, 502)
  }
}

export const onRequestDelete = async (context: any): Promise<Response> => {
  const request = context.request as Request
  const env = context.env as StoreEnv
  const denied = requireAdmin(request, env)
  if (denied) return denied
  const id = String(context.params?.id || '')
  try {
    const { document, sha } = await readDocument(env, { bypassCache: true })
    const notices = document.notices.filter((item) => item.id !== id)
    if (notices.length === document.notices.length) {
      return jsonResponse({ ok: false, error: 'not_found' }, 404)
    }
    const next = {
      version: document.version + 1,
      updated_at: new Date().toISOString(),
      notices: notices.map(publicNotice),
    }
    await writeDocument(env, next, sha, `notice: delete ${id}`)
    return jsonResponse({ ok: true, version: next.version, removed: id })
  } catch (error) {
    return jsonResponse({ ok: false, error: String((error as Error)?.message || error) }, 502)
  }
}
