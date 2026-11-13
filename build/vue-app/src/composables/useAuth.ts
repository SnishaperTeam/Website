import { computed, ref } from 'vue'

export interface AuthUser {
  id: string
  email: string
  nickname: string
  avatarUrl: string | null
  createdAt: string
}

const TOKEN_KEY = 'auth_token'
const KEY_KEY = 'auth_cipher_key'
const CIPHER_PREFIX = 'v1:'

const user = ref<AuthUser | null>(null)
const loading = ref(true)
let sessionToken = ''

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function cipherKey(): Promise<CryptoKey> {
  const stored = sessionStorage.getItem(KEY_KEY)
  if (stored) {
    return crypto.subtle.importKey('jwk', JSON.parse(stored), { name: 'AES-GCM' }, false, [
      'encrypt',
      'decrypt',
    ])
  }
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ])
  sessionStorage.setItem(KEY_KEY, JSON.stringify(await crypto.subtle.exportKey('jwk', key)))
  return key
}

async function encryptToken(token: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    await cipherKey(),
    new TextEncoder().encode(token),
  )
  return `${CIPHER_PREFIX}${toBase64(iv)}.${toBase64(new Uint8Array(cipher))}`
}

async function decryptToken(stored: string): Promise<string> {
  if (!stored.startsWith(CIPHER_PREFIX)) return ''
  const [iv, cipher] = stored.slice(CIPHER_PREFIX.length).split('.')
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(iv) },
    await cipherKey(),
    fromBase64(cipher),
  )
  return new TextDecoder().decode(plain)
}

export function getToken(): string {
  return sessionToken
}

function setToken(token: string) {
  sessionToken = token
  try {
    if (!token) {
      sessionStorage.removeItem(TOKEN_KEY)
      return
    }
    void encryptToken(token)
      .then((encrypted) => sessionStorage.setItem(TOKEN_KEY, encrypted))
      .catch(() => sessionStorage.removeItem(TOKEN_KEY))
  } catch {
    sessionStorage.removeItem(TOKEN_KEY)
  }
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
  try {
    localStorage.removeItem(TOKEN_KEY)
    sessionToken = await decryptToken(sessionStorage.getItem(TOKEN_KEY) || '')
  } catch {
    sessionToken = ''
  }
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

export const authReady = initAuth()

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
    getToken,
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
