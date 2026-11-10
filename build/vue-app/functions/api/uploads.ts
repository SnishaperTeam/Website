import { readBody, requireUser, str } from '../_shared/auth'
import { fail, json, type Env } from '../_shared/types'

export interface UploadEnv extends Env {
  SUPABASE_URL?: string
  SUPABASE_SECRET_KEY?: string
  SUPABASE_STORAGE_BUCKET?: string
}

const MAX_BYTES = 3 * 1024 * 1024
const MIME_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

function decodeBase64(input: string): Uint8Array {
  const raw = atob(input)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

function randomKey(): string {
  const arr = new Uint8Array(8)
  crypto.getRandomValues(arr)
  return [...arr].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const onRequestPost = async (context: { request: Request; env: UploadEnv }) => {
  const auth = await requireUser(context.request, context.env)
  if (auth instanceof Response) return auth

  const supabaseUrl = (context.env.SUPABASE_URL || '').replace(/\/$/, '')
  const secret = (context.env.SUPABASE_SECRET_KEY || '').trim()
  const bucket = (context.env.SUPABASE_STORAGE_BUCKET || 'website-media').trim()
  if (!supabaseUrl || !secret) return fail('图片存储未配置', 503)

  const body = await readBody(context.request)
  if (body instanceof Response) return body

  const data = str(body.data)
  const match = /^data:(image\/(?:png|jpeg|webp|gif|avif));base64,([A-Za-z0-9+/=]+)$/.exec(data)
  if (!match) return fail('仅支持 PNG / JPEG / WebP / GIF / AVIF 图片')

  const mime = match[1]
  const bytes = decodeBase64(match[2])
  if (bytes.length === 0) return fail('图片内容为空')
  if (bytes.length > MAX_BYTES) return fail('图片不能超过 3 MB')

  const kind = str(body.kind) === 'avatar' ? 'avatar' : 'post'
  const key = `${kind}/${auth.userId}/${Date.now()}-${randomKey()}.${MIME_EXT[mime]}`

  const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${key}`, {
    method: 'POST',
    headers: {
      apikey: secret,
      Authorization: `Bearer ${secret}`,
      'Content-Type': mime,
      'x-upsert': 'false',
    },
    body: bytes,
    signal: AbortSignal.timeout(20000),
  })
  if (!uploadRes.ok) {
    const detail = await uploadRes.text()
    return fail(`上传失败：${detail.slice(0, 180)}`, 502)
  }

  return json({
    url: `${supabaseUrl}/storage/v1/object/public/${bucket}/${key}`,
  }, 201)
}
