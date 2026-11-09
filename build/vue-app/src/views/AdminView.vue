<template>
  <div>
    <div v-if="!session" class="auth-wrap">
      <div class="auth-card">
        <div class="term-block">
          <div class="term-bar">
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span>admin@snishaper &mdash; auth</span>
          </div>
          <div class="term-body">
            <div class="auth-line">admin login</div>
            <div class="auth-title">后台管理 · 身份验证</div>
            <div class="auth-sub">请先验证管理员邮箱与密码，验证通过后进入后台。</div>
            <label for="email">邮箱 / EMAIL</label>
            <input id="email" v-model.trim="email" type="email" autocomplete="username" @keyup.enter="login" />
            <label for="password">密码 / PASSWORD</label>
            <input id="password" v-model="password" type="password" autocomplete="current-password" @keyup.enter="login" />
            <div class="auth-actions">
              <button class="btn-geek primary" :disabled="loginBusy" @click="login">
                {{ loginBusy ? '验证中...' : '[登录]' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <section class="page-head">
        <div class="tag-pill">admin / console</div>
        <h1>后台管理</h1>
        <div class="subtitle">公告管理与站点数据管理。</div>
      </section>

      <div class="tabs">
        <button v-for="t in tabs" :key="t.key" class="tab-btn" :class="{ on: tab === t.key }" @click="switchTab(t.key)">
          {{ t.label }}
        </button>
        <span class="spacer"></span>
        <button class="btn-geek small" @click="logout">[登出]</button>
      </div>

      <section v-if="tab === 'stats'" class="stats-grid">
        <div v-for="s in statItems" :key="s.label" class="stat-card">
          <div class="stat-num">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </section>

      <section v-else-if="tab === 'notices'" class="grid">
        <div class="card-geek">
          <div class="panel-head">
            <h2>{{ editing ? '编辑公告' : '新建公告' }}</h2>
            <div class="status">{{ noticeStatus }}</div>
          </div>
          <label>标题（中文，必填）</label>
          <input v-model="form.title" placeholder="例如：1.30.0 版本发布" />
          <label>标题（English）</label>
          <input v-model="form.title_en" />
          <label>标题（Русский）</label>
          <input v-model="form.title_ru" />
          <label>正文（中文，必填）</label>
          <textarea v-model="form.body" rows="4"></textarea>
          <label>正文（English）</label>
          <textarea v-model="form.body_en" rows="3"></textarea>
          <label>正文（Русский）</label>
          <textarea v-model="form.body_ru" rows="3"></textarea>
          <div class="row">
            <div>
              <label>级别</label>
              <select v-model="form.level">
                <option value="info">info 普通</option>
                <option value="important">important 重要</option>
                <option value="critical">critical 紧急</option>
              </select>
            </div>
            <div>
              <label>置顶</label>
              <select v-model="form.pinned">
                <option :value="false">否</option>
                <option :value="true">是</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div>
              <label>发布时间</label>
              <input v-model="form.published_at" type="datetime-local" />
            </div>
            <div>
              <label>过期时间（可空）</label>
              <input v-model="form.expires_at" type="datetime-local" />
            </div>
          </div>
          <div class="row">
            <div>
              <label>外链（可空）</label>
              <input v-model="form.link" placeholder="https://" />
            </div>
            <div>
              <label>外链文字</label>
              <input v-model="form.link_text" placeholder="查看详情" />
            </div>
          </div>
          <div class="actions">
            <button class="btn-geek primary" @click="submitNotice">{{ editing ? '保存修改' : '发布' }}</button>
            <button class="btn-geek" @click="resetNoticeForm">清空表单</button>
          </div>
        </div>

        <div class="card-geek">
          <div class="panel-head">
            <h2>全部公告</h2>
            <button class="btn-geek small" @click="loadNotices">[刷新]</button>
          </div>
          <div class="status">{{ noticeListStatus }}</div>
          <div class="list">
            <div v-if="!notices.length" class="empty">还没有公告</div>
            <div v-for="n in notices" :key="n.id" class="item" :class="n.level">
              <div class="item-top">
                <div class="item-title">{{ n.title || '(无标题)' }}</div>
                <div class="item-meta">{{ formatTime(n.published_at) }}</div>
              </div>
              <div class="item-body">{{ n.body }}</div>
              <div class="item-foot">
                <span class="badge-geek" :class="n.level === 'critical' ? 'red' : n.level === 'important' ? 'yellow' : 'blue'">{{ n.level }}</span>
                <span v-if="n.pinned" class="badge-geek green">置顶</span>
                <span class="spacer"></span>
                <button class="btn-geek small" @click="editNotice(n)">[编辑]</button>
                <button class="btn-geek small danger" @click="removeNotice(n)">[删除]</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="tab === 'users'" class="card-geek">
        <div class="panel-head">
          <h2>用户管理</h2>
          <button class="btn-geek small" @click="loadUsers">[刷新]</button>
        </div>
        <div class="list">
          <div v-if="!users.length" class="empty">暂无用户</div>
          <div v-for="u in users" :key="u.id" class="item">
            <div class="item-top">
              <div class="item-title">{{ u.nickname }} <span class="text-dim">{{ u.email }}</span></div>
              <div class="item-meta">{{ formatTime(u.createdAt) }}</div>
            </div>
            <div class="item-foot">
              <span v-if="u.banned" class="badge-geek red">已封禁</span>
              <span v-for="p in (u.oauthProviders || [])" :key="p" class="badge-geek blue">{{ p }}</span>
              <span v-if="!u.hasPassword" class="badge-geek yellow">仅第三方登录</span>
              <span class="spacer"></span>
              <button class="btn-geek small" @click="toggleBan(u)">{{ u.banned ? '[解封]' : '[封禁]' }}</button>
              <button class="btn-geek small danger" @click="removeUser(u)">[删除]</button>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="tab === 'posts'" class="card-geek">
        <div class="panel-head">
          <h2>文章管理</h2>
          <button class="btn-geek small" @click="loadPosts">[刷新]</button>
        </div>
        <div class="list">
          <div v-if="!posts.length" class="empty">暂无文章</div>
          <div v-for="p in posts" :key="p.id" class="item">
            <div class="item-top">
              <div class="item-title">{{ p.title }}</div>
              <div class="item-meta">{{ formatTime(p.createdAt) }}</div>
            </div>
            <div class="item-foot">
              <span class="badge-geek">{{ p.category || '未分类' }}</span>
              <span class="badge-geek">{{ p.author }}</span>
              <span class="badge-geek">阅读 {{ p.views }}</span>
              <span v-if="!p.published" class="badge-geek yellow">未发布</span>
              <span class="spacer"></span>
              <a class="btn-geek small" :href="`/blog/${p.slug}`" target="_blank">[查看]</a>
              <button class="btn-geek small danger" @click="removePost(p)">[删除]</button>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="tab === 'comments'" class="card-geek">
        <div class="panel-head">
          <h2>评论管理</h2>
          <button class="btn-geek small" @click="loadComments">[刷新]</button>
        </div>
        <div class="list">
          <div v-if="!comments.length" class="empty">暂无评论</div>
          <div v-for="c in comments" :key="c.id" class="item">
            <div class="item-top">
              <div class="item-title">{{ c.author }} <span class="text-dim">on /{{ c.postSlug }}</span></div>
              <div class="item-meta">{{ formatTime(c.createdAt) }}</div>
            </div>
            <div class="item-body">{{ c.content }}</div>
            <div class="item-foot">
              <span class="spacer"></span>
              <button class="btn-geek small danger" @click="removeComment(c)">[删除]</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="toastMsg" class="toast" :class="toastKind">{{ toastMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const SESSION_KEY = 'snishaper_notice_session'

const email = ref('')
const password = ref('')
const loginBusy = ref(false)
const session = ref<{ token: string; expires_at?: string } | null>(loadSession())

const tab = ref<'notices' | 'users' | 'posts' | 'comments' | 'stats'>('notices')
const tabs = [
  { key: 'notices', label: '公告管理' },
  { key: 'users', label: '用户' },
  { key: 'posts', label: '文章' },
  { key: 'comments', label: '评论' },
  { key: 'stats', label: '统计' },
] as const

const toastMsg = ref('')
const toastKind = ref<'ok' | 'err'>('ok')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function toast(message: string, kind: 'ok' | 'err' = 'ok') {
  toastMsg.value = message
  toastKind.value = kind
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 3200)
}

function loadSession(): { token: string; expires_at?: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    if (!s || !s.token) return null
    if (s.expires_at && new Date(s.expires_at).getTime() <= Date.now()) return null
    return s
  } catch {
    return null
  }
}

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...extra }
  if (session.value?.token) headers.Authorization = 'Bearer ' + session.value.token
  return headers
}

