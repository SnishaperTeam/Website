import { getDb } from './db'
import type { Env } from './types'

let ensured = false

export async function ensureSchema(env: Env): Promise<void> {
  if (ensured) return
  const db = getDb(env)
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      nickname TEXT NOT NULL,
      avatar_url TEXT,
      banned INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ).run()
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)').run()
  ensured = true
}
