import { readBody, str } from '../../_shared/auth'
import { signJwt } from '../../_shared/crypto'
import { resolveAdmin, verifyAdminCredentials, type AdminEnv } from '../../_shared/adminAuth'
import {
  jsonResponse,
  loginGate,
  recordLoginFailure,
  recordLoginSuccess,
} from '../../_lib/notices-store'

export const onRequestOptions = async (): Promise<Response> => jsonResponse({ ok: true })

export const onRequestGet = async (context: any): Promise<Response> => {
  const row = await resolveAdmin(context.request as Request, context.env as AdminEnv)
  if (!row) return jsonResponse({ ok: false, error: 'unauthorized' }, 401)
  return jsonResponse({ ok: true, authenticated: true })
}

export const onRequestPost = async (context: any): Promise<Response> => {
  const request = context.request as Request
  const env = context.env as AdminEnv

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const gated = loginGate(ip)
  if (gated) return gated

  const body = await readBody(request)
  if (body instanceof Response) return body
  const email = str(body.email).toLowerCase()
  const password = str(body.password)
  if (!email || !password) {
    return jsonResponse({ ok: false, error: 'email_and_password_required' }, 400)
  }

  const row = await verifyAdminCredentials(email, password, env)
  if (!row) {
    recordLoginFailure(ip)
    return jsonResponse({ ok: false, error: 'invalid_credentials' }, 401)
  }

  recordLoginSuccess(ip)
  const token = await signJwt({ sub: row.id, email: row.email }, env.JWT_SECRET)
  return jsonResponse({ ok: true, token, authenticated: true })
}
