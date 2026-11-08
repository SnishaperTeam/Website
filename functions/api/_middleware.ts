import { ensureSchema } from '../_shared/schema'
import type { Env } from '../_shared/types'

export const onRequest = async (
  context: { request: Request; env: Env; next: () => Promise<Response> },
) => {
  try {
    await ensureSchema(context.env)
    return await context.next()
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
    )
  }
}
