<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ whoami {{ userId }}</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ profile?.nickname || '加载中...' }}</span>
      </h1>
    </section>

    <section class="mb-40" style="padding-left:40px; padding-right:40px;">
      <div v-if="loadError" class="text-dim">{{ loadError }}</div>

      <div v-else-if="profile" class="term-block profile-block">
        <div class="term-bar">
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span class="profile-bar-title">profile.json</span>
        </div>
        <div class="term-body">
          <div class="profile-head">
            <div class="avatar">
              <img v-if="profile.avatarUrl" :src="profile.avatarUrl" :alt="profile.nickname" />
              <span v-else>{{ profile.nickname.slice(0, 1).toUpperCase() }}</span>
            </div>
            <div>
              <div class="profile-name">{{ profile.nickname }}</div>
              <div class="profile-meta">注册于 {{ formatDate(profile.createdAt) }}</div>
              <div v-if="isSelf" class="profile-meta">{{ profile.email }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <template v-if="isSelf">
      <div class="divider-geek mb-40" style="margin-left:40px;"><span>edit</span></div>

      <section class="mb-40" style="padding-left:40px; padding-right:40px;">
        <div class="term-block profile-block">
          <div class="term-bar">
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span class="profile-bar-title">edit-profile.sh</span>
          </div>
          <div class="term-body">
            <form class="edit-form" @submit.prevent="saveProfile">
              <label class="field">
                <span class="field-label">$ nickname</span>
                <input v-model.trim="editNickname" type="text" maxlength="24" placeholder="2-24 个字符" />
              </label>
              <label class="field">
                <span class="field-label">$ avatar_url</span>
                <input v-model.trim="editAvatar" type="url" placeholder="https://...（留空使用首字母头像）" />
              </label>
              <p v-if="profileMsg" class="msg">{{ profileMsg }}</p>
              <button class="btn-geek submit" type="submit" :disabled="profileBusy">
                {{ profileBusy ? '保存中...' : '$ 保存资料' }}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section class="mb-40" style="padding-left:40px; padding-right:40px;">
        <div class="term-block profile-block">
          <div class="term-bar">
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span class="profile-bar-title">change-password.sh</span>
          </div>
          <div class="term-body">
            <form class="edit-form" @submit.prevent="savePassword">
              <label class="field">
                <span class="field-label">$ current_password</span>
                <input v-model="currentPassword" type="password" autocomplete="current-password" required />
              </label>
              <label class="field">
                <span class="field-label">$ new_password</span>
                <input v-model="newPassword" type="password" autocomplete="new-password" placeholder="至少 8 位" required />
              </label>
              <label class="field">
                <span class="field-label">$ confirm_password</span>
                <input v-model="confirmPassword" type="password" autocomplete="new-password" required />
              </label>
              <p v-if="passwordMsg" class="msg">{{ passwordMsg }}</p>
              <button class="btn-geek submit" type="submit" :disabled="passwordBusy">
                {{ passwordBusy ? '处理中...' : '$ 修改密码' }}
              </button>
            </form>
          </div>
        </div>
      </section>

      <div class="divider-geek mb-40" style="margin-left:40px;"><span>local data</span></div>

      <section class="mb-40" style="padding-left:40px; padding-right:40px;">
        <div class="flex gap-12 flex-wrap mb-20">
          <button class="tag-pill" style="cursor:pointer;"
            :style="tabStyle('favorites')" @click="tab = 'favorites'">收藏 ({{ favoriteItems.length }})</button>
          <button class="tag-pill" style="cursor:pointer;"
            :style="tabStyle('history')" @click="tab = 'history'">历史 ({{ historyRecords.length }})</button>
        </div>
        <FavoritesList
          v-if="tab === 'favorites'"
          :items="favoriteItems"
          @item-click="openFavorite"
          @remove="removeFavorite"
        />
        <HistoryList v-else :history="historyRecords" @item-click="openHistory" @clear="clearHistory" />
      </section>

      <div class="divider-geek mb-40" style="margin-left:40px;"><span>danger zone</span></div>

      <section class="mb-60" style="padding-left:40px; padding-right:40px;">
        <div class="term-block profile-block">
          <div class="term-bar">
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span class="profile-bar-title">danger.sh</span>
          </div>
          <div class="term-body">
            <p class="text-dim" style="margin-top:0;">删除账号将永久移除服务端资料，本地收藏与测评历史仍保留在浏览器中。</p>
            <form class="edit-form" @submit.prevent="removeAccount">
              <label class="field">
                <span class="field-label">$ password</span>
                <input v-model="deletePassword" type="password" autocomplete="current-password" placeholder="输入密码以确认" required />
              </label>
              <p v-if="dangerMsg" class="msg">{{ dangerMsg }}</p>
              <button class="btn-geek submit danger" type="submit" :disabled="dangerBusy">
                {{ dangerBusy ? '处理中...' : '$ 删除账号' }}
              </button>
            </form>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FavoritesList from '@/components/FavoritesList.vue'
import HistoryList from '@/components/HistoryList.vue'
import { useAuth, type AuthUser } from '@/composables/useAuth'
import { useFavorites, useHistory, type FavoriteItem } from '@/composables/useStore'

const route = useRoute()
const router = useRouter()
const { user, updateProfile, changePassword, deleteAccount, signOut } = useAuth()
const { favorites, toggleFavorite, loadFavorites } = useFavorites()
const { history, loadHistory, clearHistory } = useHistory()

const userId = computed(() => (route.params.userId as string) || '')
const profile = ref<AuthUser | null>(null)
const loadError = ref('')

const isSelf = computed(() => !!user.value && user.value.id === userId.value)

const editNickname = ref('')
const editAvatar = ref('')
const profileMsg = ref('')
const profileBusy = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordMsg = ref('')
const passwordBusy = ref(false)

const deletePassword = ref('')
const dangerMsg = ref('')
const dangerBusy = ref(false)

const tab = ref<'favorites' | 'history'>('favorites')

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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('zh-CN')
}

