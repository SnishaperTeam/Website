import { requireAdmin, okJson, type AdminEnv } from '../../../_shared/adminAuth'
import { getDb } from '../../../_shared/db'
import type { UserRow } from '../../../_shared/types'

export const onRequestGet = async (context: { request: Request; env: AdminEnv }) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const rows = await getDb(context.env)
    .prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT 200')
    .all<UserRow>()

  return okJson({
    users: rows.results.map((row) => ({
      id: row.id,
      email: row.email,
      nickname: row.nickname,
      avatarUrl: row.avatar_url,
      banned: !!row.banned,
      createdAt: row.created_at,
    })),
  })
}
