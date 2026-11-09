<template>
  <section class="comments">
    <div class="sec-head">评论 <span class="count">{{ comments.length }}</span></div>

    <div v-if="isAuthenticated" class="composer">
      <textarea v-model="draft" rows="3" placeholder="写下你的看法..." maxlength="2000"></textarea>
      <div class="composer-foot">
        <span class="hint">{{ draft.length }}/2000</span>
        <button class="btn-geek" :disabled="!draft.trim() || busy" @click="submit">
          {{ busy ? '提交中...' : '发表评论' }}
        </button>
      </div>
      <p v-if="error" class="err">{{ error }}</p>
    </div>
    <div v-else class="login-tip">
      <RouterLink to="/auth">登录</RouterLink> 后可参与评论。
    </div>

    <div v-if="!comments.length" class="empty">还没有评论</div>
    <div v-else class="list">
      <div v-for="c in comments" :key="c.id" class="comment">
        <div class="avatar">
          <img v-if="c.avatarUrl" :src="c.avatarUrl" :alt="c.author" />
          <span v-else>{{ (c.author || '匿').slice(0, 1).toUpperCase() }}</span>
        </div>
        <div class="body">
          <div class="meta">
            <span class="name">{{ c.author }}</span>
            <span class="time">{{ formatTime(c.createdAt) }}</span>
          </div>
          <p class="text">{{ c.content }}</p>
        </div>
        <button v-if="user?.id === c.userId" class="del" title="删除" @click="remove(c)">
          <Icon icon="mdi:close" width="14" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '@/composables/useAuth'
import { addComment, getComments, removeComment, type Comment } from '@/composables/useSiteData'

const props = defineProps<{ slug: string }>()
const { user, isAuthenticated } = useAuth()

const comments = ref<Comment[]>([])
const draft = ref('')
const busy = ref(false)
const error = ref('')

function formatTime(value: string) {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString('zh-CN', { hour12: false })
}

async function load() {
  comments.value = await getComments(props.slug)
}

async function submit() {
  const content = draft.value.trim()
  if (!content || busy.value) return
  busy.value = true
  error.value = ''
  try {
    const data = await addComment(props.slug, content)
    comments.value.push(data.comment)
    draft.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : '发表失败'
  } finally {
    busy.value = false
  }
}

async function remove(c: Comment) {
  try {
    await removeComment(c.id)
    comments.value = comments.value.filter((item) => item.id !== c.id)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败'
  }
}

onMounted(load)
</script>

<style scoped>
.comments {
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.sec-head {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

.count {
  color: var(--color-text-faint);
  margin-left: 6px;
}

.composer textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-family: inherit;
  font-size: var(--font-size-sm);
  line-height: 1.7;
  padding: 12px;
  resize: vertical;
  outline: none;
}

.composer textarea:focus {
  border-color: rgba(255, 255, 255, 0.25);
}

.composer-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
}

.err {
  font-size: var(--font-size-xs);
  color: #ff7b72;
  margin-top: 8px;
}

.login-tip {
  font-size: var(--font-size-sm);
  color: var(--color-text-dim);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  margin-bottom: 24px;
}

.empty {
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
  padding: 24px 0;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 24px;
}

.comment {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 14px;
  background: rgba(255, 255, 255, 0.015);
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.body {
  flex: 1;
  min-width: 0;
}

.meta {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.name {
  font-size: var(--font-size-sm);
  color: var(--color-heading);
}

.time {
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
  font-family: var(--font-mono);
}

.text {
  font-size: var(--font-size-sm);
  color: var(--color-text-dim);
  line-height: 1.7;
  margin-top: 6px;
  white-space: pre-wrap;
  word-break: break-word;
}

.del {
  background: none;
  border: none;
  color: var(--color-text-faint);
  cursor: pointer;
  padding: 2px;
}

.del:hover {
  color: #ff7b72;
}
</style>
