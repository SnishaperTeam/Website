import { readBody, str } from '../../_shared/auth'
import { signJwt } from '../../_shared/crypto'
import {
  failJson,
  okJson,
  resolveAdmin,
  verifyAdminCredentials,
  type AdminEnv,
} from '../../_shared/adminAuth'
import { toPrivateUser } from '../../_shared/types'

export const onRequestGet = async (context: { request: Request; env: AdminEnv }) => {
  const row = await resolveAdmin(context.request, context.env)
  if (!row) return failJson('unauthorized', 401)
  return okJson({ admin: true, user: toPrivateUser(row) })
}

export const onRequestPost = async (context: { request: Request; env: AdminEnv }) => {
  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const email = str(body.email).toLowerCase()
  const password = str(body.password)
  if (!email || !password) return failJson('email_and_password_required', 400)

  const row = await verifyAdminCredentials(email, password, context.env)
  if (!row) return failJson('invalid_credentials', 401)

  const token = await signJwt({ sub: row.id, email: row.email }, context.env.JWT_SECRET)
  return okJson({ admin: true, token, user: toPrivateUser(row) })
}
