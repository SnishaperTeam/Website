import { apiRequest } from '@/composables/useSiteData'

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('读取图片失败'))
    reader.readAsDataURL(file)
  })
}

export async function uploadImage(file: File, kind: 'post' | 'avatar' = 'post'): Promise<string> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error('仅支持 PNG / JPEG / WebP / GIF / AVIF 图片')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('图片不能超过 3 MB')
  }
  const data = await readAsDataURL(file)
  const result = await apiRequest<{ url: string }>('/api/uploads', {
    method: 'POST',
    body: JSON.stringify({ data, filename: file.name, kind }),
  })
  return result.url
}
