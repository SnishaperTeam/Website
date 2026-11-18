import { requireUser } from '../../_shared/auth'
import { sha256Hex } from '../../_shared/crypto'
import { getDb } from '../../_shared/db'
import { json, newId, type Env } from '../../_shared/types'

// 设备登录码字符集：去掉易混淆的 0/O/1/I/L
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const CODE_TTL_SECONDS = 5 * 60

function genCode(): string {
  const arr = crypto.getRandomValues(new Uint8Array(8))
  let code = ''
  for (let i = 0; i < 8; i++) code += CODE_ALPHABET[arr[i] % CODE_ALPHABET.length]
  return code
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const code = genCode()
  const now = Math.floor(Date.now() / 1000)

  await getDb(context.env)
    .prepare('DELETE FROM device_login_codes WHERE expires_at < ?')
    .bind(now)
    .run()

  await getDb(context.env)
    .prepare('INSERT INTO device_login_codes (id, user_id, code_hash, expires_at) VALUES (?, ?, ?, ?)')
    .bind(newId(), auth.userId, await sha256Hex(code), now + CODE_TTL_SECONDS)
    .run()

  return json({ code, expiresAt: now + CODE_TTL_SECONDS })
}
