import { computed, ref } from 'vue'
import { staticPosts } from '@/data/posts'

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

export function useFavorites() {
  const isFavorite = (id: string) => favorites.value.some((f) => f.id === id)

  const loadFavorites = () => {
    favorites.value = readStorage<FavoriteItem[]>(FAVORITES_KEY, [])
  }

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      favorites.value = favorites.value.filter((f) => f.id !== item.id)
    } else {
      favorites.value = [item, ...favorites.value]
    }
    writeStorage(FAVORITES_KEY, favorites.value)
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
  const loadHistory = () => {
    history.value = readStorage<HistoryItem[]>(HISTORY_KEY, [])
  }

  const addToHistory = (item: HistoryItem) => {
    const next = history.value.filter((h) => h.testId !== item.testId)
    next.unshift(item)
    history.value = next.slice(0, MAX_HISTORY)
    writeStorage(HISTORY_KEY, history.value)
  }

  const getTestHistory = () => history.value

  const clearHistory = () => {
    history.value = []
    writeStorage(HISTORY_KEY, [])
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
