import { getDb } from '../../_shared/db'
import { fail, json, toPublicUser, type Env, type UserRow } from '../../_shared/types'

export const onRequestGet = async (context: {
  request: Request
  env: Env
  params: { id: string }
}) => {
  const id = context.params.id
  if (!id) return fail('缺少用户 ID', 400)

  const row = await getDb(context.env).prepare(
    'SELECT * FROM users WHERE id = ? AND banned = 0',
  )
    .bind(id)
    .first<UserRow>()
  if (!row) return fail('用户不存在', 404)

  return json({ user: toPublicUser(row) })
}
