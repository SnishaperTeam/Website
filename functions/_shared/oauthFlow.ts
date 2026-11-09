import { randomToken, type OAuthEnv, type OAuthProfile } from './oauth'
import { toPrivateUser, type UserRow } from './types'
import { signJwt } from './crypto'
import type { D1Database } from './types'

export async function issueCode(db: D1Database, userId: string): Promise<string> {
  const code = randomToken(24)
  await db.prepare('INSERT INTO oauth_codes (code, user_id, expires_at) VALUES (?, ?, ?)')
    .bind(code, userId, Date.now() + 60000)
    .run()
  return code
}

export async function issueTicket(db: D1Database, profile: OAuthProfile): Promise<string> {
  const id = randomToken(24)
  await db.prepare(
    `INSERT INTO oauth_tickets (id, provider, provider_user_id, email, display_name, avatar_url, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      profile.provider,
      profile.providerUserId,
      profile.email,
      profile.displayName,
      profile.avatarUrl,
      Date.now() + 600000,
    )
    .run()
  return id
}

export async function bindAccount(
  db: D1Database,
  userId: string,
  profile: OAuthProfile,
): Promise<void> {
  await db.prepare(
    `INSERT INTO oauth_accounts (id, user_id, provider, provider_user_id, email, display_name, avatar_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(provider, provider_user_id) DO UPDATE SET
       user_id = excluded.user_id,
       email = excluded.email,
       display_name = excluded.display_name,
       avatar_url = excluded.avatar_url`,
  )
    .bind(
      crypto.randomUUID(),
      userId,
      profile.provider,
      profile.providerUserId,
      profile.email,
      profile.displayName,
      profile.avatarUrl,
    )
    .run()
}

export async function createOAuthUser(db: D1Database, profile: OAuthProfile): Promise<string> {
  const id = crypto.randomUUID()
  await db.prepare(
    `INSERT INTO users (id, email, password_hash, password_salt, nickname, avatar_url)
     VALUES (?, ?, '', '', ?, ?)`,
  )
    .bind(id, profile.email, profile.displayName.slice(0, 24), profile.avatarUrl)
    .run()
  return id
}

export async function sessionForUser(env: OAuthEnv, db: D1Database, userId: string) {
  const row = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<UserRow>()
  if (!row) throw new Error('user not found')
  const token = await signJwt({ sub: row.id, email: row.email }, env.JWT_SECRET)
  return { token, user: toPrivateUser(row) }
}

export function callbackUri(base: string, provider: string): string {
  return `${base}/api/auth/oauth/${provider}/callback`
}

export function frontendUrl(base: string, path: string): string {
  return `${base}${path}`
}
