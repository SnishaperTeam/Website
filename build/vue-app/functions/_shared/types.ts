export interface D1Statement {
  bind(...values: unknown[]): D1Statement
  first<T = unknown>(): Promise<T | null>
  all<T = unknown>(): Promise<{ results: T[] }>
  run(): Promise<unknown>
}

export interface D1Database {
  prepare(query: string): D1Statement
}

export interface Env {
  DB: D1Database
  D1_API_TOKEN: string
  JWT_SECRET: string
  SMTP_USER: string
  SMTP_PASSWORD: string
  SMTP_FROM?: string
}

export interface UserRow {
  id: string
  email: string
  password_hash: string
  password_salt: string
  nickname: string
  avatar_url: string | null
  banned: number
  created_at: string
  updated_at: string
}

export interface PublicUser {
  id: string
  nickname: string
  avatarUrl: string | null
  createdAt: string
}

export interface PrivateUser extends PublicUser {
  email: string
}

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    nickname: row.nickname,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  }
}

export function toPrivateUser(row: UserRow): PrivateUser {
  return {
    id: row.id,
    email: row.email,
    nickname: row.nickname,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  }
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

export function fail(message: string, status = 400): Response {
  return json({ error: message }, status)
}

export function newId(): string {
  return crypto.randomUUID()
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
