import { apiRequest } from '@/composables/useSiteData'

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']
const UPLOAD_TIMEOUT = 45000
const SUPABASE_PROXY = String(import.meta.env.VITE_SUPABASE_PROXY || 'https://supabase.jetcpp.ccwu.cc').replace(/\/$/, '')
const APP_CLIENT_KEY = String(import.meta.env.VITE_APP_CLIENT_KEY || '')

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('读取图片失败'))
    reader.readAsDataURL(file)
  })
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('图片解码失败'))
    img.src = url
  })
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
}

async function compressImage(file: File, maxEdge: number, force: boolean): Promise<File> {
  if (!force && file.size < MAX_IMAGE_BYTES && file.type !== 'image/gif') return file
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    let edge = maxEdge
    let quality = 0.82
    let last: Blob | null = null
    for (let i = 0; i < 8; i++) {
      const scale = Math.min(1, edge / Math.max(img.width, img.height))
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      last = await toBlob(canvas, quality)
      if (last && last.size < MAX_IMAGE_BYTES) break
      quality = Math.max(0.35, quality - 0.1)
      edge = Math.max(400, Math.round(edge * 0.75))
    }
    if (!last) return file
    if (last.size >= MAX_IMAGE_BYTES) throw new Error('图片压缩后仍超过 3 MB，请换一张图')
    return new File([last], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function uploadImage(file: File, kind: 'post' | 'avatar' = 'post'): Promise<string> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error('仅支持 PNG / JPEG / WebP / GIF / AVIF 图片')
  }
  const source = await compressImage(file, kind === 'avatar' ? 512 : 1600, kind === 'avatar')
  const data = await readAsDataURL(source)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT)
  try {
    const result = await apiRequest<{ url: string }>('/api/uploads', {
      method: 'POST',
      body: JSON.stringify({ data, filename: source.name, kind }),
      signal: controller.signal,
    })
    const key = result.url.split('/storage/v1/object/public/')[1] || ''
    return `${SUPABASE_PROXY}/storage/v1/object/public/${key}?k=${APP_CLIENT_KEY}`
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('上传超时，请重试或换更小的图片')
    }
    throw e
  } finally {
    clearTimeout(timer)
  }
}
