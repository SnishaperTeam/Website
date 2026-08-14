export interface Env {
  TURNSTILE_SECRET: string
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const request = context.request

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const { token } = await request.json()
    if (!token) {
      return Response.json({ error: 'Missing turnstile token' }, { status: 400 })
    }

    const ip = request.headers.get('CF-Connecting-IP') || ''

    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: context.env.TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    })

    const result = await r.json()

    if (!result.success) {
      return Response.json({ success: false, 'error-codes': result['error-codes'] }, { status: 403 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
