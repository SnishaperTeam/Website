import { requireUser } from '../../../../_shared/auth'
import { getDb } from '../../../../_shared/db'
import { json, type Env } from '../../../../_shared/types'

interface AccountRow {
  provider: string
  provider_user_id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const rows = await getDb(context.env)
    .prepare('SELECT provider, provider_user_id, email, display_name, avatar_url, created_at FROM oauth_accounts WHERE user_id = ? ORDER BY created_at ASC')
    .bind(auth.userId)
    .all<AccountRow>()

  return json({
    accounts: rows.results.map((row) => ({
      provider: row.provider,
      email: row.email,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
    })),
  })
}
