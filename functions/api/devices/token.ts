import { readBody, str } from '../../_shared/auth'
import { sha256Hex, signJwt } from '../../_shared/crypto'
import { getDb } from '../../_shared/db'
import { fail, json, newId, toPrivateUser, type Env, type UserRow } from '../../_shared/types'

// 桌面端用登录码换 30 天凭证（JWT，带 jti 指向 devices 行，吊销即失效）
export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const code = str(body.code).toUpperCase()
  const deviceName = str(body.deviceName).slice(0, 64) || '未知设备'
  if (!/^[A-Z2-9]{8}$/.test(code)) return fail('登录码格式不正确')

  const now = Math.floor(Date.now() / 1000)
  const row = await getDb(context.env)
    .prepare('SELECT * FROM device_login_codes WHERE code_hash = ? AND used = 0 AND expires_at > ? ORDER BY expires_at DESC LIMIT 1')
    .bind(await sha256Hex(code), now)
    .first<{ id: string; user_id: string }>()
  if (!row) return fail('登录码无效或已过期', 401)

  // 一次性：立即标记已用，防止重放（并发窗口极小，单人使用可接受）
  await getDb(context.env)
    .prepare('UPDATE device_login_codes SET used = 1 WHERE id = ?')
    .bind(row.id)
    .run()

  const user = await getDb(context.env).prepare('SELECT * FROM users WHERE id = ?')
    .bind(row.user_id)
    .first<UserRow>()
  if (!user) return fail('账号不存在', 401)
  if (user.banned) return fail('账号已被封禁', 403)

  const deviceId = newId()
  await getDb(context.env)
    .prepare('INSERT INTO devices (id, user_id, device_name) VALUES (?, ?, ?)')
    .bind(deviceId, user.id, deviceName)
    .run()

  await getDb(context.env)
    .prepare('DELETE FROM device_login_codes WHERE id = ?')
    .bind(row.id)
    .run()

  const token = await signJwt({ sub: user.id, email: user.email, jti: deviceId }, context.env.JWT_SECRET)
  return json({ token, user: toPrivateUser(user), deviceId })
}
