<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTags } from '@/composables/useStore'
import { Icon } from '@iconify/vue'
import { useTypewriter } from '@/composables/useTypewriter'
import { useStaggeredFade } from '@/composables/useStaggeredFade'
import { allBlogPosts, loadDynamicPosts } from '@/composables/useSiteData'
import { useAuth } from '@/composables/useAuth'
import TagCloud from '@/components/TagCloud.vue'
import RssSubscribe from '@/components/RssSubscribe.vue'

const { allTags } = useTags()
const { isAuthenticated } = useAuth()
const { display, cursor, done } = useTypewriter('阅读、学习、分享。', 50)

const activeCategory = ref('all')

const categories = [
  { value: 'all', label: '全部', icon: 'mdi:view-grid' },
  { value: '编程教程', label: '教程', icon: 'mdi:code-braces' },
  { value: '技术分享', label: '分享', icon: 'mdi:share-variant' },
  { value: '个人文章', label: '个人', icon: 'mdi:note-text' },
]

const allPosts = computed(() => allBlogPosts.value)

const filteredPosts = computed(() => {
  if (activeCategory.value === 'all') return allPosts.value
  return allPosts.value.filter((p) => p.category === activeCategory.value)
})

const getCategoryCount = (cat: string) => allPosts.value.filter((p) => p.category === cat).length

const vis = useStaggeredFade(6, 100)

onMounted(() => {
  loadDynamicPosts()
})
</script>

<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ cat blog/</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ display }}</span>
        <span class="typewriter-cursor" :class="{ done }"></span>
      </h1>
    </section>

    <section class="mb-40">
      <div class="flex gap-12 flex-wrap items-center" style="padding-left:40px;">
        <button v-for="cat in categories" :key="cat.value"
          class="tag-pill" style="cursor:pointer;"
          :style="{
            color: activeCategory === cat.value ? 'rgba(255,255,255,0.85)' : 'var(--color-text-faint)',
            borderColor: activeCategory === cat.value ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
            background: activeCategory === cat.value ? 'rgba(255,255,255,0.06)' : 'transparent',
          }"
          @click="activeCategory = cat.value"
        >{{ cat.label }} <span v-if="cat.value !== 'all'" style="opacity:0.5;margin-left:4px;">({{ getCategoryCount(cat.value) }})</span></button>
        <span class="spacer"></span>
        <RouterLink v-if="isAuthenticated" to="/blog/new" class="btn-geek" style="font-size:var(--font-size-xs);">
          <Icon icon="mdi:pencil" width="14" /> 写文章
        </RouterLink>
      </div>
    </section>

    <div class="divider-geek mb-40" style="margin-left:40px;">
      <span>{{ filteredPosts.length }} posts</span>
    </div>

    <section class="mb-60" style="padding-left:40px;">
      <div class="flex flex-col gap-24">
        <div v-for="(p, i) in filteredPosts" :key="p.id"
          class="card-geek stagger-item" :class="{ visible: vis.visible[i] || i < 6 }">
          <div class="flex items-center justify-between mb-20">
            <span class="badge-geek">{{ p.category }}</span>
            <span class="text-faint" style="font-size:var(--font-size-xs);">{{ p.date }}</span>
          </div>
          <h3 style="font-size:var(--font-size-base); font-weight:400; color:rgba(255,255,255,0.82);">{{ p.title }}</h3>
          <p class="text-dim" style="margin:12px 0 20px;">{{ p.excerpt }}</p>
          <div class="flex items-center gap-12">
            <RouterLink :to="p.link" class="btn-geek" style="font-size:var(--font-size-xs);">
              <Icon icon="mdi:book-open" width="14" /> 阅读
            </RouterLink>
            <span class="text-faint" style="font-size:var(--font-size-xs);">{{ p.author }}</span>
          </div>
        </div>
      </div>
      <div v-if="filteredPosts.length === 0" class="text-dim flex items-center gap-12 mt-40">
        <Icon icon="mdi:file-remove" width="20" /> 暂无文章。
      </div>
    </section>

    <section class="mb-40" style="padding-left:40px;">
      <TagCloud :tags="allTags" @tag-click="activeCategory = 'all'" />
      <RssSubscribe class="mt-20" />
    </section>
  </div>
</template>

<style scoped>
.spacer {
  flex: 1;
}
</style>
