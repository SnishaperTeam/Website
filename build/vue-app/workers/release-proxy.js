class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...extraHeaders,
    },
  })
}

function clampInt(value, fallback, min, max) {
  const n = value ? parseInt(value, 10) : NaN
  if (Number.isNaN(n)) return fallback
  return Math.min(Math.max(n, min), max)
}

function mapRelease(raw) {
  return {
    tagName: raw.tag_name,
    name: raw.name,
    publishedAt: raw.published_at,
    body: raw.body,
    htmlUrl: raw.html_url,
    prerelease: raw.prerelease,
    draft: raw.draft,
    zipballUrl: raw.zipball_url,
    tarballUrl: raw.tarball_url,
    assets: (raw.assets || []).map((a) => ({
      name: a.name,
      size: a.size,
      downloadCount: a.download_count,
      browserDownloadUrl: a.browser_download_url,
    })),
  }
}

function githubHeaders(env) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'github-release-proxy-worker',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`
  return headers
}

async function fetchReleases(repo, limit, env) {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=${limit}`, {
    headers: githubHeaders(env),
  })

  if (!res.ok) {
    if (res.status === 404) throw new HttpError(404, `repository not found: ${repo}`)
    if (res.status === 403 || res.status === 429) {
      throw new HttpError(res.status, 'github api rate limit exceeded, set GITHUB_TOKEN env var to raise the limit')
    }
    throw new HttpError(res.status, `github api error: ${res.status}`)
  }

  const rateLimit = {
    limit: res.headers.get('x-ratelimit-limit'),
    remaining: res.headers.get('x-ratelimit-remaining'),
    reset: res.headers.get('x-ratelimit-reset'),
  }

  const releases = (await res.json()).map((r) => mapRelease(r))
  return { releases, rateLimit }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    if (request.method !== 'GET') {
      return json({ ok: false, error: 'method not allowed' }, 405)
    }

    const path = url.pathname

    if (path === '/' || path === '/health') {
      return json({ ok: true, service: 'github-release-proxy' })
    }

    if (path === '/api/diag') {
      const res = await fetch('https://api.github.com/rate_limit', { headers: githubHeaders(env) })
      const limit = res.headers.get('x-ratelimit-limit')
      const remaining = res.headers.get('x-ratelimit-remaining')
      const reset = res.headers.get('x-ratelimit-reset')
      return json({
        ok: true,
        tokenConfigured: !!env.GITHUB_TOKEN,
        authenticated: limit === '5000',
        authMode: limit === '5000' ? 'token' : 'anonymous',
        rateLimit: {
          limit,
          remaining,
          reset,
          resetAt: reset ? new Date(parseInt(reset, 10) * 1000).toISOString() : null,
        },
      })
    }

    const repo = url.searchParams.get('repo')
    if (!repo) {
      return json({ ok: false, error: 'missing "repo" query param, e.g. /api/latest?repo=owner/name' }, 400)
    }
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
      return json({ ok: false, error: 'invalid repo, expected owner/name' }, 400)
    }

    const ttl = clampInt(env.CACHE_TTL_SECONDS || '3600', 3600, 60, 86400)
    const cacheKey = new Request(
      `https://release-proxy.internal/?path=${path}&repo=${repo}&limit=${url.searchParams.get('limit') || ''}&pre=${url.searchParams.get('includePrerelease') || ''}`,
    )

    try {
      const cached = await caches.default.match(cacheKey)
      if (cached) return cached

      let data = null
      let rateLimit = null

      if (path === '/api/latest') {
        const includePrerelease = url.searchParams.get('includePrerelease') === 'true'
        const { releases, rateLimit: rl } = await fetchReleases(repo, 10, env)
        rateLimit = rl
        const found = releases.find((r) => !r.draft && (includePrerelease || !r.prerelease))
        data = found ? mapRelease(found) : null
      } else if (path === '/api/releases') {
        const limit = clampInt(url.searchParams.get('limit'), 10, 1, 30)
        const { releases, rateLimit: rl } = await fetchReleases(repo, limit, env)
        rateLimit = rl
        data = releases.filter((r) => !r.draft)
      } else {
        return json({ ok: false, error: 'not found' }, 404)
      }

      const rateLimitHeaders = {}
      if (rateLimit) {
        if (rateLimit.limit) rateLimitHeaders['X-RateLimit-Limit'] = rateLimit.limit
        if (rateLimit.remaining) rateLimitHeaders['X-RateLimit-Remaining'] = rateLimit.remaining
        if (rateLimit.reset) rateLimitHeaders['X-RateLimit-Reset'] = rateLimit.reset
      }

      const response = json(
        { ok: true, repo, data, rateLimit },
        200,
        { 'Cache-Control': `public, max-age=${ttl}`, ...rateLimitHeaders },
      )
      ctx.waitUntil(caches.default.put(cacheKey, response.clone()))
      return response
    } catch (e) {
      if (e instanceof HttpError) return json({ ok: false, error: e.message }, e.status)
      return json({ ok: false, error: 'internal error' }, 500)
    }
  },
}
