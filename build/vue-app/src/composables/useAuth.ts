import { computed, ref } from 'vue'

export interface AuthUser {
  id: string
  email: string
  nickname: string
  avatarUrl: string | null
  createdAt: string
}

const TOKEN_KEY = 'auth_token'

const user = ref<AuthUser | null>(null)
const loading = ref(true)

function getToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

function setToken(token: string) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {}
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const extra = (options.headers || {}) as Record<string, string>
  Object.assign(headers, extra)
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(path, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { error?: string }).error || '请求失败')
  return data as T
}

async function initAuth() {
  loading.value = true
  if (!getToken()) {
    user.value = null
    loading.value = false
    return
  }
  try {
    const data = await request<{ user: AuthUser }>('/api/auth/me')
    user.value = data.user
  } catch {
    setToken('')
    user.value = null
  } finally {
    loading.value = false
  }
}

initAuth()

async function signIn(email: string, password: string) {
  const data = await request<{ token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.token)
  user.value = data.user
  return data.user
}

async function signUp(payload: { email: string; password: string; nickname?: string; otpCode?: string }) {
  const data = await request<{ token: string; user: AuthUser }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  setToken(data.token)
  user.value = data.user
  return data.user
}

async function requestOtp(email: string, purpose: 'register' | 'password_reset') {
  await request<{ ok: boolean }>('/api/auth/otp/send', {
    method: 'POST',
    body: JSON.stringify({ email, purpose }),
  })
}

async function resetPassword(email: string, otpCode: string, password: string) {
  await request<{ ok: boolean }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otpCode, password }),
  })
}

function signOut() {
  setToken('')
  user.value = null
}

function applySession(tokenValue: string, nextUser: AuthUser) {
  setToken(tokenValue)
  user.value = nextUser
}

async function updateProfile(payload: { nickname?: string; avatarUrl?: string | null }) {
  const data = await request<{ user: AuthUser }>('/api/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  user.value = data.user
  return data.user
}

async function changePassword(currentPassword: string, newPassword: string) {
  const data = await request<{ token: string }>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  setToken(data.token)
}

async function deleteAccount(password: string) {
  await request<{ ok: boolean }>('/api/auth/account', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  })
  signOut()
}

export function useAuth() {
  return {
    user,
    loading,
    signIn,
    signUp,
    requestOtp,
    resetPassword,
    signOut,
    applySession,
    updateProfile,
    changePassword,
    deleteAccount,
    isAuthenticated: computed(() => !!user.value),
  }
}
