import { resolveAdmin, type AdminEnv } from '../_shared/adminAuth'

export interface NoticeRecord {
  id: string
  title: string
  title_en?: string
  title_ru?: string
  body: string
  body_en?: string
  body_ru?: string
  level: string
  published_at: string
  expires_at?: string
  link?: string
  link_text?: string
  pinned?: boolean
}

export interface NoticeDocument {
  version: number
  updated_at: string
  notices: NoticeRecord[]
}

export interface StoreEnv {
  GITHUB_NOTICE_TOKEN?: string
  NOTICE_ADMIN_EMAIL?: string
  NOTICE_REPO?: string
  NOTICE_FILE?: string
  NOTICE_BRANCH?: string
}

export const SESSION_TTL_MS = 12 * 60 * 60 * 1000

export const CACHE_KEY = 'https://notices.jetcpp.ccwu.cc/api/notices'
export const CACHE_TTL = 60

const DEFAULT_REPO = 'SnishaperTeam/Website'
const DEFAULT_FILE = 'build/vue-app/notices/notices.json'
const DEFAULT_BRANCH = 'main'
const LEVELS = ['info', 'important', 'critical']
const USER_AGENT = 'snishaper-notice-service'

export function repoOf(env: StoreEnv): string {
  return (env.NOTICE_REPO || DEFAULT_REPO).trim()
}

export function fileOf(env: StoreEnv): string {
  return (env.NOTICE_FILE || DEFAULT_FILE).trim()
}

export function branchOf(env: StoreEnv): string {
  return (env.NOTICE_BRANCH || DEFAULT_BRANCH).trim()
}

export function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

export function fromBase64(input: string): string {
  const binary = atob(input.replace(/\s+/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

function contentsURL(env: StoreEnv): string {
  return `https://api.github.com/repos/${repoOf(env)}/contents/${fileOf(env)}`
}

function githubHeaders(env: StoreEnv): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': USER_AGENT,
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = (env.GITHUB_NOTICE_TOKEN || '').trim()
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

export function emptyDocument(): NoticeDocument {
  return { version: 0, updated_at: new Date(0).toISOString(), notices: [] }
}

export function normalizeDocument(raw: unknown): NoticeDocument {
  const fallback = emptyDocument()
  if (!raw || typeof raw !== 'object') return fallback
  const source = raw as Record<string, unknown>
  const list = Array.isArray(source.notices) ? source.notices : []
  const notices: NoticeRecord[] = []
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const entry = item as Record<string, unknown>
    const title = typeof entry.title === 'string' ? entry.title : ''
    const body = typeof entry.body === 'string' ? entry.body : ''
    if (!title && !body) continue
    notices.push({
      id: typeof entry.id === 'string' && entry.id ? entry.id : '',
      title,
      title_en: typeof entry.title_en === 'string' ? entry.title_en : undefined,
      title_ru: typeof entry.title_ru === 'string' ? entry.title_ru : undefined,
      body,
      body_en: typeof entry.body_en === 'string' ? entry.body_en : undefined,
      body_ru: typeof entry.body_ru === 'string' ? entry.body_ru : undefined,
      level: LEVELS.includes(String(entry.level)) ? String(entry.level) : 'info',
      published_at: typeof entry.published_at === 'string' ? entry.published_at : '',
      expires_at: typeof entry.expires_at === 'string' ? entry.expires_at : undefined,
      link: typeof entry.link === 'string' ? entry.link : undefined,
      link_text: typeof entry.link_text === 'string' ? entry.link_text : undefined,
      pinned: entry.pinned === true,
    })
  }
  notices.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return String(b.published_at).localeCompare(String(a.published_at))
  })
  return {
    version: typeof source.version === 'number' ? source.version : notices.length,
    updated_at: typeof source.updated_at === 'string' ? source.updated_at : fallback.updated_at,
    notices,
  }
}

export function isExpired(notice: NoticeRecord, now: number): boolean {
  if (!notice.expires_at) return false
  const ts = Date.parse(notice.expires_at)
  if (Number.isNaN(ts)) return false
  return ts <= now
}

