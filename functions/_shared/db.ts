import type { D1Database, D1Statement, Env } from './types'

const ACCOUNT_ID = '1f63355eb692bc4c77f905d6df902941'
const DATABASE_ID = '35660f49-87c6-46a3-9215-f2518733ab27'

function toPostgres(sql: string): string {
  let q = sql.replace(/datetime\('now'\)/g, "to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS')")
  q = q.replace(/\bLIKE\b/g, 'ILIKE')
  let i = 0
  q = q.replace(/\?/g, () => `$${++i}`)
  return q
}

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

class SupabaseStatement implements D1Statement {
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
    const rows = await this.fetchQuery(toPostgres(this.sql), this.params)
    return (rows[0] as T) ?? null
  }

  async all<T = unknown>(): Promise<{ results: T[] }> {
    const rows = await this.fetchQuery(toPostgres(this.sql), this.params)
    return { results: rows as T[] }
  }

  async run(): Promise<unknown> {
    await this.fetchQuery(toPostgres(this.sql), this.params)
    return {}
  }
}

class SupabaseRpcDb implements D1Database {
  constructor(
    private readonly url: string,
    private readonly key: string,
  ) {}

  prepare(sql: string): D1Statement {
    return new SupabaseStatement(sql, (q, params) => this.exec(q, params))
  }

  private async exec(sql: string, params: unknown[]): Promise<Record<string, unknown>[]> {
    const res = await fetch(`${this.url}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        apikey: this.key,
        Authorization: `Bearer ${this.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql, params }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Supabase RPC error ${res.status}: ${text.slice(0, 300)}`)
    }
    const data = (await res.json()) as unknown
    return Array.isArray(data) ? (data as Record<string, unknown>[]) : []
  }
}

export function getDb(env: Env): D1Database {
  if (env.DB_BACKEND === 'supabase' && env.SUPABASE_URL && env.SUPABASE_SECRET_KEY) {
    return new SupabaseRpcDb(env.SUPABASE_URL.replace(/\/$/, ''), env.SUPABASE_SECRET_KEY)
  }
  if (env.DB) return env.DB
  return new RestDb(env.D1_API_TOKEN)
}
