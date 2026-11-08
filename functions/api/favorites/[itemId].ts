import { requireUser } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { json, type Env } from '../../_shared/types'

export const onRequestDelete = async (context: {
  request: Request
  env: Env
  params: { itemId: string }
}) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  await getDb(context.env)
    .prepare('DELETE FROM user_favorites WHERE user_id = ? AND item_id = ?')
    .bind(auth.userId, context.params.itemId)
    .run()

  return json({ ok: true })
}