async function call(path: string, init: RequestInit = {}) {
  const res = await fetch(path, init)
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    session.value = null
    localStorage.removeItem(SESSION_KEY)
    toast('登录已过期，请重新验证', 'err')
    throw new Error('unauthorized')
  }
  if (!res.ok || data.ok === false) throw new Error(data.error || 'HTTP ' + res.status)
  return data
}

function formatTime(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('zh-CN', { hour12: false })
}

function toLocalInput(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toISO(value: string) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

async function login() {
  if (!email.value || !password.value) {
    toast('请输入邮箱与密码', 'err')
    return
  }
  loginBusy.value = true
  try {
    const res = await fetch('/api/notices/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const data = await res.json()
    if (!res.ok || !data.ok) {
      if (res.status === 429) toast(`尝试次数过多，请 ${data.retry_after || 60} 秒后再试`, 'err')
      else if (res.status === 503) toast('管理端未配置凭据', 'err')
      else toast('邮箱或密码错误', 'err')
      return
    }
    session.value = { token: data.token, expires_at: data.expires_at }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session.value))
    password.value = ''
    toast('验证通过', 'ok')
    switchTab('notices')
  } catch (e) {
    toast('登录失败：' + (e instanceof Error ? e.message : ''), 'err')
  } finally {
    loginBusy.value = false
  }
}

