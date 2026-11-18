import { requireUser } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { json, type Env } from '../../_shared/types'

export interface DeviceRow {
  id: string
  device_name: string
  created_at: string
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const { results } = await getDb(context.env)
    .prepare('SELECT id, device_name, created_at FROM devices WHERE user_id = ? ORDER BY created_at DESC')
    .bind(auth.userId)
    .all<DeviceRow>()

  return json({ devices: results })
}
