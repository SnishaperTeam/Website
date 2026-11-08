import {
  createSessionToken,
  jsonResponse,
  loginGate,
  recordLoginFailure,
  recordLoginSuccess,
  requireAdmin,
  timingSafeEq,
  type StoreEnv,
} from '../../_lib/notices-store'

export const onRequestOptions = async (): Promise<Response> => jsonResponse({ ok: true })

export const onRequestGet = async (context: any): Promise<Response> => {
  const request = context.request as Request
  const env = context.env as StoreEnv
  const denied = await requireAdmin(request, env)
  return denied || jsonResponse({ ok: true, authenticated: true })
}

export const onRequestPost = async (context: any): Promise<Response> => {
  const request = context.request as Request
  const env = context.env as StoreEnv

  const adminToken = (env.NOTICE_ADMIN_TOKEN || '').trim()
  const adminEmail = (env.NOTICE_ADMIN_EMAIL || '').trim()
  const adminPassword = env.NOTICE_ADMIN_PASSWORD || ''
  if (!adminToken || !adminEmail || !adminPassword) {
    return jsonResponse({ ok: false, error: 'admin_credentials_not_configured' }, 503)
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const gated = loginGate(ip)
  if (gated) return gated

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400)
  }
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  if (!email || !password) {
    return jsonResponse({ ok: false, error: 'email_and_password_required' }, 400)
  }

  const emailOk = timingSafeEq(email.toLowerCase(), adminEmail.toLowerCase())
  const passwordOk = timingSafeEq(password, adminPassword)
  if (!emailOk || !passwordOk) {
    recordLoginFailure(ip)
    return jsonResponse({ ok: false, error: 'invalid_credentials' }, 401)
  }

  recordLoginSuccess(ip)
  const session = await createSessionToken(adminToken)
  return jsonResponse({ ok: true, ...session })
}
