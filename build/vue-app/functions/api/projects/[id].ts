import { readBody, str } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { requireAdmin, okJson, failJson, type AdminEnv } from '../../_shared/adminAuth'

export const onRequestPatch = async (context: {
  request: Request
  env: AdminEnv
  params: { id: string }
}) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const updates: string[] = []
  const values: unknown[] = []
  for (const key of ['title', 'description', 'category', 'link'] as const) {
    if (body[key] !== undefined) {
      const value = str(body[key])
      if (!value) return failJson(`${key} 不能为空`, 400)
      updates.push(`${key} = ?`)
      values.push(value)
    }
  }
  if (body.external !== undefined) {
    updates.push('external = ?')
    values.push(body.external === true ? 1 : 0)
  }
  if (updates.length === 0) return failJson('没有需要更新的内容', 400)

  updates.push("updated_at = datetime('now')")
  values.push(context.params.id)

  await getDb(context.env)
    .prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run()

  return okJson({ id: context.params.id })
}

export const onRequestDelete = async (context: {
  request: Request
  env: AdminEnv
  params: { id: string }
}) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  await getDb(context.env).prepare('DELETE FROM projects WHERE id = ?').bind(context.params.id).run()
  return okJson({ id: context.params.id })
}
