<template>
  <div class="search-modal" :class="{ active: isOpen }" @click.self="close">
    <div class="search-container">
      <div class="search-header">
        <Icon icon="mdi:magnify" class="search-icon" />
        <input
          ref="searchInput"
          v-model="query"
          type="text"
          placeholder="搜索项目、博客..."
          class="search-input"
          @keyup.esc="close"
          @input="handleSearch"
        />
        <button class="search-close" @click="close" aria-label="关闭搜索">
          <Icon icon="mdi:close" />
        </button>
      </div>

      <!-- 分类筛选 -->
      <div class="search-categories">
        <button
          v-for="cat in categories"
          :key="cat.name"
          class="category-btn"
          :class="{ active: selectedCategory === cat.name }"
          :style="
            selectedCategory === cat.name
              ? `background-color: ${cat.color}20; color: ${cat.color}; border-color: ${cat.color}40`
              : ''
          "
          @click="toggleCategory(cat.name)"
        >
          <Icon :icon="cat.icon" />{{ cat.name }}
        </button>
      </div>

      <div class="search-results" v-if="searchResults.length > 0">
        <div
          v-for="(result, index) in searchResults"
          :key="result.id"
          class="search-result-item"
          :class="{ selected: selectedIndex === index }"
          @click="navigateTo(result)"
          @mouseenter="selectedIndex = index"
        >
          <div
            class="result-icon"
            :style="`background-color: ${result.color}18; color: ${result.color}`"
          >
            <Icon :icon="result.icon" />
          </div>
          <div class="result-content">
            <h4 class="result-title">{{ result.title }}</h4>
            <p class="result-desc">{{ result.description }}</p>
            <div class="result-snippet" v-if="result.matchInContent" v-html="result.snippet"></div>
            <span class="result-category">{{ result.category }}</span>
          </div>
          <Icon icon="mdi:arrow-right" class="result-arrow" />
        </div>
      </div>

      <!-- 加载中 -->
      <div class="search-loading" v-else-if="isLoading">
        <div class="loading-spinner"></div>
        <p>搜索中...</p>
      </div>

      <div class="search-empty" v-else-if="query.length > 0 && !isLoading">
        <Icon icon="mdi:inbox" width="48" />
        <p>未找到相关内容</p>
      </div>

      <!-- 搜索历史 -->
      <div class="search-history" v-else-if="searchHistory.length > 0">
        <div class="hint-header">
          <p class="hint-title"><Icon icon="mdi:history" /> 最近搜索</p>
          <button class="clear-history-btn" @click="clearSearchHistory">清除</button>
        </div>
        <div class="hint-tags">
          <span
            v-for="(item, index) in searchHistory"
            :key="index"
            class="hint-tag history-tag"
            @click="searchTag(item.query)"
          >
            <Icon icon="mdi:magnify" style="font-size: 0.8rem" />{{ item.query }}
            <span class="history-category" v-if="item.category">· {{ item.category }}</span>
          </span>
        </div>
      </div>

      <div class="search-hints" v-else>
        <p class="hint-title">热门搜索</p>
        <div class="hint-tags">
          <span v-for="tag in hotTags" :key="tag" class="hint-tag" @click="searchTag(tag)">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'
import { useTags } from '@/composables/useStore'
import { Icon } from '@iconify/vue'

const router = useRouter()
const { getCategories } = useTags()

const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)
const searchInput = ref<HTMLInputElement | null>(null)
const selectedCategory = ref<string | null>(null)
const isLoading = ref(false)
const searchResults = ref<any[]>([])

// 防抖定时器
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// 分类列表
const categories = getCategories()

// 静态数据（不搜索content）
const staticData = [
  {
    id: 'static-1',
    title: 'SniShaper',
    description: '智能网络代理工具，集成ECH注入、TLS-RF分片等技术',
    category: '编程教程',
    icon: 'mdi:shield-check',
    color: '#00ADD8',
    path: '/snishaper',
    content: '',
  },
  {
    id: 'static-2',
    title: 'English Listen WinUI',
    description: '现代化英语听写训练工具，WinUI 3 + C# + C++混合开发',
    category: '技术分享',
    icon: 'mdi:headphones',
    color: '#f48c06',
    path: '/project/english-listen-winui',
    content: '',
  },
  {
    id: 'static-3',
    title: 'English-Listen',
    description: '专业英语听写训练工具，基于C++和Qt6开发',
    category: '技术分享',
    icon: 'mdi:book-open-page-variant',
    color: 'var(--color-brand)',
    path: '/project/english-listen',
    content: '',
  },
  {
    id: 'static-4',
    title: 'MBTI 人格测试',
    description: '迈尔斯-布里格斯类型指标，93道题识别16种人格类型',
    category: '心理测试',
    icon: 'mdi:account-badge',
    color: '#ff6b35',
    path: '/tests/mbti',
    content: '',
  },
  {
    id: 'static-5',
    title: '抑郁自评量表',
    description: '专业的抑郁症自我评估工具',
    category: '心理测试',
    icon: 'mdi:heart-pulse',
    color: '#e63946',
    path: '/tests/depression',
    content: '',
  },
  {
    id: 'static-6',
    title: '焦虑自评量表',
    description: '评估焦虑程度的专业工具',
    category: '心理测试',
    icon: 'mdi:activity',
    color: '#ff9f1c',
    path: '/tests/anxiety',
    content: '',
  },
  {
    id: 'static-7',
    title: '关于我们',
    description: '了解SnishaperTeam的故事和技术背景',
    category: '团队动态',
    icon: 'mdi:account-group',
    color: '#4cc9f0',
    path: '/about',
    content: '',
  },
  {
    id: 'static-8',
    title: '技术博客',
    description: 'C++编程经验、项目开发心得分享',
    category: '技术分享',
    icon: 'mdi:newspaper-variant',
    color: '#f48c06',
    path: '/blog',
    content: '',
  },
]

