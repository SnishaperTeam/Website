import {
  authorizeUrl,
  flowCookie,
  isConfigured,
  isProvider,
  openData,
  pkceChallenge,
  randomToken,
  sealFlow,
  type OAuthEnv,
} from '../../../../_shared/oauth'
import { callbackUri } from '../../../../_shared/oauthFlow'

export const onRequestGet = async (context: {
  request: Request
  env: OAuthEnv
  params: { provider: string }
}) => {
  const provider = context.params.provider
  if (!isProvider(provider)) {
    return new Response('unknown provider', { status: 404 })
  }
  if (!isConfigured(context.env, provider)) {
    const origin = new URL(context.request.url).origin
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${origin}/auth?oauth_error=${encodeURIComponent('该登录方式尚未配置')}`,
        'Cache-Control': 'no-store',
      },
    })
  }

  const origin = new URL(context.request.url).origin
  const redirectUri = callbackUri(origin, provider)
  const state = randomToken(24)
  const verifier = randomToken(48)
  const challenge = await pkceChallenge(verifier)
  const bindParam = new URL(context.request.url).searchParams.get('bind') || ''
  const bindData = bindParam
    ? await openData<{ uid: string }>(bindParam, context.env.JWT_SECRET)
    : null

  const flow = await sealFlow(
    {
      state,
      verifier,
      provider,
      redirectBase: origin,
      bindUserId: bindData?.uid,
      exp: Date.now() + 600000,
    },
    context.env.JWT_SECRET,
  )

  const secure = origin.startsWith('https')
  const location = authorizeUrl(context.env, provider, { redirectUri, state, challenge })
  const response = new Response(null, {
    status: 302,
    headers: { 'Cache-Control': 'no-store' },
  })
  const headers = new Headers(response.headers)
  headers.set('Location', location)
  headers.append('Set-Cookie', flowCookie(flow, secure))
  return new Response(null, { status: 302, headers })
}
