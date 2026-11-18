import { requireUser } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { json, type Env } from '../../_shared/types'

// 吊销设备：删除 devices 行，该设备 JWT 的 jti 校验随即失败（requireUser 401）
export const onRequestDelete = async (context: {
  request: Request
  env: Env
  params: { id: string }
}) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  await getDb(context.env)
    .prepare('DELETE FROM devices WHERE id = ? AND user_id = ?')
    .bind(context.params.id, auth.userId)
    .run()

  return json({ ok: true })
}
