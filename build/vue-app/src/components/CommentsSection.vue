<template>
  <div class="comments-section">
    <h3 class="comments-title">
      <Icon icon="mdi:comment-text-outline" />
      评论 ({{ comments.length }})
    </h3>

    <!-- 未登录提示 -->
    <div v-if="!isAuthenticated" class="login-prompt">
      <Icon icon="mdi:lock" />
      <p>请登录后发表评论</p>
      <RouterLink to="/auth" class="btn-geek" style="font-size:var(--font-size-xs);"> 去登录 </RouterLink>
    </div>

    <!-- 评论输入框 -->
    <div v-else class="comment-form">
      <div class="user-info">
        <img
          v-if="currentUserProfile?.avatar_url"
          :src="currentUserProfile.avatar_url"
          alt="头像"
          class="avatar-small"
        />
        <Icon v-else icon="mdi:account-circle" class="avatar-small" />
        <span class="username">{{ currentUserProfile?.nickname || '用户' }}</span>
      </div>
      <textarea
        v-model="newComment"
        placeholder="写下你的想法..."
        rows="4"
        class="comment-input"
        :disabled="submitting"
      ></textarea>
      <div class="cf-turnstile" data-sitekey="0x4AAAAAAD9eupJAQYJfXjdp" data-action="turnstile-spin-v2"></div>
      <div class="form-actions">
        <span class="char-count">{{ newComment.length }}/500</span>
        <button
          @click="handleSubmitComment"
          class="btn-geek"
          style="font-size:var(--font-size-xs);"
          :disabled="!newComment.trim() || submitting || newComment.length > 500"
        >
          {{ submitting ? '发送中...' : '发表评论' }}
        </button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-if="loading" class="loading-comments">
      <div class="spinner"></div>
      <p>加载评论中...</p>
    </div>

    <div v-else-if="comments.length === 0" class="no-comments">
      <Icon icon="mdi:comment-quote" />
      <p>暂无评论，来发表第一条评论吧！</p>
    </div>

    <div v-else class="comments-list">
      <div v-for="comment in sortedComments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <div class="comment-user">
            <img
              v-if="comment.profiles?.avatar_url"
              :src="comment.profiles.avatar_url"
              alt="头像"
              class="avatar-small"
            />
            <Icon v-else icon="mdi:account-circle" class="avatar-small" />
            <RouterLink :to="`/user/${comment.user_id}`" class="comment-username">
              {{ comment.profiles?.nickname || '匿名用户' }}
            </RouterLink>
          </div>
          <div class="comment-meta">
            <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
            <button
              v-if="canDeleteComment(comment)"
              @click="handleDeleteComment(comment.id)"
              class="delete-btn"
              title="删除评论"
            >
              <Icon icon="mdi:delete" />
            </button>
          </div>
        </div>
        <div class="comment-content">
          {{ comment.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  postSlug: string
}>()

const { user: currentUser, isAuthenticated } = useAuth()
const comments = ref<any[]>([])
const newComment = ref('')
const loading = ref(true)
const submitting = ref(false)
const currentUserProfile = ref<any>(null)

// 按时间倒序排列评论
const sortedComments = computed(() => {
  return [...comments.value].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
})

onMounted(async () => {
  await loadComments()
  if (isAuthenticated.value) {
    await loadCurrentUserProfile()
  }
})

// 监听认证状态变化，重新加载评论
watch(isAuthenticated, async (newValue) => {
  // 登录或登出时都重新加载评论
  await loadComments()

  if (newValue) {
    // 登录时加载当前用户资料
    await loadCurrentUserProfile()
  } else {
    // 登出时清空当前用户资料
    currentUserProfile.value = null
  }
})

// 加载评论
async function loadComments() {
  loading.value = true

  try {
    // 第一步：获取评论列表
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('post_slug', props.postSlug)
      .order('created_at', { ascending: false })

    if (commentsError) throw commentsError

    if (!commentsData || commentsData.length === 0) {
      comments.value = []
      return
    }

    // 第二步：获取所有评论用户的资料
    const userIds = [...new Set(commentsData.map((c) => c.user_id))]
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url')
      .in('id', userIds)

    if (profilesError) throw profilesError

    // 第三步：合并评论和用户资料
    const profilesMap = new Map()
    profilesData?.forEach((profile) => {
      profilesMap.set(profile.id, profile)
    })

    comments.value = commentsData.map((comment) => ({
      ...comment,
      profiles: profilesMap.get(comment.user_id) || null,
    }))
  } catch (err: any) {
    console.error('加载评论失败:', err)
  } finally {
    loading.value = false
  }
}

// 加载当前用户资料
async function loadCurrentUserProfile() {
  if (!currentUser.value) return

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.value.id)
      .single()

    if (error) throw error

    currentUserProfile.value = data
  } catch (err: any) {
    console.error('加载用户资料失败:', err)
  }
}