// 搜索历史
interface SearchHistoryItem {
  query: string
  category?: string
  timestamp: number
}

const searchHistory = ref<SearchHistoryItem[]>([])
const HISTORY_KEY = 'search_history'
const MAX_HISTORY = 10

const loadSearchHistory = () => {
  try {
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) {
      searchHistory.value = JSON.parse(saved)
    }
  } catch {
    searchHistory.value = []
  }
}

const saveToHistory = (searchQuery: string, category?: string) => {
  if (!searchQuery.trim()) return
  const filtered = searchHistory.value.filter(
    (item) => !(item.query === searchQuery && item.category === category),
  )
  filtered.unshift({ query: searchQuery, category, timestamp: Date.now() })
  searchHistory.value = filtered.slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory.value))
}

const clearSearchHistory = () => {
  searchHistory.value = []
  localStorage.removeItem(HISTORY_KEY)
}

// 从内容中提取匹配片段（带高亮）
const extractSnippet = (
  content: string,
  q: string,
  maxLen = 150,
): { html: string; matchInContent: boolean } => {
  if (!content || !q) return { html: '', matchInContent: false }

  const lowerContent = content.toLowerCase()
  const lowerQ = q.toLowerCase()
  const idx = lowerContent.indexOf(lowerQ)

  if (idx === -1) return { html: '', matchInContent: false }

  // 提取匹配位置前后的上下文
  const start = Math.max(0, idx - 40)
  const end = Math.min(content.length, idx + q.length + maxLen)
  let snippet = content.slice(start, end)

  // 添加省略号
  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet += '...'

  // 高亮关键词：用正则替换所有匹配项（不区分大小写）
  const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const highlighted = snippet.replace(new RegExp(`(${escapedQ})`, 'gi'), '<mark>$1</mark>')

  return { html: highlighted, matchInContent: true }
}

// 从 Supabase 全文搜索博客文章
const searchFromSupabase = async (q: string) => {
  try {
    isLoading.value = true

    let dynamicResults: any[] = []

    // 优先尝试 RPC 全文搜索
    try {
      const { data: rpcResults, error: rpcError } = await supabase.rpc('search_posts', {
        search_query: q,
      })

      if (!rpcError && rpcResults) {
        dynamicResults = rpcResults.map((post: any) => ({
          id: `user-${post.id}`,
          title: post.title,
          description: post.excerpt || '',
          snippet: post.content_snippet || '',
          matchInContent: !!post.content_snippet,
          category: post.category || '技术分享',
          icon: 'mdi:newspaper-variant',
          color: post.color || '#FF6B6B',
          path: `/blog/${post.slug}`,
        }))
      }
    } catch {
      // RPC 不可用，继续使用 fallback
    }

    // RPC 失败时 fallback 到 ilike 查询
    if (dynamicResults.length === 0) {
      const { data: userPosts } = await supabase
        .from('user_posts')
        .select('id, title, excerpt, content, category, slug, color')
        .eq('published', true)
        .or(`title.ilike.%${q}%,content.ilike.%${q}%,excerpt.ilike.%${q}%`)
        .limit(20)

      dynamicResults = (userPosts || []).map((post) => {
        const snippet = extractSnippet(post.content || '', q)
        const description =
          post.excerpt || (post.content ? post.content.substring(0, 120) + '...' : '')
        return {
          id: `user-${post.id}`,
          title: post.title,
          description,
          snippet: snippet.html,
          matchInContent: snippet.matchInContent,
          category: post.category || '技术分享',
          icon: 'mdi:newspaper-variant',
          color: post.color || '#FF6B6B',
          path: `/blog/${post.slug}`,
        }
      })
    }

    // 静态数据在标题/描述/分类中匹配
    const lowerQ = q.toLowerCase()
    const staticResults = staticData
      .filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQ) ||
          item.description.toLowerCase().includes(lowerQ) ||
          item.category.toLowerCase().includes(lowerQ),
      )
      .map((item) => ({
        ...item,
        snippet: '',
        matchInContent: false,
      }))

    // 合并结果：动态文章在前（通常更相关），静态在后
    searchResults.value = [...dynamicResults, ...staticResults].slice(0, 20)
  } catch (e) {
    console.error('搜索失败:', e)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

const hotTags = ['SniShaper', '英语听写', 'MBTI', 'C++', '心理测试']

const toggleCategory = (catName: string) => {
  selectedCategory.value = selectedCategory.value === catName ? null : catName
  selectedIndex.value = 0
  performSearch()
}

// 带防抖的搜索
const performSearch = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }

  selectedIndex.value = 0
  const q = query.value.trim()

  if (!q) {
    searchResults.value = []
    isLoading.value = false
    return
  }

  // 分类筛选（有分类但无搜索词时，在静态数据中按分类筛选）
  if (selectedCategory.value && !q) {
    searchResults.value = staticData
      .filter((item) => item.category === selectedCategory.value)
      .map((item) => ({ ...item, snippet: '', matchInContent: false }))
    return
  }

  isLoading.value = true
  debounceTimer = setTimeout(() => {
    searchFromSupabase(q)
  }, 300)
}

