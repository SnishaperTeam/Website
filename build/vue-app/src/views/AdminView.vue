<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ sudo ./admin --panel</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ display }}</span>
        <span class="typewriter-cursor" :class="{ done }"></span>
      </h1>
    </section>

    <div v-if="!adminChecked" class="mb-60" style="padding-left:40px;">
      <div class="term-block">
        <div class="term-bar">
          <span class="term-dot"></span><span class="term-dot"></span><span class="term-dot"></span>
          <span style="margin-left:8px; opacity:0.5;">checking...</span>
        </div>
        <div class="term-body">
          <div class="term-line">./sudo --verify</div>
          <div class="skeleton" style="width:200px;height:16px;margin-top:12px;"></div>
        </div>
      </div>
    </div>

    <div v-else-if="!isAdmin" class="mb-60" style="padding-left:40px;">
      <div class="term-block">
        <div class="term-bar">
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span style="margin-left:8px; opacity:0.5;">access_denied.sh</span>
        </div>
        <div class="term-body">
          <div class="term-line">./admin --panel</div>
          <div class="term-line-out" style="margin-top:8px; color:#ff5f57;">Error: permission denied</div>
          <div class="term-line-out">You do not have administrator privileges.</div>
          <RouterLink to="/" class="btn-geek mt-20" style="display:inline-flex;">
            <Icon icon="mdi:arrow-left" width="14" /> 返回首页
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-else class="mb-60">
      <section class="mb-40" style="padding-left:40px;">
        <span class="section-title-term" style="display:inline-block; margin-bottom:16px;">// metrics</span>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
          <div class="card-geek" style="padding:20px 24px;">
            <div class="flex items-center gap-12">
              <Icon icon="mdi:account-group" width="24" style="color:var(--color-text-dim);" />
              <div>
                <div style="font-size:var(--font-size-lg); color:var(--color-white);">{{ stats.totalUsers }}</div>
                <div class="text-faint" style="font-size:var(--font-size-xs);">users</div>
              </div>
            </div>
          </div>
          <div class="card-geek" style="padding:20px 24px;">
            <div class="flex items-center gap-12">
              <Icon icon="mdi:text-box-outline" width="24" style="color:var(--color-text-dim);" />
              <div>
                <div style="font-size:var(--font-size-lg); color:var(--color-white);">{{ stats.totalPosts }}</div>
                <div class="text-faint" style="font-size:var(--font-size-xs);">posts</div>
              </div>
            </div>
          </div>
          <div class="card-geek" style="padding:20px 24px;">
            <div class="flex items-center gap-12">
              <Icon icon="mdi:comment" width="24" style="color:var(--color-text-dim);" />
              <div>
                <div style="font-size:var(--font-size-lg); color:var(--color-white);">{{ stats.totalComments }}</div>
                <div class="text-faint" style="font-size:var(--font-size-xs);">comments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style="padding-left:40px;">
        <div class="flex gap-4 mb-20" style="border-bottom:1px solid var(--color-border);">
          <button
            v-for="tab in tabs" :key="tab.key"
            class="tab-btn-term" :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <Icon :icon="tab.icon" width="14" /> {{ tab.label }}
          </button>
        </div>

        <div v-if="loading" class="flex flex-col gap-16" style="padding-top:16px;">
          <div class="skeleton skeleton-card"></div>
          <div class="skeleton skeleton-card"></div>
          <div class="skeleton skeleton-card"></div>
        </div>

        <div v-else>
          <!-- Users -->
          <div v-if="activeTab === 'users'" class="term-block">
            <div class="term-bar" style="justify-content:space-between;">
              <div class="flex items-center gap-8">
                <span class="term-dot"></span><span class="term-dot"></span><span class="term-dot"></span>
                <span style="opacity:0.5;">users — {{ filteredUsers.length }}</span>
              </div>
              <input v-model="userSearch" type="text" placeholder="search..." class="term-search" />
            </div>
            <div class="term-body" style="padding:0;">
              <table class="term-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>nickname</th>
                    <th>created</th>
                    <th>actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="profile in filteredUsers" :key="profile.id">
                    <td><span class="text-faint" style="font-size:var(--font-size-xs);">{{ profile.id.substring(0, 8) }}..</span></td>
                    <td>
                      {{ profile.nickname || '--' }}
                      <span v-if="profile.banned" class="badge-geek" style="border-color:rgba(255,95,87,0.2);color:#ff5f57;margin-left:8px;">banned</span>
                    </td>
                    <td class="text-faint" style="font-size:var(--font-size-xs);">{{ formatDate(profile.created_at) }}</td>
                    <td>
                      <div class="flex gap-4">
                        <template v-if="profile.id !== user?.id">
                          <button @click="handleViewProfile(profile.id)" class="nav-icon-btn" title="view"><Icon icon="mdi:eye" width="14" /></button>
                          <button v-if="!profile.banned" @click="handleBanUser(profile.id, profile.nickname)" class="nav-icon-btn" title="ban"><Icon icon="mdi:cancel" width="14" /></button>
                          <button v-if="profile.banned" @click="handleUnbanUser(profile.id, profile.nickname)" class="nav-icon-btn" title="unban"><Icon icon="mdi:check-circle" width="14" style="color:var(--color-green);" /></button>
                          <button @click="handleDeleteUser(profile.id, profile.nickname)" class="nav-icon-btn" title="delete" style="color:#ff5f57;"><Icon icon="mdi:delete" width="14" /></button>
                        </template>
                        <span v-else class="text-faint" style="font-size:var(--font-size-xs);">self</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Posts -->
          <div v-if="activeTab === 'posts'" class="term-block">
            <div class="term-bar" style="justify-content:space-between;">
              <div class="flex items-center gap-8">
                <span class="term-dot"></span><span class="term-dot"></span><span class="term-dot"></span>
                <span style="opacity:0.5;">posts — {{ filteredPosts.length }}</span>
              </div>
              <div class="flex gap-8">
                <select v-model="postFilter" class="term-search" style="width:auto;cursor:pointer;">
                  <option value="all">all</option>
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                </select>
                <input v-model="postSearch" type="text" placeholder="search..." class="term-search" />
              </div>
            </div>
            <div class="term-body" style="padding:0;">
              <table class="term-table">
                <thead>
                  <tr>
                    <th>title</th>
                    <th>author</th>
                    <th>status</th>
                    <th>date</th>
                    <th>actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="post in filteredPosts" :key="post.id">
                    <td style="max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ post.title }}</td>
                    <td><span class="text-faint" style="font-size:var(--font-size-xs);">{{ post.author_id?.substring(0, 8) }}..</span></td>
                    <td>
                      <span :class="['badge-geek', post.published ? 'green' : '']">
                        {{ post.published ? 'published' : 'draft' }}
                      </span>
                    </td>
                    <td class="text-faint" style="font-size:var(--font-size-xs);">{{ formatDate(post.created_at) }}</td>
                    <td>
                      <div class="flex gap-4">
                        <template v-if="post.author_id !== user?.id">
                          <button @click="handleEditPost(post.id)" class="nav-icon-btn" title="edit"><Icon icon="mdi:pencil" width="14" /></button>
                          <button @click="handleDeletePost(post.id, post.title)" class="nav-icon-btn" title="delete" style="color:#ff5f57;"><Icon icon="mdi:delete" width="14" /></button>
                        </template>
                        <span v-else class="text-faint" style="font-size:var(--font-size-xs);">self</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Comments -->
          <div v-if="activeTab === 'comments'" class="term-block">
            <div class="term-bar" style="justify-content:space-between;">
              <div class="flex items-center gap-8">
                <span class="term-dot"></span><span class="term-dot"></span><span class="term-dot"></span>
                <span style="opacity:0.5;">comments — {{ filteredComments.length }}</span>
              </div>
              <input v-model="commentSearch" type="text" placeholder="search..." class="term-search" />
            </div>
            <div class="term-body" style="padding:0;">
              <table class="term-table">
                <thead>
                  <tr>
                    <th>content</th>
                    <th>user</th>
                    <th>post</th>
                    <th>date</th>
                    <th>actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="comment in filteredComments" :key="comment.id">
                    <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ truncateText(comment.content, 50) }}</td>
                    <td><span class="text-faint" style="font-size:var(--font-size-xs);">{{ comment.user_id?.substring(0, 8) }}..</span></td>
                    <td class="text-faint" style="font-size:var(--font-size-xs);">{{ comment.post_slug }}</td>
                    <td class="text-faint" style="font-size:var(--font-size-xs);">{{ formatDate(comment.created_at) }}</td>
                    <td>
                      <div class="flex gap-4">
                        <template v-if="comment.user_id !== user?.id">
                          <button @click="handleDeleteComment(comment.id)" class="nav-icon-btn" title="delete" style="color:#ff5f57;"><Icon icon="mdi:delete" width="14" /></button>
                        </template>
                        <span v-else class="text-faint" style="font-size:var(--font-size-xs);">self</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'
