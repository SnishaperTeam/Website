import type { Env } from './types'

export type Provider = 'github' | 'google' | 'microsoft'

export interface OAuthEnv extends Env {
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  MICROSOFT_CLIENT_ID?: string
  MICROSOFT_CLIENT_SECRET?: string
}

export interface OAuthProfile {
  provider: Provider
  providerUserId: string
  email: string
  displayName: string
  avatarUrl: string | null
}

export const PROVIDERS: Provider[] = ['github', 'google', 'microsoft']

export function isProvider(value: string): value is Provider {
  return PROVIDERS.includes(value as Provider)
}

function credentials(env: OAuthEnv, provider: Provider) {
  const prefix = provider.toUpperCase()
  const clientId = ((env as unknown as Record<string, string>)[`${prefix}_CLIENT_ID`] || '').trim()
  const clientSecret = ((env as unknown as Record<string, string>)[`${prefix}_CLIENT_SECRET`] || '').trim()
  return { clientId, clientSecret }
}

export function isConfigured(env: OAuthEnv, provider: Provider) {
  const { clientId, clientSecret } = credentials(env, provider)
  return !!clientId && !!clientSecret
}

function b64url(input: ArrayBuffer | string): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input)
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64url(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4)
  const raw = atob(padded)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

export function randomToken(bytes = 32): string {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return b64url(arr.buffer as ArrayBuffer)
}

export async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return b64url(digest)
}

async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export interface FlowState {
  state: string
  verifier: string
  provider: Provider
  redirectBase: string
  bindUserId?: string
  exp: number
}

export async function sealData(data: unknown, secret: string): Promise<string> {
  const payload = b64url(JSON.stringify(data))
  return `${payload}.${await hmacHex(secret, payload)}`
}

export async function openData<T>(value: string, secret: string): Promise<T | null> {
  const dot = value.indexOf('.')
  if (dot <= 0) return null
  const payload = value.slice(0, dot)
  if ((await hmacHex(secret, payload)) !== value.slice(dot + 1)) return null
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as T & { exp?: number }
    if (!data.exp || data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

export async function sealFlow(flow: FlowState, secret: string): Promise<string> {
  return sealData(flow, secret)
}

export async function openFlow(value: string, secret: string): Promise<FlowState | null> {
  return openData<FlowState>(value, secret)
}

export function redirect(location: string): Response {
  return new Response(null, {
    status: 302,
    headers: { Location: location, 'Cache-Control': 'no-store' },
  })
}

export function redirectWithCookies(location: string, cookies: string[]): Response {
  const headers = new Headers({ Location: location, 'Cache-Control': 'no-store' })
  for (const cookie of cookies) headers.append('Set-Cookie', cookie)
  return new Response(null, { status: 302, headers })
}

export function flowCookie(value: string, secure = true): string {
  const flag = secure ? '; Secure' : ''
  return `oauth_flow=${value}; Path=/; HttpOnly${flag}; SameSite=Lax; Max-Age=600`
}

export function clearFlowCookie(secure = true): string {
  const flag = secure ? '; Secure' : ''
  return `oauth_flow=; Path=/; HttpOnly${flag}; SameSite=Lax; Max-Age=0`
}

export function readCookie(request: Request, name: string): string {
  const raw = request.headers.get('Cookie') || ''
  for (const part of raw.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return rest.join('=')
  }
  return ''
}

export function authorizeUrl(
  env: OAuthEnv,
  provider: Provider,
  params: { redirectUri: string; state: string; challenge: string },
): string {
  const { clientId } = credentials(env, provider)
  const q = new URLSearchParams()
  q.set('client_id', clientId)
  q.set('redirect_uri', params.redirectUri)
  q.set('state', params.state)
  q.set('code_challenge', params.challenge)
  q.set('code_challenge_method', 'S256')
  if (provider === 'github') {
    q.set('scope', 'read:user user:email')
    return `https://github.com/login/oauth/authorize?${q}`
  }
  q.set('response_type', 'code')
  q.set('scope', provider === 'google' ? 'openid email profile' : 'openid email profile User.Read')
  if (provider === 'microsoft') q.set('response_mode', 'query')
  return provider === 'google'
    ? `https://accounts.google.com/o/oauth2/v2/auth?${q}`
    : `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${q}`
}

export async function fetchProfile(
  env: OAuthEnv,
  provider: Provider,
  input: { code: string; verifier: string; redirectUri: string },
): Promise<OAuthProfile> {
  const { clientId, clientSecret } = credentials(env, provider)
  const tokenEndpoint =
    provider === 'github'
      ? 'https://github.com/login/oauth/access_token'
      : provider === 'google'
        ? 'https://oauth2.googleapis.com/token'
        : 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: input.code,
    redirect_uri: input.redirectUri,
    grant_type: 'authorization_code',
    code_verifier: input.verifier,
  })

  const tokenRes = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  })
  const tokenData = (await tokenRes.json()) as { access_token?: string; error_description?: string }
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || 'oauth token exchange failed')
  }
  const bearer = { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'SnishaperTeam-Website' }

  if (provider === 'github') {
    const userRes = await fetch('https://api.github.com/user', { headers: bearer })
    const user = (await userRes.json()) as { id?: number; login?: string; name?: string; avatar_url?: string }
    if (!user.id) throw new Error('github profile unavailable')
    const mailRes = await fetch('https://api.github.com/user/emails', { headers: bearer })
    const mails = (await mailRes.json()) as { email: string; primary: boolean; verified: boolean }[]
    const verified = Array.isArray(mails) ? mails.find((m) => m.primary && m.verified) : null
    if (!verified) throw new Error('github email is not verified')
    return {
      provider,
      providerUserId: String(user.id),
      email: verified.email.toLowerCase(),
      displayName: user.name || user.login || verified.email.split('@')[0],
      avatarUrl: user.avatar_url || null,
    }
  }

  if (provider === 'google') {
    const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: bearer })
    const user = (await res.json()) as {
      sub?: string
      email?: string
      email_verified?: boolean
      name?: string
      picture?: string
    }
    if (!user.sub || !user.email || user.email_verified !== true) {
      throw new Error('google email is not verified')
    }
    return {
      provider,
      providerUserId: user.sub,
      email: user.email.toLowerCase(),
      displayName: user.name || user.email.split('@')[0],
      avatarUrl: user.picture || null,
    }
  }

  const res = await fetch('https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,userPrincipalName', {
    headers: bearer,
  })
  const user = (await res.json()) as {
    id?: string
    displayName?: string
    mail?: string
    userPrincipalName?: string
  }
  if (!user.id) throw new Error('microsoft profile unavailable')
  const email = (user.mail || user.userPrincipalName || '').toLowerCase()
  if (!email || !email.includes('@')) throw new Error('microsoft email unavailable')
  return {
    provider,
    providerUserId: user.id,
    email,
    displayName: user.displayName || email.split('@')[0],
    avatarUrl: null,
  }
}
