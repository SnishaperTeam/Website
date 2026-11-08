<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { Icon } from '@iconify/vue'

const route = useRoute()
const loading = ref(true)
const projectContent = ref('')
const projectTitle = ref('')

onMounted(async () => { await loadProject() })

async function loadProject() {
  loading.value = true
  try {
    const slug = route.params.slug as string
    const response = await fetch(`/project/${slug}.md`)
    if (!response.ok) throw new Error('not found')
    const content = await response.text()
    const m = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
    if (m) {
      const fm: Record<string, string> = {}
      m[1].split('\n').forEach(l => {
        const [k, ...v] = l.split(':'); if (k) fm[k.trim()] = v.join(':').trim()
      })
      projectTitle.value = fm.title || slug
      projectContent.value = m[2].trim()
    } else {
      projectTitle.value = slug
      projectContent.value = content.trim()
    }
  } catch {
    projectContent.value = ''
  } finally { loading.value = false }
}
</script>

<template>
  <div>
    <div v-if="loading" class="flex items-center gap-12 page-head text-dim">
      <span class="text-faint">加载中...</span>
    </div>

    <article v-else-if="projectContent" class="page-head">
      <h1 style="font-size:var(--font-size-xl); font-weight:400; color:rgba(255,255,255,0.85); margin-bottom:40px;">{{ projectTitle }}</h1>
      <MarkdownRenderer :content="projectContent" />
      <footer class="mt-40" style="padding-top:24px; border-top:1px solid var(--color-border);">
        <RouterLink to="/projects" class="btn-geek" style="font-size:var(--font-size-xs);">
          <Icon icon="mdi:arrow-left" width="14" /> 返回项目
        </RouterLink>
      </footer>
    </article>

    <div v-else class="page-head">
      <Icon icon="mdi:folder-remove" width="48" style="color:var(--color-text-faint); margin-bottom:16px;" />
      <h2 style="font-size:var(--font-size-lg);">未找到</h2>
      <p class="text-dim">这个项目不存在或已被移除。</p>
      <RouterLink to="/projects" class="btn-geek mt-20">返回项目</RouterLink>
    </div>
  </div>
</template>