import { computed, ref } from 'vue'
import { staticPosts } from '@/data/posts'
import { apiRequest, dynamicPosts, isLoggedIn } from '@/composables/useSiteData'

const FAVORITES_KEY = 'site_favorites'
const HISTORY_KEY = 'site_test_history'
const MAX_HISTORY = 50

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export interface FavoriteItem {
  id: string
  title: string
  description?: string
  icon?: string
  color?: string
  type: 'test' | 'blog'
}

const favorites = ref<FavoriteItem[]>(readStorage<FavoriteItem[]>(FAVORITES_KEY, []))
const favoritesLoading = ref(false)

function mergeFavorites(remote: FavoriteItem[], local: FavoriteItem[]) {
  const map = new Map<string, FavoriteItem>()
  for (const item of local) map.set(item.id, item)
  for (const item of remote) map.set(item.id, item)
  return Array.from(map.values())
}

export function useFavorites() {
  const isFavorite = (id: string) => favorites.value.some((f) => f.id === id)

  const loadFavorites = async () => {
    const local = readStorage<FavoriteItem[]>(FAVORITES_KEY, [])
    if (!isLoggedIn()) {
      favorites.value = local
      return
    }
    favoritesLoading.value = true
    try {
      const data = await apiRequest<{ favorites: FavoriteItem[] }>('/api/favorites')
      const remote = data.favorites || []
      const merged = mergeFavorites(remote, local)
      favorites.value = merged
      writeStorage(FAVORITES_KEY, merged)
      for (const item of merged.filter((i) => !remote.some((r) => r.id === i.id))) {
        apiRequest('/api/favorites', { method: 'POST', body: JSON.stringify(item) }).catch(() => {})
      }
    } catch {
      favorites.value = local
    } finally {
      favoritesLoading.value = false
    }
  }

  const toggleFavorite = (item: FavoriteItem) => {
    const exists = isFavorite(item.id)
    if (exists) {
      favorites.value = favorites.value.filter((f) => f.id !== item.id)
    } else {
      favorites.value = [item, ...favorites.value]
    }
    writeStorage(FAVORITES_KEY, favorites.value)
    if (!isLoggedIn()) return
    if (exists) {
      apiRequest(`/api/favorites/${encodeURIComponent(item.id)}`, { method: 'DELETE' }).catch(() => {})
    } else {
      apiRequest('/api/favorites', { method: 'POST', body: JSON.stringify(item) }).catch(() => {})
    }
  }

  return {
    favorites,
    favoritesLoading,
    isFavorite,
    toggleFavorite,
    loadFavorites,
  }
}

export interface HistoryItem {
  testId: string
  testTitle: string
  score?: number
  maxScore?: number
  level?: string
  answers?: Record<number, number>
  completedAt: string
}

const history = ref<HistoryItem[]>(readStorage<HistoryItem[]>(HISTORY_KEY, []))
const historyLoading = ref(false)

export function useHistory() {
  const loadHistory = async () => {
    const local = readStorage<HistoryItem[]>(HISTORY_KEY, [])
    if (!isLoggedIn()) {
      history.value = local
      return
    }
    historyLoading.value = true
    try {
      const data = await apiRequest<{ history: HistoryItem[] }>('/api/history')
      const remote = (data.history || []).map((h) => ({ ...h, testId: h.testId }))
      const map = new Map<string, HistoryItem>()
      for (const item of local) map.set(item.testId, item)
      for (const item of remote) map.set(item.testId, item)
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
      )
      history.value = merged.slice(0, MAX_HISTORY)
      writeStorage(HISTORY_KEY, history.value)
      for (const item of merged.filter((i) => !remote.some((r) => r.testId === i.testId))) {
        apiRequest('/api/history', { method: 'POST', body: JSON.stringify(item) }).catch(() => {})
      }
    } catch {
      history.value = local
    } finally {
      historyLoading.value = false
    }
  }

  const addToHistory = (item: HistoryItem) => {
    const next = history.value.filter((h) => h.testId !== item.testId)
    next.unshift(item)
    history.value = next.slice(0, MAX_HISTORY)
    writeStorage(HISTORY_KEY, history.value)
    if (!isLoggedIn()) return
    apiRequest('/api/history', { method: 'POST', body: JSON.stringify(item) }).catch(() => {})
  }

  const getTestHistory = () => history.value

  const clearHistory = () => {
    history.value = []
    writeStorage(HISTORY_KEY, [])
    if (!isLoggedIn()) return
    apiRequest('/api/history', { method: 'DELETE' }).catch(() => {})
  }

  return {
    history,
    historyLoading,
    loadHistory,
    addToHistory,
    getTestHistory,
    clearHistory,
  }
}

export interface Category {
  name: string
  icon: string
  color: string
}

const categories: Category[] = [
  { name: '编程教程', icon: 'mdi:code-braces', color: '#FF6B6B' },
  { name: '心理测试', icon: 'mdi:brain', color: '#6C63FF' },
  { name: '技术分享', icon: 'mdi:lightbulb-on', color: '#FFB347' },
  { name: '团队动态', icon: 'mdi:account-group', color: '#4ECDC4' },
]

const allTags = computed<Record<string, number>>(() => {
  const counts: Record<string, number> = {}
  for (const post of staticPosts) {
    for (const tag of post.tags) {
      counts[tag] = (counts[tag] || 0) + 1
    }
  }
  for (const post of dynamicPosts.value) {
    for (const tag of post.tags || []) {
      counts[tag] = (counts[tag] || 0) + 1
    }
  }
  return counts
})

export function useTags() {
  const getPopularTags = (limit = 10) => {
    return Object.entries(allTags.value)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
  }

  const getCategories = (): Category[] => categories

  return {
    allTags,
    getPopularTags,
    getCategories,
  }
}

export interface TestProgress {
  testId: string
  answers: Record<number, number>
  lastQuestion: number
  savedAt: string
}

export function useTestProgress() {
  const getProgress = (testId: string): TestProgress | null => {
    const saved = localStorage.getItem(`test_progress_${testId}`)
    return saved ? JSON.parse(saved) : null
  }

  const saveProgress = (testId: string, answers: Record<number, number>, lastQuestion: number) => {
    const progress: TestProgress = {
      testId,
      answers,
      lastQuestion,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(`test_progress_${testId}`, JSON.stringify(progress))
  }

  const clearProgress = (testId: string) => {
    localStorage.removeItem(`test_progress_${testId}`)
  }

  const getAllProgress = (): TestProgress[] => {
    const progress: TestProgress[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('test_progress_')) {
        const data = localStorage.getItem(key)
        if (data) {
          progress.push(JSON.parse(data))
        }
      }
    }
    return progress.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
  }

  return {
    getProgress,
    saveProgress,
    clearProgress,
    getAllProgress,
  }
}
