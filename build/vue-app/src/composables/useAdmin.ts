import { ref } from 'vue'

const SESSION_KEY = 'snishaper_notice_session'
const isAdmin = ref(false)
let checked = false

function readSession(): { token: string; expires_at?: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    if (!s?.token) return null
    if (s.expires_at && new Date(s.expires_at).getTime() <= Date.now()) return null
    return s
  } catch {
    return null
  }
}

export function adminHeaders(): Record<string, string> {
  const s = readSession()
  return s ? { Authorization: `Bearer ${s.token}` } : {}
}

export async function checkAdmin(force = false): Promise<boolean> {
  if (checked && !force) return isAdmin.value
  const s = readSession()
  if (!s) {
    isAdmin.value = false
    checked = true
    return false
  }
  try {
    const res = await fetch('/api/notices/auth', { headers: adminHeaders() })
    isAdmin.value = res.ok
  } catch {
    isAdmin.value = false
  }
  checked = true
  return isAdmin.value
}

export function useAdmin() {
  return { isAdmin, checkAdmin, adminHeaders }
}
