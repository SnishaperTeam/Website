import { readBody, requireUser, str } from '../../_shared/auth'
import { getDb } from '../../_shared/db'
import { fail, json, newId, type Env } from '../../_shared/types'

interface HistoryRow {
  test_id: string
  test_title: string
  score: number | null
  max_score: number | null
  level: string | null
  completed_at: string
}

function toHistory(row: HistoryRow) {
  return {
    testId: row.test_id,
    testTitle: row.test_title,
    score: row.score ?? undefined,
    maxScore: row.max_score ?? undefined,
    level: row.level || undefined,
    completedAt: row.completed_at,
  }
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const rows = await getDb(context.env)
    .prepare('SELECT test_id, test_title, score, max_score, level, completed_at FROM user_test_history WHERE user_id = ? ORDER BY completed_at DESC LIMIT 50')
    .bind(auth.userId)
    .all<HistoryRow>()

  return json({ history: rows.results.map(toHistory) })
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const testId = str(body.testId)
  const testTitle = str(body.testTitle)
  if (!testId || !testTitle) return fail('缺少测试信息')

  await getDb(context.env)
    .prepare(
      `INSERT INTO user_test_history (id, user_id, test_id, test_title, score, max_score, level, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, test_id) DO UPDATE SET
         test_title = excluded.test_title,
         score = excluded.score,
         max_score = excluded.max_score,
         level = excluded.level,
         completed_at = excluded.completed_at`,
    )
    .bind(
      newId(),
      auth.userId,
      testId,
      testTitle,
      typeof body.score === 'number' ? body.score : null,
      typeof body.maxScore === 'number' ? body.maxScore : null,
      str(body.level) || null,
      str(body.completedAt) || new Date().toISOString(),
    )
    .run()

  return json({ ok: true })
}

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  await getDb(context.env).prepare('DELETE FROM user_test_history WHERE user_id = ?').bind(auth.userId).run()
  return json({ ok: true })
}
