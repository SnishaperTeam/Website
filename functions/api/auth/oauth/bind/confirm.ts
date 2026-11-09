import { readBody, str } from '../../../../_shared/auth'
import { hashPassword } from '../../../../_shared/crypto'
import { getDb } from '../../../../_shared/db'
import { bindAccount, issueCode } from '../../../../_shared/oauthFlow'
import type { OAuthProfile, Provider } from '../../../../_shared/oauth'
import { fail, json, type Env } from '../../../../_shared/types'
import type { UserRow } from '../../../../_shared/types'

interface TicketRow {
  id: string
  provider: string
  provider_user_id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  expires_at: number
  consumed: number
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const ticketId = str(body.ticket)
  const password = str(body.password)
  if (!ticketId || !password) return fail('请输入密码完成绑定')

  const db = getDb(context.env)
  const ticket = await db.prepare('SELECT * FROM oauth_tickets WHERE id = ?')
    .bind(ticketId)
    .first<TicketRow>()
  if (!ticket || ticket.consumed || ticket.expires_at < Date.now()) {
    return fail('绑定请求已过期，请重新授权', 401)
  }

  const user = await db.prepare('SELECT * FROM users WHERE email = ?')
    .bind(ticket.email)
    .first<UserRow>()
  if (!user) return fail('账号不存在', 404)
  if (user.banned) return fail('账号已被封禁', 403)

  if (user.password_hash) {
    const hash = await hashPassword(password, user.password_salt)
    if (hash !== user.password_hash) return fail('密码错误', 401)
  }

  const profile: OAuthProfile = {
    provider: ticket.provider as Provider,
    providerUserId: ticket.provider_user_id,
    email: ticket.email,
    displayName: ticket.display_name || ticket.email.split('@')[0],
    avatarUrl: ticket.avatar_url,
  }
  await bindAccount(db, user.id, profile)
  await db.prepare('UPDATE oauth_tickets SET consumed = 1 WHERE id = ?').bind(ticketId).run()

  const code = await issueCode(db, user.id)
  return json({ code })
}
