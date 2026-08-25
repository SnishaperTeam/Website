<template>
  <div class="markdown-content" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps<{
  content: string
}>()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\u3400-\u4dbf]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-')
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, char => {
    switch (char) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      case "'": return '&#39;'
      default: return char
    }
  })
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
})

md.renderer.rules.heading_open = (tokens, idx) => {
  const token = tokens[idx]
  const nextToken = tokens[idx + 1]
  const text = nextToken.children?.reduce((acc: string, t: any) => acc + t.content, '') || ''
  const id = slugify(text) || `heading-${idx}`
  return `<h${token.tagLevel} id="${id}"><a class="header-anchor" href="#${id}" aria-hidden="true"></a>`
}

const defaultRender =
  md.renderer.rules.fence ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const code = token.content
  const lang = escapeHtml(token.info.trim())
  const codeId = `code-${Math.random().toString(36).slice(2, 11)}`
  const originalHtml = defaultRender(tokens, idx, options, env, self)

  return `
    <div class="code-block-wrapper">
      ${lang ? `<div class="code-lang-badge">${lang}</div>` : ''}
      <button class="code-copy-btn" onclick="copyCode('${codeId}')" title="复制代码">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span class="copy-text">复制</span>
      </button>
      <div class="code-content" id="${codeId}">${originalHtml}</div>
    </div>
  `
}

const renderedHtml = computed(() => md.render(props.content))

onMounted(() => {
  ;(window as any).copyCode = async (elementId: string) => {
    const codeElement = document.getElementById(elementId)?.querySelector('code')
    if (!codeElement) return
    const code = codeElement.textContent || ''
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      return
    }
    const btn = document.querySelector(`button[onclick="copyCode('${elementId}')"]`)
    const copyText = btn?.querySelector('.copy-text')
    if (copyText) {
      copyText.textContent = '已复制!'
      btn.classList.add('copied')
      setTimeout(() => {
        copyText.textContent = '复制'
        btn.classList.remove('copied')
      }, 2000)
    }
  }
})
</script>

<style scoped>
@import '@/assets/markdown-styles.css';
</style>
