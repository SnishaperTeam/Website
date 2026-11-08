import { ensureSchema } from '../_shared/schema'
import type { Env } from '../_shared/types'

export const onRequest = async (
  context: { request: Request; env: Env; next: () => Promise<Response> },
) => {
  await ensureSchema(context.env)
  return context.next()
}
