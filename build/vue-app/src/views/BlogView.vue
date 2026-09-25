<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'
import { useTags } from '@/composables/useStore'
import { Icon } from '@iconify/vue'
import { useTypewriter } from '@/composables/useTypewriter'
import { useStaggeredFade } from '@/composables/useStaggeredFade'
import TagCloud from '@/components/TagCloud.vue'
import RssSubscribe from '@/components/RssSubscribe.vue'

const { user, isAuthenticated } = useAuth()
const { allTags, loadTags } = useTags()

const { display, cursor, done } = useTypewriter('阅读、学习、分享。', 50)

const loading = ref(true)
const activeCategory = ref('all')

const categories = [
  { value: 'all', label: '全部', icon: 'mdi:view-grid' },
  { value: '编程教程', label: '教程', icon: 'mdi:code-braces' },
  { value: '技术分享', label: '分享', icon: 'mdi:share-variant' },
  { value: '个人文章', label: '个人', icon: 'mdi:note-text' },
]

const staticPosts = [
  {
    id: 'static-1', originalId: null,
    title: 'C++完全入门指南：从Hello World到结构体',
    excerpt: '详细的C++入门指南，从Hello World到结构体等核心概念，适合初学者系统学习。',
    date: '2026-12-24', author: 'SnishaperTeam',
    link: '/blog/cpp-guide', category: '编程教程',
    isEditable: false,
  },
  {
    id: 'static-2', originalId: null,
    title: 'C# 从入门到精通（零基础到进阶）',
    excerpt: '全面的C#学习指南，涵盖基础语法到高级特性，附带学生管理系统实战项目。',
    date: '2026-03-04', author: 'SnishaperTeam',
    link: '/blog/csharp-guide', category: '编程教程',
    isEditable: false,
  },
  {
    id: 'static-3', originalId: null,
    title: 'XAML 从入门到精通（零基础到进阶）',
    excerpt: 'WPF界面开发完全指南，从XAML基础语法到MVVM架构模式，待办事项应用实战。',
    date: '2026-03-04', author: 'SnishaperTeam',
    link: '/blog/xaml-guide', category: '编程教程',
    isEditable: false,
  },
]

const userPosts = ref<any[]>([])

const allPosts = computed(() => {
  const formatted = userPosts.value.map(post => ({
    id: `user-${post.id}`, originalId: post.id,
    title: post.title, excerpt: post.excerpt || post.content?.substring(0, 200) + '...',
    date: new Date(post.created_at).toLocaleDateString('zh-CN'),
    author: post.author_nickname || '匿名',
    link: `/blog/${post.slug}`, category: post.category || '个人文章',
    isEditable: user.value?.id === post.author_id,
    isDeletable: user.value?.id === post.author_id,
  }))
  return [...formatted, ...staticPosts]
})

const filteredPosts = computed(() => {
  if (activeCategory.value === 'all') return allPosts.value
  return allPosts.value.filter(p => p.category === activeCategory.value)
})

const getCategoryCount = (cat: string) => allPosts.value.filter(p => p.category === cat).length

onMounted(async () => {
  await Promise.all([loadUserPosts(), loadTags()])
})

async function loadUserPosts() {
  loading.value = true
  try {
    const { data: postsData } = await supabase
      .from('user_posts').select('*').eq('published', true).order('created_at', { ascending: false })
    const posts = postsData || []
    const authorIds = [...new Set(posts.map(p => p.author_id).filter(Boolean))]
    let authorMap = new Map()
    if (authorIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles').select('id, nickname').in('id', authorIds)
      if (profilesData) profilesData.forEach(p => authorMap.set(p.id, p.nickname))
    }
    userPosts.value = posts.map(p => ({ ...p, author_nickname: authorMap.get(p.author_id) || null }))
  } catch {
    try {
      const { data } = await supabase
        .from('user_posts').select('*').eq('published', true).order('created_at', { ascending: false })
      userPosts.value = (data || []).map(p => ({ ...p, author_nickname: null }))
    } catch { userPosts.value = [] }
  } finally { loading.value = false }
}

const handleDeletePost = async (postId: string, title: string) => {
  if (!confirm(`确认删除 "${title}"？`)) return
  const { error } = await supabase.from('user_posts').delete().eq('id', postId)
  if (!error) userPosts.value = userPosts.value.filter(p => p.id !== postId)
}

const vis = useStaggeredFade(6, 100)
</script>

<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ cat blog/</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ display }}</span>
        <span class="typewriter-cursor" :class="{ done }"></span>
      </h1>
      <div v-if="isAuthenticated" class="mt-20" style="padding-left:40px;">
        <RouterLink to="/blog/new" class="btn-geek" style="font-size:var(--font-size-xs);">
          <Icon icon="mdi:pencil" width="14" /> 写文章
        </RouterLink>
      </div>
    </section>

    <section class="mb-40">
      <div class="flex gap-12 flex-wrap" style="padding-left:40px;">
        <button v-for="cat in categories" :key="cat.value"
          class="tag-pill" style="cursor:pointer;"
          :style="{
            color: activeCategory === cat.value ? 'rgba(255,255,255,0.85)' : 'var(--color-text-faint)',
            borderColor: activeCategory === cat.value ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
            background: activeCategory === cat.value ? 'rgba(255,255,255,0.06)' : 'transparent',
          }"
          @click="activeCategory = cat.value"
        >{{ cat.label }} <span v-if="cat.value !== 'all'" style="opacity:0.5;margin-left:4px;">({{ getCategoryCount(cat.value) }})</span></button>
      </div>
    </section>

    <div class="divider-geek mb-40" style="margin-left:40px;">
      <span>{{ filteredPosts.length }} posts</span>
    </div>

    <section class="mb-60" style="padding-left:40px;">
      <div v-if="loading" class="flex flex-col gap-16">
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
      </div>
      <div v-else class="flex flex-col gap-24">
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
            <template v-if="p.isEditable">
              <RouterLink :to="`/blog/edit/${p.originalId}`" class="nav-icon-btn"><Icon icon="mdi:pencil" width="14" /></RouterLink>
              <button class="nav-icon-btn" @click="handleDeletePost(p.originalId, p.title)" title="删除"><Icon icon="mdi:delete" width="14" /></button>
            </template>
          </div>
        </div>
      </div>
      <div v-if="!loading && filteredPosts.length === 0" class="text-dim flex items-center gap-12 mt-40">
        <Icon icon="mdi:file-remove" width="20" /> 暂无文章。
      </div>
    </section>

    <section class="mb-40" style="padding-left:40px;">
      <TagCloud :tags="allTags" @tag-click="activeCategory = 'all'" />
      <RssSubscribe class="mt-20" />
    </section>
  </div>
</template>