function tabStyle(which: 'favorites' | 'history') {
  const on = tab.value === which
  return {
    color: on ? 'rgba(255,255,255,0.85)' : 'var(--color-text-faint)',
    borderColor: on ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
    background: on ? 'rgba(255,255,255,0.06)' : 'transparent',
  }
}

async function loadProfile() {
  loadError.value = ''
  profile.value = null
  if (!userId.value) {
    loadError.value = '缺少用户 ID'
    return
  }
  try {
    const res = await fetch(`/api/users/${userId.value}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '加载失败')
    profile.value = data.user
    if (isSelf.value && user.value) {
      editNickname.value = user.value.nickname
      editAvatar.value = user.value.avatarUrl || ''
    }
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : '加载失败'
  }
}

async function saveProfile() {
  profileMsg.value = ''
  profileBusy.value = true
  try {
    await updateProfile({ nickname: editNickname.value, avatarUrl: editAvatar.value || null })
    profileMsg.value = '已保存'
  } catch (e) {
    profileMsg.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    profileBusy.value = false
  }
}

async function savePassword() {
  passwordMsg.value = ''
  if (newPassword.value !== confirmPassword.value) {
    passwordMsg.value = '两次输入的新密码不一致'
    return
  }
  passwordBusy.value = true
  try {
    await changePassword(currentPassword.value, newPassword.value)
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    passwordMsg.value = '密码已更新'
  } catch (e) {
    passwordMsg.value = e instanceof Error ? e.message : '修改失败'
  } finally {
    passwordBusy.value = false
  }
}

async function removeAccount() {
  dangerMsg.value = ''
  dangerBusy.value = true
  try {
    await deleteAccount(deletePassword.value)
    signOut()
    router.push('/')
  } catch (e) {
    dangerMsg.value = e instanceof Error ? e.message : '删除失败'
  } finally {
    dangerBusy.value = false
  }
}

function openFavorite(item: FavoriteItem) {
  if (item.type === 'test') router.push(`/tests/${item.id}`)
  else router.push('/blog')
}

function removeFavorite(id: string) {
  const target = favorites.value.find((f) => f.id === id)
  if (target) toggleFavorite(target)
}

function openHistory(item: { testId?: string }) {
  if (item.testId) router.push(`/tests/${item.testId}`)
}

onMounted(() => {
  loadFavorites()
  loadHistory()
  loadProfile()
})

watch([userId, user], () => {
  loadProfile()
})
</script>

<style scoped>
.profile-block {
  max-width: 640px;
}

.profile-bar-title {
  margin-left: 8px;
  opacity: 0.55;
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.profile-head {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 1.25rem;
}

.profile-meta {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
  font-family: var(--font-mono);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.field input {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.9rem;
  color: var(--color-text);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus {
  border-color: rgba(255, 255, 255, 0.4);
}

.msg {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.submit {
  align-self: flex-start;
  font-family: var(--font-mono);
}

.submit.danger {
  border-color: rgba(255, 123, 114, 0.4);
  color: #ff7b72;
}

.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