export async function readDocument(
  env: StoreEnv,
  options: { bypassCache?: boolean } = {},
): Promise<{ document: NoticeDocument; sha: string | null; source: string; stale?: boolean }> {
  const cacheAvailable = typeof caches !== 'undefined' && options.bypassCache !== true
  if (cacheAvailable) {
    const hit = await caches.default.match(CACHE_KEY)
    if (hit) {
      try {
        const payload = (await hit.json()) as { document: NoticeDocument; sha: string | null }
        return { document: normalizeDocument(payload.document), sha: payload.sha ?? null, source: 'edge-cache' }
      } catch {
        // ignore broken cache entry
      }
    }
  }

  const url = `${contentsURL(env)}?ref=${encodeURIComponent(branchOf(env))}`
  const response = await fetch(url, { headers: githubHeaders(env) })
  if (response.status === 404) {
    return { document: emptyDocument(), sha: null, source: 'empty' }
  }
  if (!response.ok) {
    throw new Error(`github read failed: HTTP ${response.status}`)
  }
  const payload = (await response.json()) as { content?: string; sha?: string }
  const text = payload.content ? fromBase64(payload.content) : ''
  let document = emptyDocument()
  if (text.trim()) {
    document = normalizeDocument(JSON.parse(text))
  }
  const sha = typeof payload.sha === 'string' ? payload.sha : null
  if (cacheAvailable) {
    const body = JSON.stringify({ document, sha })
    const cached = new Response(body, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${CACHE_TTL}` },
    })
    await caches.default.put(CACHE_KEY, cached)
  }
  return { document, sha, source: 'github' }
}

export async function writeDocument(
  env: StoreEnv,
  document: NoticeDocument,
  sha: string | null,
  message: string,
): Promise<string | null> {
  const token = (env.GITHUB_NOTICE_TOKEN || '').trim()
  if (!token) {
    throw new Error('GITHUB_NOTICE_TOKEN is not configured')
  }
  const body: Record<string, string> = {
    message,
    content: toBase64(`${JSON.stringify(document, null, 2)}\n`),
    branch: branchOf(env),
  }
  if (sha) body.sha = sha
  const response = await fetch(contentsURL(env), {
    method: 'PUT',
    headers: { ...githubHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`github write failed: HTTP ${response.status} ${detail.slice(0, 240)}`)
  }
  const payload = (await response.json()) as { content?: { sha?: string } }
  await caches.default.delete(CACHE_KEY)
  return payload.content?.sha ?? null
}

export function timingSafeEq(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a)
  const right = new TextEncoder().encode(b)
  if (left.length !== right.length) return false
  let diff = 0
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i]
  return diff === 0
}

function bytesToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function b64url(text: string): string {
  return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromB64url(text: string): string {
  return atob(text.replace(/-/g, '+').replace(/_/g, '/'))
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return bytesToHex(signature)
}

export async function createSessionToken(secret: string): Promise<{ token: string; expires_at: string }> {
  const expiry = Date.now() + SESSION_TTL_MS
  const signature = await hmac(secret, `notice-session.${expiry}`)
  return {
    token: `${b64url(String(expiry))}.${signature}`,
    expires_at: new Date(expiry).toISOString(),
  }
}

export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  const dot = token.indexOf('.')
  if (dot <= 0 || dot === token.length - 1) return false
  let expiry = 0
  try {
    expiry = Number(fromB64url(token.slice(0, dot)))
  } catch {
    return false
  }
  if (!Number.isFinite(expiry) || expiry <= Date.now()) return false
  const signature = await hmac(secret, `notice-session.${expiry}`)
  return timingSafeEq(token.slice(dot + 1), signature)
}

const loginAttempts = new Map<string, { fails: number; lockedUntil: number }>()

export function loginGate(ip: string): Response | null {
  const state = loginAttempts.get(ip)
  if (state && state.lockedUntil > Date.now()) {
    const retryAfter = Math.ceil((state.lockedUntil - Date.now()) / 1000)
    return jsonResponse(
      { ok: false, error: 'too_many_attempts', retry_after: retryAfter },
      429,
      { 'Retry-After': String(retryAfter) },
    )
  }
  return null
}

export function recordLoginFailure(ip: string): void {
  const state = loginAttempts.get(ip) || { fails: 0, lockedUntil: 0 }
  state.fails += 1
  if (state.fails >= 5) {
    state.lockedUntil = Date.now() + 60 * 1000
    state.fails = 0
  }
  loginAttempts.set(ip, state)
}

export function recordLoginSuccess(ip: string): void {
  loginAttempts.delete(ip)
}

export async function requireAdmin(request: Request, env: StoreEnv): Promise<Response | null> {
  const row = await resolveAdmin(request, env as unknown as AdminEnv)
  if (row) return null
  return jsonResponse({ ok: false, error: 'unauthorized' }, 401)
}

export function jsonResponse(data: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Admin-Token',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Cache-Control': 'no-store',
      ...extra,
    },
  })
}

export function sanitizeNotice(input: unknown, previous?: NoticeRecord): NoticeRecord {
  if (!input || typeof input !== 'object') {
    throw new Error('notice payload must be an object')
  }
  const source = input as Record<string, unknown>
  const pick = (key: string): string => {
    const value = source[key]
    return typeof value === 'string' ? value.trim() : ''
  }
  const title = pick('title') || previous?.title || ''
  const body = pick('body') || previous?.body || ''
  if (!title) throw new Error('title is required')
  if (!body) throw new Error('body is required')
  const level = LEVELS.includes(pick('level')) ? pick('level') : previous?.level || 'info'
  const publishedAt = pick('published_at') || previous?.published_at || new Date().toISOString()
  const expiresAt = pick('expires_at') || previous?.expires_at || ''
  if (expiresAt && Number.isNaN(Date.parse(expiresAt))) {
    throw new Error('expires_at must be an ISO 8601 timestamp')
  }
  if (Number.isNaN(Date.parse(publishedAt))) {
    throw new Error('published_at must be an ISO 8601 timestamp')
  }
  const id = pick('id') || previous?.id || `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  return {
    id,
    title,
    title_en: pick('title_en') || previous?.title_en,
    title_ru: pick('title_ru') || previous?.title_ru,
    body,
    body_en: pick('body_en') || previous?.body_en,
    body_ru: pick('body_ru') || previous?.body_ru,
    level,
    published_at: publishedAt,
    expires_at: expiresAt || undefined,
    link: pick('link') || previous?.link,
    link_text: pick('link_text') || previous?.link_text,
    pinned: source.pinned === undefined ? Boolean(previous?.pinned) : source.pinned === true,
  }
}

export function publicNotice(notice: NoticeRecord): NoticeRecord {
  const output: NoticeRecord = { ...notice }
  if (!output.expires_at) delete output.expires_at
  return output
}
