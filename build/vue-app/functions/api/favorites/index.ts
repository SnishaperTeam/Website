import { readBody, requireUser, str } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { fail, json, newId, type Env } from '../../_shared/types'

interface FavRow {
  item_id: string
  item_title: string
  item_description: string | null
  item_icon: string | null
  item_color: string | null
  item_type: string
  created_at: string
}

function toFav(row: FavRow) {
  return {
    id: row.item_id,
    title: row.item_title,
    description: row.item_description || '',
    icon: row.item_icon || '',
    color: row.item_color || '',
    type: row.item_type,
  }
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const rows = await getDb(context.env)
    .prepare('SELECT item_id, item_title, item_description, item_icon, item_color, item_type, created_at FROM user_favorites WHERE user_id = ? ORDER BY created_at DESC')
    .bind(auth.userId)
    .all<FavRow>()

  return json({ favorites: rows.results.map(toFav) })
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const itemId = str(body.id)
  const title = str(body.title)
  const type = str(body.type) === 'blog' ? 'blog' : 'test'
  if (!itemId || !title) return fail('缺少条目信息')

  await getDb(context.env)
    .prepare(
      `INSERT INTO user_favorites (id, user_id, item_id, item_title, item_description, item_icon, item_color, item_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, item_id) DO UPDATE SET
         item_title = excluded.item_title,
         item_description = excluded.item_description,
         item_icon = excluded.item_icon,
         item_color = excluded.item_color,
         item_type = excluded.item_type`,
    )
    .bind(newId(), auth.userId, itemId, title, str(body.description) || null, str(body.icon) || null, str(body.color) || null, type)
    .run()

  return json({ ok: true })
}
