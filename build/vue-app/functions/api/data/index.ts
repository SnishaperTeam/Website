import { requireUser } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { json, type Env } from '../../_shared/types'

// 用户 KV 数据：列出全部 key（桌面端云同步用）
export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const { results } = await getDb(context.env)
    .prepare('SELECT key FROM user_data WHERE user_id = ? ORDER BY key')
    .bind(auth.userId)
    .all<{ key: string }>()

  return json({ keys: results.map((r) => r.key) })
}
