import type { D1Database, D1Statement, Env } from './types'

const ACCOUNT_ID = '1f63355eb692bc4c77f905d6df902941'
const DATABASE_ID = '35660f49-87c6-46a3-9215-f2518733ab27'

class RestStatement implements D1Statement {
  private params: unknown[] = []

  constructor(
    private readonly sql: string,
    private readonly fetchQuery: (sql: string, params: unknown[]) => Promise<Record<string, unknown>[]>,
  ) {}

  bind(...values: unknown[]): D1Statement {
    this.params = values
    return this
  }

  async first<T = unknown>(): Promise<T | null> {
    const rows = await this.fetchQuery(this.sql, this.params)
    return (rows[0] as T) ?? null
  }

  async all<T = unknown>(): Promise<{ results: T[] }> {
    const rows = await this.fetchQuery(this.sql, this.params)
    return { results: rows as T[] }
  }

  async run(): Promise<unknown> {
    await this.fetchQuery(this.sql, this.params)
    return {}
  }
}

class RestDb implements D1Database {
  constructor(private readonly token: string) {}

  prepare(sql: string): D1Statement {
    return new RestStatement(sql, (q, params) => this.query(q, params))
  }

  private async query(sql: string, params: unknown[]): Promise<Record<string, unknown>[]> {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      },
    )
    const data = (await res.json()) as {
      success: boolean
      errors?: { message: string }[]
      result?: { results?: Record<string, unknown>[]; success: boolean }[]
    }
    if (!res.ok || !data.success) {
      const message = data.errors?.[0]?.message || `D1 REST error ${res.status}`
      throw new Error(message)
    }
    return data.result?.[0]?.results ?? []
  }
}

export function getDb(env: Env): D1Database {
  if (env.DB) return env.DB
  return new RestDb(env.D1_API_TOKEN)
}
