const ORIGIN = 'https://gpthbupoyolrowazdexm.supabase.co'
const UPLOAD_RE = /^\/storage\/v1\/object\/website-media\/(avatar|post)\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'authorization,apikey,content-type,x-app-key,x-supabase-api-version',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'access-control-max-age': '86400',
  }
}

function json(body, status, extra) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json', ...(extra || {}) },
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname
    const cors = corsHeaders()

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }
    if (path === '/health') {
      return json({ ok: true }, 200)
    }

    const publicRead = request.method === 'GET' && path.startsWith('/storage/v1/object/public/')
    const key = request.headers.get('x-app-key') || url.searchParams.get('k')
    if (!publicRead && key !== env.APP_CLIENT_KEY) {
      return json({ error: 'forbidden' }, 403)
    }

    const search = new URLSearchParams(url.search)
    search.delete('k')
    const qs = search.toString()
    const target = ORIGIN + path + (qs ? '?' + qs : '')

    const headers = new Headers(request.headers)
    headers.delete('host')
    headers.delete('cf-connecting-ip')
    headers.delete('cf-ipcountry')
    headers.delete('cf-ray')
    headers.delete('x-app-key')
    headers.delete('x-forwarded-proto')
    headers.delete('x-real-ip')

    let init
    if (request.method === 'POST' && UPLOAD_RE.test(path)) {
      const len = Number(headers.get('content-length') || '0')
      const type = headers.get('content-type') || ''
      if (!len || len > 3 * 1024 * 1024 || !type.startsWith('image/')) {
        return json({ error: 'invalid upload' }, 400)
      }
      const uploadHeaders = new Headers()
      uploadHeaders.set('apikey', env.SUPABASE_SECRET_KEY)
      uploadHeaders.set('Authorization', 'Bearer ' + env.SUPABASE_SECRET_KEY)
      uploadHeaders.set('Content-Type', type)
      uploadHeaders.set('x-upsert', 'false')
      init = { method: 'POST', headers: uploadHeaders, body: request.body, duplex: 'half' }
    } else {
      init = { method: request.method, headers, redirect: 'manual' }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = request.body
        init.duplex = 'half'
      }
    }
    const res = await fetch(target, init)
    const out = new Headers(res.headers)
    for (const [name, value] of Object.entries(cors)) {
      out.set(name, value)
    }
    return new Response(res.body, { status: res.status, headers: out })
  },
}
