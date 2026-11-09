import { requireUser } from '../../../../_shared/auth'
import { sealData } from '../../../../_shared/oauth'
import { json, type Env } from '../../../../_shared/types'

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const ticket = await sealData(
    { uid: auth.userId, exp: Date.now() + 600000 },
    context.env.JWT_SECRET,
  )
  return json({ ticket })
}
