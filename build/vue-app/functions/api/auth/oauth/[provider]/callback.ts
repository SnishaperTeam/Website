import {
  clearFlowCookie,
  fetchProfile,
  isProvider,
  openFlow,
  readCookie,
  type OAuthEnv,
} from '../../../../_shared/oauth'
import {
  bindAccount,
  callbackUri,
  createOAuthUser,
  issueCode,
  issueTicket,
} from '../../../../_shared/oauthFlow'
import { getDb } from '../../../../_shared/db'
import { redirectWithCookies } from '../../../../_shared/oauth'
import type { UserRow } from '../../../../_shared/types'

export const onRequestGet = async (context: {
  request: Request
  env: OAuthEnv
  params: { provider: string }
}) => {
  const provider = context.params.provider
  if (!isProvider(provider)) return new Response('unknown provider', { status: 404 })

  const url = new URL(context.request.url)
  const origin = new URL(context.request.url).origin
  const secure = origin.startsWith('https')
  const clear = clearFlowCookie(secure)
  const failRedirect = (message: string) =>
    redirectWithCookies(`${origin}/auth?oauth_error=${encodeURIComponent(message)}`, [clear])

  const code = url.searchParams.get('code') || ''
  const state = url.searchParams.get('state') || ''
  const flow = await openFlow(readCookie(context.request, 'oauth_flow'), context.env.JWT_SECRET)
  if (!code || !flow || flow.provider !== provider || flow.state !== state) {
    return failRedirect('授权状态无效或已过期')
  }

  let profile
  try {
    profile = await fetchProfile(context.env, provider, {
      code,
      verifier: flow.verifier,
      redirectUri: callbackUri(flow.redirectBase, provider),
    })
  } catch (e) {
    console.error('oauth profile fetch failed', e)
    return failRedirect('授权失败')
  }

  const db = getDb(context.env)
  const base = flow.redirectBase

  const bound = await db.prepare(
    'SELECT user_id FROM oauth_accounts WHERE provider = ? AND provider_user_id = ?',
  )
    .bind(provider, profile.providerUserId)
    .first<{ user_id: string }>()

  if (flow.bindUserId) {
    if (bound && bound.user_id !== flow.bindUserId) {
      return failRedirect('该第三方账号已绑定其他账号')
    }
    const target = await db.prepare('SELECT banned FROM users WHERE id = ?')
      .bind(flow.bindUserId)
      .first<{ banned: number }>()
    if (!target || target.banned) return failRedirect('账号不可用')
    await bindAccount(db, flow.bindUserId, profile)
    const loginCode = await issueCode(db, flow.bindUserId)
    return redirectWithCookies(`${base}/auth/oauth-callback?code=${encodeURIComponent(loginCode)}`, [clear])
  }

  if (bound) {
    const row = await db.prepare('SELECT banned FROM users WHERE id = ?')
      .bind(bound.user_id)
      .first<{ banned: number }>()
    if (!row || row.banned) return failRedirect('账号已被封禁')
    const loginCode = await issueCode(db, bound.user_id)
    return redirectWithCookies(`${base}/auth/oauth-callback?code=${encodeURIComponent(loginCode)}`, [clear])
  }

  const user = await db.prepare('SELECT * FROM users WHERE email = ?')
    .bind(profile.email)
    .first<UserRow>()
  if (user?.banned) return failRedirect('账号已被封禁')

  if (user && user.password_hash) {
    const ticket = await issueTicket(db, profile)
    return redirectWithCookies(`${base}/auth/oauth-bind?ticket=${encodeURIComponent(ticket)}`, [clear])
  }

  const userId = user ? user.id : await createOAuthUser(db, profile)
  await bindAccount(db, userId, profile)
  const loginCode = await issueCode(db, userId)
  return redirectWithCookies(`${base}/auth/oauth-callback?code=${encodeURIComponent(loginCode)}`, [clear])
}
