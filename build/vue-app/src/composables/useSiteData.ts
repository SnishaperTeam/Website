import { computed, ref } from 'vue'
import type { BlogPost } from '@/data/posts'
import { staticPosts } from '@/data/posts'
import { authReady, getToken } from './useAuth'

export interface DynamicPost {
  id: string
  authorId: string
  author: string | null
  title: string
  slug: string
  excerpt: string | null
  content: string
  category: string | null
  color: string | null
  tags: string[]
  published: boolean
  views: number
  likes: number
  createdAt: string
  updatedAt: string
}

export function isLoggedIn() {
  return !!getToken()
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  await authReady
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  Object.assign(headers, (options.headers || {}) as Record<string, string>)
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(path, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { error?: string }).error || '请求失败')
  return data as T
}

export const dynamicPosts = ref<DynamicPost[]>([])
let loaded = false

export async function loadDynamicPosts(force = false) {
  if (loaded && !force) return dynamicPosts.value
  try {
    const data = await apiRequest<{ posts: DynamicPost[] }>('/api/posts')
    dynamicPosts.value = data.posts || []
    loaded = true
  } catch {
    dynamicPosts.value = []
  }
  return dynamicPosts.value
}

export function invalidatePosts() {
  loaded = false
}

export function toBlogPost(post: DynamicPost): BlogPost {
  return {
    id: 'dynamic-' + post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || post.content.replace(/[#*`>\-\[\]()]/g, '').slice(0, 90),
    date: String(post.createdAt).slice(0, 10),
    author: post.author || '站内用户',
    category: post.category || '个人文章',
    tags: post.tags || [],
    link: `/blog/${post.slug}`,
  }
}

export const allBlogPosts = computed<BlogPost[]>(() => [
  ...dynamicPosts.value.map(toBlogPost),
  ...staticPosts,
])

export async function getDynamicPost(slug: string): Promise<DynamicPost | null> {
  try {
    const data = await apiRequest<{ post: DynamicPost }>(`/api/posts/${encodeURIComponent(slug)}`)
    return data.post
  } catch {
    return null
  }
}

export async function getMyPosts(): Promise<DynamicPost[]> {
  try {
    const data = await apiRequest<{ posts: DynamicPost[] }>('/api/posts?mine=1')
    return data.posts || []
  } catch {
    return []
  }
}

export interface PostPayload {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  color: string
  published: boolean
}

export async function createPost(payload: PostPayload) {
  await apiRequest('/api/posts', { method: 'POST', body: JSON.stringify(payload) })
  invalidatePosts()
}

export async function updatePost(id: string, payload: PostPayload) {
  await apiRequest(`/api/posts/item/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
  invalidatePosts()
}

export async function removePost(id: string) {
  await apiRequest(`/api/posts/item/${id}`, { method: 'DELETE' })
  invalidatePosts()
}

export async function likePost(slug: string) {
  return apiRequest<{ likes: number }>(`/api/posts/${encodeURIComponent(slug)}/like`, {
    method: 'POST',
  })
}

export interface OAuthAccount {
  provider: string
  email: string | null
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
}

export async function exchangeOAuthCode(code: string) {
  return apiRequest<{ token: string; user: { id: string; email: string; nickname: string; avatarUrl: string | null; createdAt: string } }>(
    '/api/auth/oauth/exchange',
    { method: 'POST', body: JSON.stringify({ code }) },
  )
}

export async function confirmOAuthBind(ticket: string, password: string) {
  return apiRequest<{ code: string }>('/api/auth/oauth/bind/confirm', {
    method: 'POST',
    body: JSON.stringify({ ticket, password }),
  })
}

export async function startOAuthBind() {
  const data = await apiRequest<{ ticket: string }>('/api/auth/oauth/bind/start', {
    method: 'POST',
  })
  return data.ticket
}

export async function getOAuthAccounts() {
  const data = await apiRequest<{ accounts: OAuthAccount[] }>('/api/auth/oauth/accounts')
  return data.accounts || []
}

export async function unlinkOAuth(provider: string) {
  return apiRequest(`/api/auth/oauth/accounts/${encodeURIComponent(provider)}`, { method: 'DELETE' })
}

export interface Comment {
  id: string
  postSlug: string
  userId: string
  author: string
  avatarUrl: string | null
  content: string
  createdAt: string
}

export async function getComments(slug: string): Promise<Comment[]> {
  try {
    const data = await apiRequest<{ comments: Comment[] }>(`/api/comments/${encodeURIComponent(slug)}`)
    return data.comments || []
  } catch {
    return []
  }
}

export async function addComment(slug: string, content: string) {
  return apiRequest<{ comment: Comment }>(`/api/comments/${encodeURIComponent(slug)}`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export async function removeComment(id: string) {
  return apiRequest(`/api/comments/item/${id}`, { method: 'DELETE' })
}
