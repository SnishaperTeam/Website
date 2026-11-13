import { ref } from 'vue'
import { authReady, getToken } from './useAuth'

const ADMIN_TOKEN_KEY = 'admin_token'

export const isAdmin = ref(false)
let checked = false

function readAdminToken(): string {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

function writeAdminToken(token: string) {
  try {
    if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token)
    else localStorage.removeItem(ADMIN_TOKEN_KEY)
  } catch {}
}

export function currentToken(): string {
  return readAdminToken() || getToken()
}

export function adminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...extra }
  const token = currentToken()
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

export async function adminLogin(email: string, password: string): Promise<boolean> {
  const res = await fetch('/api/admin/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.admin) {
    isAdmin.value = false
    checked = true
    if (data.error === 'invalid_credentials') throw new Error('管理员邮箱或密码错误')
    throw new Error(data.error || `HTTP ${res.status}`)
  }
  writeAdminToken(String(data.token || ''))
  isAdmin.value = true
  checked = true
  return true
}

export async function checkAdmin(force = false): Promise<boolean> {
  await authReady
  if (checked && !force) return isAdmin.value
  const adminTok = readAdminToken()
  const siteTok = getToken()

  const attempt = async (token: string): Promise<boolean> => {
    const res = await fetch('/api/admin/session', {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    })
    const data = await res.json().catch(() => ({}))
    return res.ok && !!data.admin
  }

  let ok = false
  try {
    if (adminTok) {
      ok = await attempt(adminTok)
      if (!ok) writeAdminToken('')
    }
    if (!ok && siteTok) ok = await attempt(siteTok)
  } catch {
    ok = false
  }
  isAdmin.value = ok
  checked = true
  return ok
}

export function invalidateAdmin() {
  isAdmin.value = false
  checked = false
}

export function clearAdminToken() {
  writeAdminToken('')
  invalidateAdmin()
}

export function useAdmin() {
  return { isAdmin, checkAdmin, adminLogin, adminHeaders, invalidateAdmin, clearAdminToken }
}
