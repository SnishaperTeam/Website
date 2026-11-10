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

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS user_posts (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT NOT NULL,
      category TEXT,
      color TEXT,
      tags TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ).run()
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_posts_slug ON user_posts (slug)').run()
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_posts_author ON user_posts (author_id)').run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_slug TEXT NOT NULL,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ).run()
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments (post_slug)').run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS user_favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      item_title TEXT NOT NULL,
      item_description TEXT,
      item_icon TEXT,
      item_color TEXT,
      item_type TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, item_id)
    )`,
  ).run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS user_test_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      test_id TEXT NOT NULL,
      test_title TEXT NOT NULL,
      score INTEGER,
      max_score INTEGER,
      level TEXT,
      completed_at TEXT NOT NULL,
      UNIQUE(user_id, test_id)
    )`,
  ).run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS page_edits (
      path TEXT PRIMARY KEY,
      overrides TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ).run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      link TEXT NOT NULL,
      external INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ).run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS oauth_accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_user_id TEXT NOT NULL,
      email TEXT,
      display_name TEXT,
      avatar_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(provider, provider_user_id)
    )`,
  ).run()
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_oauth_user ON oauth_accounts (user_id)').run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS oauth_tickets (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      provider_user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      display_name TEXT,
      avatar_url TEXT,
      expires_at INTEGER NOT NULL,
      consumed INTEGER NOT NULL DEFAULT 0
    )`,
  ).run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS oauth_codes (
      code TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )`,
  ).run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS otp_codes (
      email TEXT NOT NULL,
      purpose TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      PRIMARY KEY(email, purpose)
    )`,
  ).run()

  ensured = true
}
