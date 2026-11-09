import { requireAdmin, okJson, type AdminEnv } from '../../../_shared/adminAuth'
import { getDb } from '../../../_shared/db'
import type { UserRow } from '../../../_shared/types'

export const onRequestGet = async (context: { request: Request; env: AdminEnv }) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const db = getDb(context.env)
  const rows = await db
    .prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT 200')
    .all<UserRow>()

  const links = await db
    .prepare('SELECT user_id, provider FROM oauth_accounts')
    .all<{ user_id: string; provider: string }>()
  const byUser = new Map<string, string[]>()
  for (const link of links.results) {
    const list = byUser.get(link.user_id) || []
    list.push(link.provider)
    byUser.set(link.user_id, list)
  }

  return okJson({
    users: rows.results.map((row) => ({
      id: row.id,
      email: row.email,
      nickname: row.nickname,
      avatarUrl: row.avatar_url,
      banned: !!row.banned,
      hasPassword: !!row.password_hash,
      oauthProviders: byUser.get(row.id) || [],
      createdAt: row.created_at,
    })),
  })
}