import { useTypewriter } from '@/composables/useTypewriter'

const router = useRouter()
const { user, loading: authLoading } = useAuth()
const { display, cursor, done } = useTypewriter('管理员面板 / Admin Panel', 50)

const tabs = [
  { key: 'users', label: 'users', icon: 'mdi:account-group' },
  { key: 'posts', label: 'posts', icon: 'mdi:text-box-outline' },
  { key: 'comments', label: 'comments', icon: 'mdi:comment' },
]

const isAdmin = ref(false)
const adminChecked = ref(false)

async function checkAdmin() {
  if (!user.value) { adminChecked.value = true; return }
  const { data, error } = await supabase.rpc('fn_is_admin')
  if (error || !data) {
    isAdmin.value = false
  } else {
    isAdmin.value = true
  }
  adminChecked.value = true
}

const activeTab = ref('users')
const loading = ref(true)

const stats = ref({ totalUsers: 0, totalPosts: 0, totalComments: 0 })
const users = ref<any[]>([])
const userSearch = ref('')
const posts = ref<any[]>([])
const postSearch = ref('')
const postFilter = ref('all')
const comments = ref<any[]>([])
const commentSearch = ref('')

const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value
  const q = userSearch.value.toLowerCase()
  return users.value.filter(u => u.id?.toLowerCase().includes(q) || u.nickname?.toLowerCase().includes(q))
})

