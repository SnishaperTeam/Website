<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const route = useRoute()
const loading = ref(true)
const postContent = ref('')
const postTitle = ref('')
const postDate = ref('')

onMounted(async () => {
  await loadPost()
})

async function loadPost() {
  loading.value = true
  try {
    const slug = route.params.slug as string
    const response = await fetch(`/blog/${slug}.md`)
    if (!response.ok) throw new Error('not found')
    const content = await response.text()
    const { title, date, body } = parseFrontMatter(content)
    postTitle.value = title || slug
    postDate.value = date || ''
    postContent.value = body
  } catch {
    postContent.value = ''
  } finally { loading.value = false }
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
</script>

<template>
  <div>
    <div v-if="loading" class="flex items-center gap-12 page-head text-dim">
      <span class="text-faint">加载中...</span>
    </div>

    <article v-else-if="postContent" class="page-head">
      <h1 style="font-size:var(--font-size-xl); font-weight:400; color:rgba(255,255,255,0.85); margin-bottom:8px;">{{ postTitle }}</h1>
      <span v-if="postDate" class="text-faint" style="font-size:var(--font-size-xs); display:block; margin-bottom:40px;">
        <Icon icon="mdi:calendar" width="14" /> {{ postDate }}
      </span>
      <MarkdownRenderer :content="postContent" />
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