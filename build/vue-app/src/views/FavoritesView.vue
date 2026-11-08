<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import FavoritesList from '@/components/FavoritesList.vue'
import HistoryList from '@/components/HistoryList.vue'
import { useFavorites, useHistory, type FavoriteItem } from '@/composables/useStore'

const router = useRouter()
const { favorites, toggleFavorite, loadFavorites } = useFavorites()
const { history, loadHistory, clearHistory } = useHistory()

const tab = ref<'favorites' | 'history'>('favorites')

const TABS = [
  { value: 'favorites', label: '收藏', icon: 'mdi:heart' },
  { value: 'history', label: '历史', icon: 'mdi:history' },
] as const

const FALLBACK_ICON = 'mdi:bookmark-outline'
const FALLBACK_COLOR = '#FFB347'

const favoriteItems = computed<FavoriteItem[]>(() =>
  favorites.value.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    icon: item.icon || FALLBACK_ICON,
    color: item.color || FALLBACK_COLOR,
    type: item.type,
  })),
)

const historyRecords = computed(() =>
  history.value.map((item) => ({
    id: item.testId,
    testId: item.testId,
    title: item.testTitle,
    type: 'test' as const,
    score: item.score,
    level: item.level,
    completedAt: item.completedAt,
  })),
)

const removeFavorite = (id: string) => {
  const target = favorites.value.find((f) => f.id === id)
  if (target) toggleFavorite(target)
}

const openFavorite = (item: FavoriteItem) => {
  if (item.type === 'test') {
    router.push(`/tests/${item.id}`)
    return
  }
  router.push('/blog')
}

const openHistory = (item: { testId?: string }) => {
  if (item.testId) router.push(`/tests/${item.testId}`)
}

onMounted(() => {
  loadFavorites()
  loadHistory()
})
</script>

<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ ls ~/collections</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">本地收藏与测评记录</span>
      </h1>
      <p class="text-dim" style="margin-top:16px; max-width:520px;">
        数据仅保存在当前浏览器的 localStorage，不上传服务器，清除浏览器数据即会丢失。
      </p>
    </section>

    <section class="mb-40">
      <div class="flex gap-12 flex-wrap" style="padding-left:40px;">
        <button v-for="t in TABS" :key="t.value"
          class="tag-pill" style="cursor:pointer;"
          :style="{
            color: tab === t.value ? 'rgba(255,255,255,0.85)' : 'var(--color-text-faint)',
            borderColor: tab === t.value ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
            background: tab === t.value ? 'rgba(255,255,255,0.06)' : 'transparent',
          }"
          @click="tab = t.value"
        >
          <Icon :icon="t.icon" width="14" style="margin-right:6px;" />{{ t.label }}
          <span style="opacity:0.5; margin-left:6px;">{{ t.value === 'favorites' ? favoriteItems.length : historyRecords.length }}</span>
        </button>
      </div>
    </section>

    <div class="divider-geek mb-40" style="margin-left:40px;">
      <span>{{ tab === 'favorites' ? 'favorites' : 'history' }}</span>
    </div>

    <section class="mb-60" style="padding-left:40px; max-width:760px;">
      <template v-if="tab === 'favorites'">
        <FavoritesList :items="favoriteItems" @item-click="openFavorite" @remove="removeFavorite" />
        <RouterLink to="/tests" class="btn-geek mt-20" style="font-size:var(--font-size-xs); display:inline-flex;">
          <Icon icon="mdi:arrow-left" width="14" /> 去测评页添加收藏
        </RouterLink>
      </template>

      <template v-else>
        <HistoryList :history="historyRecords" @item-click="openHistory" @clear="clearHistory" />
        <RouterLink to="/tests" class="btn-geek mt-20" style="font-size:var(--font-size-xs); display:inline-flex;">
          <Icon icon="mdi:arrow-left" width="14" /> 去完成一个测评
        </RouterLink>
      </template>
    </section>
  </div>
</template>