const filteredPosts = computed(() => {
  let r = posts.value
  if (postFilter.value === 'published') r = r.filter(p => p.published)
  else if (postFilter.value === 'draft') r = r.filter(p => !p.published)
  if (postSearch.value) {
    const q = postSearch.value.toLowerCase()
    r = r.filter(p => p.title?.toLowerCase().includes(q))
  }
  return r
})

const filteredComments = computed(() => {
  if (!commentSearch.value) return comments.value
  const q = commentSearch.value.toLowerCase()
  return comments.value.filter(c => c.content?.toLowerCase().includes(q) || c.post_slug?.toLowerCase().includes(q))
})

onMounted(async () => {
  if (authLoading.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(authLoading, (v) => { if (!v) { stop(); resolve() } }, { immediate: false })
      setTimeout(() => { stop(); resolve() }, 5000)
    })
  }
  await checkAdmin()
  if (!isAdmin.value) { loading.value = false; return }
  await loadData()
})

async function loadData() {
  loading.value = true
  try { await Promise.all([loadStats(), loadUsers(), loadPosts(), loadComments()]) } catch (_) {}
  finally { loading.value = false }
}

async function loadStats() {
  const [uc, pc, cc] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('user_posts').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }),
  ])
  stats.value = { totalUsers: uc.count || 0, totalPosts: pc.count || 0, totalComments: cc.count || 0 }
}

