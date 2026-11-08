import { getDb } from './db'
import { fail, type Env, type UserRow } from './types'
import { verifyJwt } from './crypto'

export interface AuthedRequest {
  userId: string
  email: string
  row: UserRow
}

export async function requireUser(request: Request, env: Env): Promise<AuthedRequest | Response> {
  const header = request.headers.get('Authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return fail('未登录', 401)
  const payload = await verifyJwt(token, env.JWT_SECRET)
  if (!payload) return fail('登录已过期，请重新登录', 401)
  const row = await getDb(env).prepare('SELECT * FROM users WHERE id = ?')
    .bind(payload.sub)
    .first<UserRow>()
  if (!row) return fail('账号不存在', 401)
  if (row.banned) return fail('账号已被封禁', 403)
  return { userId: row.id, email: row.email, row }
}

export async function readBody(request: Request): Promise<Record<string, unknown> | Response> {
  try {
    const data = await request.json()
    if (!data || typeof data !== 'object') return fail('请求格式错误', 400)
    return data as Record<string, unknown>
  } catch {
    return fail('请求格式错误', 400)
  }
}

export function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}