const siteVerify = async (token: string): Promise<boolean> => {
  try {
    const r = await fetch('/turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    const data = await r.json()
    return data.success === true
  } catch {
    return false
  }
}

const handleSubmitComment = async () => {
  if (!newComment.value.trim() || !currentUser.value) return

  const turnstileToken = (window as any).turnstile?.getResponse()
  if (!turnstileToken) {
    alert('请完成人机验证')
    return
  }
  const valid = await siteVerify(turnstileToken)
  if (!valid) {
    alert('人机验证失败，请稍后重试')
    ;(window as any).turnstile?.reset()
    return
  }

  submitting.value = true

  try {
    // 第一步：插入评论
    const { data: commentData, error: insertError } = await supabase
      .from('comments')
      .insert({
        post_slug: props.postSlug,
        user_id: currentUser.value.id,
        content: newComment.value.trim(),
      })
      .select()
      .single()

    if (insertError) throw insertError

    if (!commentData) return

    // 第二步：获取当前用户资料
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('nickname, avatar_url')
      .eq('id', currentUser.value.id)
      .single()

    if (profileError) throw profileError

    // 第三步：合并数据并添加到列表
    const newCommentObj = {
      ...commentData,
      profiles: profileData,
    }

    comments.value.unshift(newCommentObj)
    newComment.value = ''
  } catch (err: any) {
    console.error('发表评论失败:', err)
    alert('发表评论失败: ' + (err.message || '请稍后重试'))
  } finally {
    submitting.value = false
  }
}

// 删除评论
async function handleDeleteComment(commentId: string) {
  if (!confirm('确定要删除这条评论吗？')) return

  try {
    const { error } = await supabase.from('comments').delete().eq('id', commentId)

    if (error) throw error

    // 从列表中移除
    comments.value = comments.value.filter((c) => c.id !== commentId)
  } catch (err: any) {
    console.error('删除评论失败:', err)
    alert('删除评论失败: ' + (err.message || '请稍后重试'))
  }
}

// 检查是否可以删除评论
function canDeleteComment(comment: any) {
  return currentUser.value && currentUser.value.id === comment.user_id
}

// 格式化日期
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  // 小于24小时
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  // 小于7天
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  }

  // 超过7天显示具体日期
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.comments-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.comments-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-prompt {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 255, 65, 0.05);
  border-radius: var(--radius-md);
  border: 1px dashed rgba(0, 255, 65, 0.3);
}

.login-prompt i {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.login-prompt p {
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.comment-form {
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.username {
  color: var(--color-text);
  font-weight: 400;
}

.comment-input {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;
}

.comment-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.08);
}

.comment-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.char-count {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.loading-comments {
  text-align: center;
  padding: 2rem;
}

.no-comments {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-text-secondary);
}

.no-comments :deep(.iconify) {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.comment-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.comment-username {
  color: var(--color-text);
  font-weight: 400;
  text-decoration: none;
  transition: color 0.3s ease;
}

.comment-username:hover {
  color: var(--color-primary);
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.comment-date {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.delete-btn:hover {
  color: #ff5f57;
  opacity: 1;
}

.comment-content {
  color: var(--color-text);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 255, 65, 0.2);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