function logout() {
  session.value = null
  localStorage.removeItem(SESSION_KEY)
  toast('已登出', 'ok')
}

const notices = ref<any[]>([])
const noticeStatus = ref('')
const noticeListStatus = ref('')
const editing = ref<string | null>(null)

const emptyForm = () => ({
  title: '', title_en: '', title_ru: '', body: '', body_en: '', body_ru: '',
  level: 'info', pinned: false, published_at: toLocalInput(new Date().toISOString()),
  expires_at: '', link: '', link_text: '',
})
const form = ref(emptyForm())

async function loadNotices() {
  noticeListStatus.value = '加载中…'
  try {
    const data = await call('/api/notices?all=1&fresh=1')
    notices.value = data.notices || []
    noticeListStatus.value = `共 ${notices.value.length} 条 · 版本 v${data.version}`
  } catch (e) {
    noticeListStatus.value = '加载失败：' + (e instanceof Error ? e.message : '')
  }
}

function editNotice(n: any) {
  editing.value = n.id
  form.value = {
    title: n.title || '', title_en: n.title_en || '', title_ru: n.title_ru || '',
    body: n.body || '', body_en: n.body_en || '', body_ru: n.body_ru || '',
    level: n.level || 'info', pinned: !!n.pinned,
    published_at: toLocalInput(n.published_at || new Date().toISOString()),
    expires_at: toLocalInput(n.expires_at || ''), link: n.link || '', link_text: n.link_text || '',
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetNoticeForm() {
  editing.value = null
  form.value = emptyForm()
}

async function submitNotice() {
  const f = form.value
  if (!f.title || !f.body) {
    toast('标题与正文必填', 'err')
    return
  }
  const payload = {
    title: f.title, title_en: f.title_en, title_ru: f.title_ru,
    body: f.body, body_en: f.body_en, body_ru: f.body_ru,
    level: f.level, pinned: f.pinned,
    published_at: toISO(f.published_at) || new Date().toISOString(),
    expires_at: toISO(f.expires_at),
    link: f.link, link_text: f.link_text,
  }
  try {
    const isEdit = Boolean(editing.value)
    await call(isEdit ? '/api/notices/' + encodeURIComponent(editing.value!) : '/api/notices', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    toast(isEdit ? '已保存' : '已发布', 'ok')
    resetNoticeForm()
    await loadNotices()
  } catch (e) {
    toast('提交失败：' + (e instanceof Error ? e.message : ''), 'err')
  }
}

async function removeNotice(n: any) {
  if (!confirm(`删除公告「${n.title || n.id}」？`)) return
  try {
    await call('/api/notices/' + encodeURIComponent(n.id), { method: 'DELETE', headers: authHeaders() })
    toast('已删除', 'ok')
    if (editing.value === n.id) resetNoticeForm()
    await loadNotices()
  } catch (e) {
    toast('删除失败：' + (e instanceof Error ? e.message : ''), 'err')
  }
}

const users = ref<any[]>([])
async function loadUsers() {
  try {
    const data = await call('/api/admin/users', { headers: authHeaders() })
    users.value = data.users || []
  } catch (e) {
    toast('加载失败：' + (e instanceof Error ? e.message : ''), 'err')
  }
}

async function toggleBan(u: any) {
  try {
    await call(`/api/admin/users/${u.id}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ action: u.banned ? 'unban' : 'ban' }),
    })
    toast(u.banned ? '已解封' : '已封禁', 'ok')
    await loadUsers()
  } catch (e) {
    toast('操作失败：' + (e instanceof Error ? e.message : ''), 'err')
  }
}

async function removeUser(u: any) {
  if (!confirm(`删除用户「${u.nickname}」及其全部内容？`)) return
  try {
    await call(`/api/admin/users/${u.id}`, { method: 'DELETE', headers: authHeaders() })
    toast('已删除', 'ok')
    await loadUsers()
  } catch (e) {
    toast('删除失败：' + (e instanceof Error ? e.message : ''), 'err')
  }
}

const posts = ref<any[]>([])
async function loadPosts() {
  try {
    const data = await call('/api/admin/posts', { headers: authHeaders() })
    posts.value = data.posts || []
  } catch (e) {
    toast('加载失败：' + (e instanceof Error ? e.message : ''), 'err')
  }
}

async function removePost(p: any) {
  if (!confirm(`删除文章「${p.title}」？`)) return
  try {
    await call(`/api/admin/posts/${p.id}`, { method: 'DELETE', headers: authHeaders() })
    toast('已删除', 'ok')
    await loadPosts()
  } catch (e) {
    toast('删除失败：' + (e instanceof Error ? e.message : ''), 'err')
  }
}

const comments = ref<any[]>([])
async function loadComments() {
  try {
    const data = await call('/api/admin/comments', { headers: authHeaders() })
    comments.value = data.comments || []
  } catch (e) {
    toast('加载失败：' + (e instanceof Error ? e.message : ''), 'err')
  }
}

async function removeComment(c: any) {
  if (!confirm('删除这条评论？')) return
  try {
    await call(`/api/admin/comments/${c.id}`, { method: 'DELETE', headers: authHeaders() })
    toast('已删除', 'ok')
    await loadComments()
  } catch (e) {
    toast('删除失败：' + (e instanceof Error ? e.message : ''), 'err')
  }
}

const stats = ref<Record<string, number>>({})
const statItems = computed(() => [
  { label: '用户', value: stats.value.users ?? '—' },
  { label: '文章', value: stats.value.posts ?? '—' },
  { label: '已发布文章', value: stats.value.publishedPosts ?? '—' },
  { label: '评论', value: stats.value.comments ?? '—' },
  { label: '收藏', value: stats.value.favorites ?? '—' },
  { label: '测评记录', value: stats.value.history ?? '—' },
])

async function loadStats() {
  try {
    const data = await call('/api/admin/stats', { headers: authHeaders() })
    stats.value = data.stats || {}
  } catch (e) {
    toast('加载失败：' + (e instanceof Error ? e.message : ''), 'err')
  }
}

function switchTab(key: typeof tab.value) {
  tab.value = key
  if (key === 'notices') loadNotices()
  else if (key === 'users') loadUsers()
  else if (key === 'posts') loadPosts()
  else if (key === 'comments') loadComments()
  else if (key === 'stats') loadStats()
}

if (session.value) loadNotices()
</script>

<style scoped>
.auth-wrap {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.auth-card {
  width: 100%;
  max-width: 460px;
}

.auth-line {
  color: var(--color-green);
  font-size: var(--font-size-xs);
  margin-bottom: 14px;
}

.auth-line::before {
  content: '$ ';
}

.auth-title {
  font-size: var(--font-size-lg);
  font-weight: 400;
  color: var(--color-white);
  margin-bottom: 6px;
}

.auth-sub {
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
  margin-bottom: 8px;
}

.auth-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  letter-spacing: 0.06em;
  margin: 16px 0 7px;
}

input,
textarea,
select {
  width: 100%;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  outline: none;
}

input:focus,
textarea:focus,
select:focus {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
}

textarea {
  resize: vertical;
  min-height: 96px;
  line-height: 1.7;
}

select option {
  background: var(--color-bg);
  color: var(--color-text);
}

.tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.tab-btn {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 6px 18px;
  cursor: pointer;
  letter-spacing: 0.06em;
}

.tab-btn.on {
  color: var(--color-white);
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.06);
}

.spacer {
  flex: 1;
}

.grid {
  display: grid;
  grid-template-columns: minmax(340px, 0.85fr) 1.15fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.row {
  display: flex;
  gap: 14px;
}

.row > div {
  flex: 1;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.panel-head h2 {
  font-size: var(--font-size-sm);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--color-white);
  text-transform: uppercase;
}

.status {
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  max-height: 66vh;
  overflow-y: auto;
}

.item {
  border: 1px solid var(--color-border);
  border-left: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.015);
}

.item.critical {
  border-left-color: rgba(255, 95, 87, 0.7);
}

.item.important {
  border-left-color: rgba(240, 200, 100, 0.7);
}

.item.info {
  border-left-color: rgba(100, 180, 240, 0.7);
}

.item-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
}

.item-title {
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--color-white);
}

.item-meta {
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
  white-space: nowrap;
}

.item-body {
  color: var(--color-text-dim);
  font-size: var(--font-size-xs);
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-foot {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.empty {
  color: var(--color-text-faint);
  font-size: var(--font-size-xs);
  padding: 36px 0;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
}

.stat-num {
  font-family: var(--font-mono);
  font-size: var(--font-size-xl);
  color: var(--color-white);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  margin-top: 6px;
  letter-spacing: 0.08em;
}

.badge-geek {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  padding: 2px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-dim);
  letter-spacing: 0.04em;
}

.badge-geek.green {
  border-color: rgba(120, 220, 160, 0.2);
  color: var(--color-green);
}

.badge-geek.yellow {
  border-color: rgba(240, 200, 100, 0.2);
  color: var(--color-yellow);
}

.badge-geek.red {
  border-color: rgba(255, 95, 87, 0.2);
  color: var(--color-red);
}

.badge-geek.blue {
  border-color: rgba(100, 180, 240, 0.2);
  color: var(--color-blue);
}

.text-dim {
  color: var(--color-text-dim);
  font-weight: 400;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  background: rgba(10, 10, 10, 0.96);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px 20px;
  font-size: var(--font-size-xs);
  z-index: 50;
}

.toast.ok {
  border-color: rgba(120, 220, 160, 0.35);
  color: var(--color-green);
}

.toast.err {
  border-color: rgba(255, 95, 87, 0.35);
  color: var(--color-red);
}
</style>
