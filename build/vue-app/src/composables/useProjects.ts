import { ref } from 'vue'
import { adminHeaders } from '@/composables/useAdmin'

export interface ManagedProject {
  id: string
  title: string
  description: string
  category: string
  link: string
  external: boolean
  createdAt: string
}

export interface ProjectPayload {
  title: string
  description: string
  category: string
  link: string
  external: boolean
}

const dynamicProjects = ref<ManagedProject[]>([])
let loaded = false

function invalidate() {
  loaded = false
}

export async function loadProjects(force = false): Promise<ManagedProject[]> {
  if (loaded && !force) return dynamicProjects.value
  try {
    const res = await fetch('/api/projects')
    const data = await res.json()
    dynamicProjects.value = res.ok ? (data.projects || []) : []
    loaded = true
  } catch {
    dynamicProjects.value = []
  }
  return dynamicProjects.value
}

async function adminRequest(path: string, init: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...adminHeaders(),
  }
  const res = await fetch(path, { ...init, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || '操作失败')
  }
  invalidate()
  return data
}

export async function createProject(payload: ProjectPayload) {
  return adminRequest('/api/projects', { method: 'POST', body: JSON.stringify(payload) })
}

export async function updateProject(id: string, payload: ProjectPayload) {
  return adminRequest(`/api/projects/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteProject(id: string) {
  return adminRequest(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function useProjects() {
  return {
    dynamicProjects,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}