async function loadUsers() {
  const { data } = await supabase.from('profiles').select('id, nickname, created_at, banned').order('created_at', { ascending: false })
  if (data) users.value = data
}

async function loadPosts() {
  const { data } = await supabase.from('user_posts').select('*').order('created_at', { ascending: false })
  if (data) posts.value = data
}

async function loadComments() {
  const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(100)
  if (data) comments.value = data
}

function handleViewProfile(userId: string) { window.open(`/user/${userId}`, '_blank') }

async function handleDeleteUser(userId: string, nickname: string) {
  if (!confirm(`Delete user "${nickname || userId}"? This cannot be undone.`)) return
  try {
    const { data, error } = await supabase.functions.invoke('delete-user', { body: { userId } })
    if (error || !data.success) throw new Error(error?.message || data.error)
    users.value = users.value.filter(u => u.id !== userId)
    stats.value.totalUsers--
  } catch (err: any) { alert('Delete failed: ' + (err.message || 'unknown')) }
}

async function handleBanUser(userId: string, nickname: string) {
  if (!confirm(`Ban user "${nickname || userId}"?`)) return
  const { error } = await supabase.from('profiles').update({ banned: true }).eq('id', userId)
  if (!error) { const u = users.value.find(u => u.id === userId); if (u) u.banned = true }
  else alert('Ban failed: ' + error.message)
}

async function handleUnbanUser(userId: string, nickname: string) {
  if (!confirm(`Unban user "${nickname || userId}"?`)) return
  const { error } = await supabase.from('profiles').update({ banned: false }).eq('id', userId)
  if (!error) { const u = users.value.find(u => u.id === userId); if (u) u.banned = false }
  else alert('Unban failed: ' + error.message)
}

function handleEditPost(postId: string) { router.push(`/blog/edit/${postId}`) }

async function handleDeletePost(postId: string, title: string) {
  if (!confirm(`Delete post "${title}"?`)) return
  const { error } = await supabase.from('user_posts').delete().eq('id', postId)
  if (!error) { posts.value = posts.value.filter(p => p.id !== postId); stats.value.totalPosts-- }
  else alert('Delete failed: ' + error.message)
}

async function handleDeleteComment(commentId: string) {
  if (!confirm('Delete this comment?')) return
  const { error } = await supabase.from('comments').delete().eq('id', commentId)
  if (!error) { comments.value = comments.value.filter(c => c.id !== commentId); stats.value.totalComments-- }
  else alert('Delete failed: ' + error.message)
}

function formatDate(dateString: string) { return new Date(dateString).toLocaleDateString('zh-CN') }
function truncateText(text: string, maxLength: number) {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
</script>

<style scoped>
.tab-btn-term {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 1px solid transparent;
  margin-bottom: -1px;
  color: var(--color-text-dim);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all 0.25s var(--ease-out-expo);
}
.tab-btn-term:hover { color: var(--color-white); }
.tab-btn-term.active {
  color: var(--color-white);
  border-bottom-color: var(--color-white);
}

.term-search {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  width: 180px;
  outline: none;
}
.term-search:focus { border-color: rgba(255,255,255,0.2); }
.term-search::placeholder { color: var(--color-text-faint); }

.term-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-xs);
}
.term-table th {
  text-align: left;
  padding: 12px 16px;
  color: var(--color-text-dim);
  font-weight: 400;
  border-bottom: 1px solid var(--color-border);
  background: rgba(255,255,255,0.02);
}
.term-table td {
  padding: 10px 16px;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
}
.term-table tbody tr:hover { background: rgba(255,255,255,0.02); }
.term-table tbody tr:last-child td { border-bottom: none; }

select.term-search option { background: #000; color: var(--color-text); }
</style>