const open = () => {
  isOpen.value = true
  query.value = ''
  selectedIndex.value = 0
  selectedCategory.value = null
  searchResults.value = []
  loadSearchHistory()
  nextTick(() => {
    searchInput.value?.focus()
  })
  document.body.style.overflow = 'hidden'
}

const close = () => {
  isOpen.value = false
  query.value = ''
  selectedCategory.value = null
  searchResults.value = []
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  document.body.style.overflow = ''
}

const handleSearch = () => {
  performSearch()
}

const navigateTo = (result: any) => {
  // 保存搜索历史
  if (query.value.trim()) {
    saveToHistory(query.value.trim(), result.category)
  }

  // 外部链接或 HTML 文件直接使用 window.open
  if (result.path.startsWith('http') || result.path.endsWith('.html')) {
    window.open(result.path, '_blank', 'noopener,noreferrer')
  } else {
    router.push(result.path)
  }
  close()
}

const searchTag = (tag: string) => {
  query.value = tag
  searchInput.value?.focus()
}

// 键盘快捷键
watch(isOpen, (val) => {
  if (val) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (e.key === 'Enter' && searchResults.value[selectedIndex.value]) {
    e.preventDefault()
    navigateTo(searchResults.value[selectedIndex.value])
  }
}

// 暴露方法给父组件
defineExpose({ open, close })
</script>

<style scoped>
.search-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.search-modal.active {
  opacity: 1;
  visibility: visible;
}

.search-container {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 640px;
  max-height: 70vh;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  transform: translateY(-20px) scale(0.95);
  transition: transform 0.3s var(--ease-out-expo);
}

.search-modal.active .search-container {
  transform: translateY(0) scale(1);
}

.search-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  gap: 12px;
}

.search-icon {
  font-size: 1.2rem;
  color: var(--color-text-muted);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: var(--color-text);
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-close {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.search-close:hover {
  background: var(--color-bg-soft);
  color: var(--color-text);
}

.search-categories {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
}

.category-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-bg);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-family: inherit;
}

.category-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.category-btn.active {
  font-weight: 400;
}

.search-results {
  max-height: calc(70vh - 140px);
  overflow-y: auto;
  padding: 8px;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-result-item:hover,
.search-result-item.selected {
  background: var(--color-bg-soft);
}

.result-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 0.95rem;
  font-weight: 400;
  color: var(--color-heading);
  margin: 0 0 4px 0;
}

.result-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-category {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  background: var(--color-bg-mute);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.result-arrow {
  color: var(--color-text-muted);
  opacity: 0;
  transition: all var(--transition-fast);
}

.search-result-item:hover .result-arrow,
.search-result-item.selected .result-arrow {
  opacity: 1;
  color: var(--color-primary);
}

.search-empty {
  padding: 48px 20px;
  text-align: center;
  color: var(--color-text-muted);
}

.search-empty i {
  margin-bottom: 12px;
  opacity: 0.5;
}

/* 搜索结果片段 */
.result-snippet {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-top: 4px;
  padding: 6px 8px;
  background: var(--color-bg-soft);
  border-radius: var(--radius-sm);
  border-left: 2px solid var(--color-primary);
}

.result-snippet :deep(mark) {
  background: var(--color-primary);
  color: white;
  padding: 1px 3px;
  border-radius: 2px;
  font-weight: 400;
}

/* 加载状态 */
.search-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--color-text-muted);
  gap: 12px;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.search-history,
.search-hints {
  padding: 24px 20px;
}

.hint-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.hint-title {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.clear-history-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.clear-history-btn:hover {
  background: var(--color-bg-soft);
}

.hint-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hint-tag {
  padding: 6px 12px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.hint-tag:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.history-tag {
  font-size: 0.82rem;
}

.history-category {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.hint-tag:hover .history-category {
  color: rgba(255, 255, 255, 0.7);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .search-modal {
    padding-top: 0;
    align-items: stretch;
  }

  .search-container {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .search-results {
    max-height: calc(100vh - 140px);
  }

  .search-categories {
    padding: 10px 16px;
    gap: 6px;
  }

  .category-btn {
    font-size: 0.8rem;
    padding: 5px 12px;
  }
}
</style>
