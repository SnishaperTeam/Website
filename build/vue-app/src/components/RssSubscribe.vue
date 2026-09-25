<template>
  <div class="rss-subscribe-container">
    <div class="rss-header">
      <Icon icon="mdi:rss" class="rss-icon" />
      <h3 class="rss-title">RSS 订阅</h3>
    </div>
    <p class="rss-description">订阅我的博客，获取最新文章更新</p>
    <div class="rss-url-container">
      <input type="text" :value="feedUrl" readonly class="rss-url-input" @click="selectUrl" />
      <button class="rss-copy-btn" @click="copyUrl" :class="{ copied: isCopied }">
        <Icon :icon="isCopied ? 'mdi:check' : 'mdi:content-copy'" />
        <span>{{ isCopied ? '已复制' : '复制' }}</span>
      </button>
    </div>
    <a :href="feedUrl" target="_blank" class="rss-open-link">
      <Icon icon="mdi:open-in-new" />
      <span>在新标签页中打开</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const feedUrl = 'https://jetcpp.ccwu.cc/feed.xml'
const isCopied = ref(false)

const selectUrl = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.select()
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(feedUrl)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
  }
}
</script>

<style scoped>
.rss-subscribe-container {
  padding: 1.5rem;
  background: var(--color-bg-soft);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.rss-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.rss-icon {
  color: #f26522;
  font-size: 1.25rem;
}

.rss-title {
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--color-heading);
  margin: 0;
}

.rss-description {
  color: var(--color-text);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.rss-url-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.rss-url-input {
  flex: 1;
  padding: 0.6rem 0.75rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-heading);
  font-size: 0.85rem;
  font-family: monospace;
  outline: none;
  cursor: pointer;
  transition: border-color 0.25s ease;
}

.rss-url-input:hover {
  border-color: var(--color-border-hover);
}

.rss-url-input:focus {
  border-color: var(--color-primary);
}

.rss-copy-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.25s ease;
}

.rss-copy-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.rss-copy-btn:active {
  transform: translateY(0);
}

.rss-copy-btn.copied {
  background: #2e7d32;
}

.rss-open-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-primary);
  font-size: 0.85rem;
  text-decoration: none;
  transition: color 0.25s ease;
}

.rss-open-link:hover {
  color: var(--color-primary-light);
}

@media (max-width: 480px) {
  .rss-url-container {
    flex-direction: column;
  }

  .rss-copy-btn {
    justify-content: center;
  }
}
</style>
