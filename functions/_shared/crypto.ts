const enc = new TextEncoder()

function bufToHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function hexToBuf(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return out
}

function b64url(input: ArrayBuffer | string): string {
  const bytes = typeof input === 'string' ? enc.encode(input) : new Uint8Array(input)
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlToBuf(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4)
  const raw = atob(padded)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

export function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return bufToHex(arr.buffer as ArrayBuffer)
}

export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: hexToBuf(saltHex), iterations: 210000 },
    key,
    256,
  )
  return bufToHex(bits)
}

export function newSalt(): string {
  return randomHex(16)
}

export interface JwtPayload {
  sub: string
  email: string
  iat: number
  exp: number
}

async function hmacKey(secret: string, usage: KeyUsage): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    usage,
  ])
}

export async function signJwt(
  payload: { sub: string; email: string },
  secret: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + 60 * 60 * 24 * 30 }
  const data = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' })) + '.' + b64url(JSON.stringify(body))
  const key = await hmacKey(secret, 'sign')
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return data + '.' + b64url(sig)
}

export async function verifyJwt(token: string, secret: string): Promise<JwtPayload | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const key = await hmacKey(secret, 'verify')
    const ok = await crypto.subtle.verify(
      'HMAC',
      key,
      b64urlToBuf(parts[2]),
      enc.encode(parts[0] + '.' + parts[1]),
    )
    if (!ok) return null
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBuf(parts[1]))) as JwtPayload
    if (!payload.sub || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}
