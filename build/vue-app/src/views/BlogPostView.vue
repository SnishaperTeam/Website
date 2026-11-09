<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import CommentsSection from '@/components/CommentsSection.vue'
import { useAuth } from '@/composables/useAuth'
import { useFavorites } from '@/composables/useStore'
import { getDynamicPost, removePost, type DynamicPost } from '@/composables/useSiteData'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const { isFavorite, toggleFavorite } = useFavorites()

const loading = ref(true)
const postContent = ref('')
const postTitle = ref('')
const postDate = ref('')
const dynamicPost = ref<DynamicPost | null>(null)
const actionError = ref('')

const slug = computed(() => route.params.slug as string)

const isAuthor = computed(() => !!user.value && dynamicPost.value?.authorId === user.value.id)

const favItem = computed(() => ({
  id: slug.value,
  title: postTitle.value || slug.value,
  description: dynamicPost.value?.excerpt || '博客文章',
  icon: 'mdi:book-open-variant',
  color: '#FFB347',
  type: 'blog' as const,
}))

onMounted(loadPost)

async function loadPost() {
  loading.value = true
  dynamicPost.value = null
  postContent.value = ''
  try {
    const response = await fetch(`/blog/${slug.value}.md`)
    if (response.ok) {
      const content = await response.text()
      const { title, date, body } = parseFrontMatter(content)
      postTitle.value = title || slug.value
      postDate.value = date || ''
      postContent.value = body
      return
    }
    const post = await getDynamicPost(slug.value)
    if (post) {
      dynamicPost.value = post
      postTitle.value = post.title
      postDate.value = String(post.createdAt).slice(0, 10)
      postContent.value = post.content
      return
    }
  } catch {
    postContent.value = ''
  } finally {
    loading.value = false
  }
}

function parseFrontMatter(content: string) {
  const m = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (m) {
    const fm: Record<string, string> = {}
    m[1].split('\n').forEach(l => {
      const [k, ...v] = l.split(':'); if (k) fm[k.trim()] = v.join(':').trim()
    })
    return { title: fm.title || '', date: fm.date || '', body: m[2].trim() }
  }
  return { title: '', date: '', body: content.trim() }
}

async function deleteCurrentPost() {
  if (!dynamicPost.value) return
  if (!confirm(`删除文章「${dynamicPost.value.title}」？`)) return
  try {
    await removePost(dynamicPost.value.id)
    router.push('/blog')
  } catch (e) {
    actionError.value = e instanceof Error ? e.message : '删除失败'
  }
}
</script>

<template>
  <div>
    <div v-if="loading" class="flex items-center gap-12 page-head text-dim">
      <span class="text-faint">加载中...</span>
    </div>

    <article v-else-if="postContent" class="page-head">
      <h1 style="font-size:var(--font-size-xl); font-weight:400; color:rgba(255,255,255,0.85); margin-bottom:8px;">{{ postTitle }}</h1>
      <div class="post-meta">
        <span v-if="postDate" class="text-faint" style="font-size:var(--font-size-xs);">
          <Icon icon="mdi:calendar" width="14" /> {{ postDate }}
        </span>
        <span v-if="dynamicPost?.author" class="text-faint" style="font-size:var(--font-size-xs);">
          <Icon icon="mdi:account" width="14" /> {{ dynamicPost.author }}
        </span>
        <span v-if="dynamicPost" class="text-faint" style="font-size:var(--font-size-xs);">
          <Icon icon="mdi:eye" width="14" /> {{ dynamicPost.views + 1 }}
        </span>
      </div>

      <div class="post-actions">
        <button class="btn-geek" style="font-size:var(--font-size-xs);" @click="toggleFavorite(favItem)">
          <Icon :icon="isFavorite(slug) ? 'mdi:heart' : 'mdi:heart-outline'" width="14" />
          {{ isFavorite(slug) ? '已收藏' : '收藏' }}
        </button>
        <RouterLink v-if="isAuthor" :to="`/blog/edit/${dynamicPost?.id}`" class="btn-geek" style="font-size:var(--font-size-xs);">
          <Icon icon="mdi:pencil" width="14" /> 编辑
        </RouterLink>
        <button v-if="isAuthor" class="btn-geek" style="font-size:var(--font-size-xs);" @click="deleteCurrentPost">
          <Icon icon="mdi:delete-outline" width="14" /> 删除
        </button>
      </div>
      <p v-if="actionError" class="err">{{ actionError }}</p>

      <MarkdownRenderer :content="postContent" />

      <CommentsSection :slug="slug" />

      <footer class="mt-40" style="padding-top:24px; border-top:1px solid var(--color-border);">
        <RouterLink to="/blog" class="btn-geek" style="font-size:var(--font-size-xs);">
          <Icon icon="mdi:arrow-left" width="14" /> 返回博客
        </RouterLink>
      </footer>
    </article>

    <div v-else class="page-head">
      <Icon icon="mdi:file-remove" width="48" style="color:var(--color-text-faint); margin-bottom:16px;" />
      <h2 style="font-size:var(--font-size-lg);">未找到</h2>
      <p class="text-dim">这篇文章不存在或已被移除。</p>
      <RouterLink to="/blog" class="btn-geek mt-20">返回博客</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.post-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.err {
  font-size: var(--font-size-xs);
  color: #ff7b72;
  margin: -28px 0 24px;
}
</style>
