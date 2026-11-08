import type { Env } from './types'

function bytesToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function fromB64url(text: string): string {
  return atob(text.replace(/-/g, '+').replace(/_/g, '/'))
}

function timingSafeEq(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a)
  const right = new TextEncoder().encode(b)
  if (left.length !== right.length) return false
  let diff = 0
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i]
  return diff === 0
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

export async function verifyAdminToken(token: string, secret: string): Promise<boolean> {
  if (!secret) return false
  if (timingSafeEq(token, secret)) return true
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

export interface AdminEnv extends Env {
  NOTICE_ADMIN_TOKEN?: string
}

export async function requireAdmin(request: Request, env: AdminEnv): Promise<Response | null> {
  const secret = (env.NOTICE_ADMIN_TOKEN || '').trim()
  if (!secret) return failJson('admin_token_not_configured', 503)
  const header = request.headers.get('Authorization') || ''
  const bearer = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : ''
  const credential = bearer || (request.headers.get('X-Admin-Token') || '').trim()
  if (!credential) return failJson('unauthorized', 401)
  if (await verifyAdminToken(credential, secret)) return null
  return failJson('unauthorized', 401)
}

export function failJson(error: string, status: number): Response {
  return new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

export function okJson(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify({ ok: true, ...data }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
