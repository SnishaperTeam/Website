import { hashPassword, verifyJwt } from './crypto'
import { getDb } from './db'
import type { Env, UserRow } from './types'

export interface AdminEnv extends Env {
  NOTICE_ADMIN_EMAIL?: string
}

export function adminEmailList(env: AdminEnv): string[] {
  return (env.NOTICE_ADMIN_EMAIL || '')
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function isAdminEmail(email: string, env: AdminEnv): boolean {
  return adminEmailList(env).includes(email.toLowerCase())
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
  env: AdminEnv,
): Promise<UserRow | null> {
  if (!email || !password) return null
  const row = await getDb(env)
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email.toLowerCase())
    .first<UserRow>()
  if (!row || row.banned || !row.password_hash) return null
  if (!isAdminEmail(row.email, env)) return null
  const hash = await hashPassword(password, row.password_salt)
  if (hash !== row.password_hash) return null
  return row
}

export async function resolveAdmin(request: Request, env: AdminEnv): Promise<UserRow | null> {
  const header = request.headers.get('Authorization') || ''
  const bearer = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : ''
  if (!bearer) return null
  const payload = await verifyJwt(bearer, env.JWT_SECRET)
  if (!payload?.sub) return null
  const row = await getDb(env)
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(payload.sub)
    .first<UserRow>()
  if (!row || row.banned) return null
  if (!isAdminEmail(row.email, env)) return null
  return row
}

export async function requireAdmin(request: Request, env: AdminEnv): Promise<Response | null> {
  if (await resolveAdmin(request, env)) return null
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
