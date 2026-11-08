import { requireAdmin, okJson, type AdminEnv } from '../../../_shared/adminAuth'
import { getDb } from '../../../_shared/db'

export const onRequestDelete = async (context: {
  request: Request
  env: AdminEnv
  params: { id: string }
}) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  await getDb(context.env).prepare('DELETE FROM comments WHERE id = ?').bind(context.params.id).run()
  return okJson({ id: context.params.id })
}
