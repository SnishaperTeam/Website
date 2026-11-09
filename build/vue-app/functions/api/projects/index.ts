import { readBody, str } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { requireAdmin, okJson, failJson, type AdminEnv } from '../../_shared/adminAuth'
import { json, newId } from '../../_shared/types'

interface ProjectRow {
  id: string
  title: string
  description: string
  category: string
  link: string
  external: number
  created_at: string
}

function toProject(row: ProjectRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    link: row.link,
    external: !!row.external,
    createdAt: row.created_at,
  }
}

export const onRequestGet = async (context: { request: Request; env: AdminEnv }) => {
  const rows = await getDb(context.env)
    .prepare('SELECT * FROM projects ORDER BY created_at DESC LIMIT 100')
    .all<ProjectRow>()
  return json({ projects: rows.results.map(toProject) })
}

export const onRequestPost = async (context: { request: Request; env: AdminEnv }) => {
  const denied = await requireAdmin(context.request, context.env)
  if (denied) return denied

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const title = str(body.title)
  const description = str(body.description)
  const category = str(body.category) || '系统'
  const link = str(body.link)
  const external = body.external === true ? 1 : 0

  if (!title) return failJson('标题不能为空', 400)
  if (!description) return failJson('描述不能为空', 400)
  if (!link) return failJson('链接不能为空', 400)
  if (external === 0 && !link.startsWith('/')) return failJson('站内链接需以 / 开头', 400)
  if (external === 1 && !/^https?:\/\//.test(link)) return failJson('外链需为 http(s) 链接', 400)

  const id = newId()
  await getDb(context.env)
    .prepare(
      'INSERT INTO projects (id, title, description, category, link, external) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .bind(id, title, description, category, link, external)
    .run()

  return okJson({ id })
}
