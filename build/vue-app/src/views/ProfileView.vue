<template>
  <div class="profile-page">
    <div class="container">
      <div v-if="loading" class="loading-container">
        <div class="skeleton" style="width:200px;height:200px;margin:0 auto;"></div>
        <p>加载中...</p>
      </div>

      <template v-else-if="profile">
        <!-- 用户信息头 -->
        <div class="profile-header-card">
          <div class="profile-header">
            <div class="user-avatar" :class="{ owner: isOwnProfile }" @click="isOwnProfile && fileInput.click()">
              <img v-if="profile.avatar_url" :src="profile.avatar_url" alt="" class="avatar-img" />
              <Icon v-else icon="mdi:account-circle" width="80" />
              <div v-if="isOwnProfile" class="avatar-overlay"><Icon icon="mdi:camera" /><span>更换</span></div>
            </div>
            <input ref="fileInput" type="file" accept="image/*" @change="handleAvatarUpload" hidden />
            <div class="user-meta">
              <h1>{{ profile.nickname || '未设置昵称' }}</h1>
              <div class="user-stats-row">
                <span><Icon icon="mdi:calendar" /> {{ formatDate(profile.created_at) }} 加入</span>
                <span><Icon icon="mdi:test-tube" /> {{ testCount }} 次测评</span>
                <span><Icon icon="mdi:post" /> {{ postCount }} 篇文章</span>
              </div>
            </div>
            <div class="header-actions">
              <button v-if="isOwnProfile" class="btn-geek" @click="showEdit = true" style="font-size:var(--font-size-xs);">编辑资料</button>
            </div>
          </div>
        </div>

        <!-- Tab 导航 -->
        <div class="tab-bar">
          <button v-for="t in tabs" :key="t.key" class="tab-btn" :class="{ active: tab === t.key }" @click="tab = t.key">
            <Icon :icon="t.icon" /> {{ t.label }}
          </button>
        </div>

        <!-- ========== 模块一：测评指挥中心 ========== -->
        <div v-if="tab === 'tests'" class="module-section">
          <div class="section-title"><Icon icon="mdi:rocket-launch" /> 快速开始</div>
          <div class="quick-grid">
            <button class="quick-card" @click="resumeLastTest">
              <Icon icon="mdi:play-circle" width="32" />
              <div>
                <div class="quick-card-title">继续上次测评</div>
                <div class="quick-card-desc">{{ lastTest ? lastTest.test_title + ' · 未完成' : '暂无未完成测评' }}</div>
              </div>
            </button>
            <button class="quick-card" @click="randomTest">
              <Icon icon="mdi:dice-3" width="32" />
              <div>
                <div class="quick-card-title">今日推荐</div>
                <div class="quick-card-desc">{{ randomTestName }}</div>
              </div>
            </button>
          </div>

          <div class="section-title" style="margin-top:28px;"><Icon icon="mdi:history" /> 历史档案</div>
          <div class="filter-row">
            <select v-model="testFilter" class="term-input" style="width:auto;">
              <option value="">全部类型</option>
              <option v-for="t in testTypes" :key="t.id" :value="t.id">{{ t.label }}</option>
            </select>
          </div>
          <div v-if="filteredTests.length" class="test-list">
            <div v-for="(r, i) in filteredTests" :key="r.id" class="test-row">
              <div class="test-row-info">
                <span class="test-row-title">{{ r.test_title }}</span>
                <span class="test-row-meta">{{ r.level }} · {{ formatDate(r.completed_at) }}</span>
              </div>
              <div class="test-row-actions">
                <button class="btn-geek" style="font-size:var(--font-size-xs);padding:4px 12px;" @click="compareTest(i)">对比</button>
                <button class="btn-geek" style="font-size:var(--font-size-xs);padding:4px 12px;" @click="retakeTest(r.test_id)">重测</button>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">暂无测评记录</div>

          <!-- 历史对比弹窗 -->
          <div v-if="compareIdx >= 0 && filteredTests[compareIdx]" class="modal-overlay" @click.self="compareIdx = -1">
            <div class="modal-content">
              <div class="modal-header"><h3>历史对比</h3><button class="close-btn" @click="compareIdx = -1"><Icon icon="mdi:close" /></button></div>
              <div class="modal-body">
                <div class="compare-grid">
                  <div v-for="(item, ci) in compareItems" :key="ci" class="compare-card">
                    <div class="compare-date">{{ ci === 0 ? '本次' : formatDate(item.completed_at) }}</div>
                    <div class="compare-score">{{ item.score }}<small>/{{ item.max_score }}</small></div>
                    <div class="compare-level">{{ item.level }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="section-title" style="margin-top:28px;"><Icon icon="mdi:file-export" /> 报告管理</div>
          <div class="action-row">
            <button class="btn-geek" style="font-size:var(--font-size-xs);" @click="exportPDF">导出 PDF</button>
            <button class="btn-geek" style="font-size:var(--font-size-xs);" @click="exportMarkdown">导出 Markdown</button>
            <button class="btn-geek" style="font-size:var(--font-size-xs);" @click="shareAnonymously">匿名分享</button>
          </div>
        </div>

        <!-- ========== 模块二：内容创作工坊 ========== -->
        <div v-if="tab === 'content'" class="module-section">
          <div class="section-title"><Icon icon="mdi:plus-circle" /> 新建</div>
          <div class="action-row">
            <RouterLink to="/blog/new" class="btn-geek" style="font-size:var(--font-size-xs);"><Icon icon="mdi:post" /> 新建文章</RouterLink>
            <RouterLink to="/projects" class="btn-geek" style="font-size:var(--font-size-xs);"><Icon icon="mdi:folder" /> 新建项目</RouterLink>
          </div>

          <div class="section-title" style="margin-top:28px;"><Icon icon="mdi:chart-bar" /> 内容仪表盘</div>
          <div class="dash-grid">
            <div class="dash-card"><div class="dash-num">{{ publishedCount }}</div><div class="dash-label">已发布</div></div>
            <div class="dash-card"><div class="dash-num">{{ draftCount }}</div><div class="dash-label">草稿 <span v-if="draftCount" class="badge-dot"></span></div></div>
            <div class="dash-card"><div class="dash-num">{{ totalViews }}</div><div class="dash-label">总阅读</div></div>
            <div class="dash-card"><div class="dash-num">{{ totalLikes }}</div><div class="dash-label">获赞</div></div>
          </div>

          <div class="section-title" style="margin-top:28px;"><Icon icon="mdi:bookmark" /> 收藏夹管理</div>
          <div class="filter-row">
            <input v-model="favTag" class="term-input" placeholder="筛选标签..." style="width:200px;" />
          </div>
          <div v-if="favorites.length" class="fav-list">
            <div v-for="f in filteredFavs" :key="f.id" class="fav-row">
              <Icon :icon="f.item_icon || 'mdi:bookmark'" width="20" />
              <div class="fav-info">
                <div class="fav-title">{{ f.item_title }}</div>
                <div class="fav-meta">{{ f.item_type === 'test' ? '测评' : '文章' }} · {{ formatDate(f.created_at) }}</div>
              </div>
              <button class="btn-geek" style="font-size:var(--font-size-xs);padding:4px 8px;" @click="removeFav(f.id)">取消收藏</button>
            </div>
          </div>
          <div v-else class="empty-state">暂无收藏</div>
        </div>

        <!-- ========== 模块三：账户与安全堡垒 ========== -->
        <div v-if="tab === 'account'" class="module-section">
          <div class="section-title"><Icon icon="mdi:link-variant" /> 第三方账号绑定</div>
          <div class="social-bind-list">
            <div v-for="p in providers" :key="p.id" class="bind-row">
              <Icon :icon="p.icon" width="24" />
              <span>{{ p.label }}</span>
              <span class="bind-status" :class="{ bound: p.bound }">{{ p.bound ? '已绑定' : '未绑定' }}</span>
              <template v-if="p.bound">
                <button class="btn-geek" style="font-size:var(--font-size-xs);padding:4px 12px;color:#ff5f57;" @click="unbindProvider(p.id)">解绑</button>
              </template>
              <template v-else>
                <button class="btn-geek" style="font-size:var(--font-size-xs);padding:4px 12px;" @click="linkProvider(p.id)">绑定</button>
              </template>
            </div>
          </div>

          <div class="section-title" style="margin-top:28px;"><Icon icon="mdi:devices" /> 登录设备</div>
          <div class="device-list">
            <div v-for="(d, i) in devices" :key="i" class="device-row">
              <Icon icon="mdi:laptop" width="20" />
              <div><div>{{ d.device }}</div><div class="device-meta">{{ d.ip }} · {{ d.time }}</div></div>
              <button class="btn-geek" style="font-size:var(--font-size-xs);padding:4px 12px;color:#ff5f57;margin-left:auto;">踢出</button>
            </div>
          </div>

          <div class="section-title" style="margin-top:28px;"><Icon icon="mdi:shield-lock" /> 隐私开关</div>
          <div class="privacy-row">
            <button class="privacy-btn" :class="{ active: privacyMode === '755' }" @click="privacyMode = '755'">chmod 755 公开</button>
            <button class="privacy-btn" :class="{ active: privacyMode === '700' }" @click="privacyMode = '700'">chmod 700 私密</button>
          </div>

          <div class="section-title" style="margin-top:28px;"><Icon icon="mdi:database-export" /> 数据导出</div>
          <button class="btn-geek" style="font-size:var(--font-size-xs);" @click="exportData">一键导出全部数据 (JSON)</button>
        </div>

        <!-- ========== 模块四：终端控制台 ========== -->
        <div v-if="tab === 'terminal'" class="module-section">
          <div class="term-block" style="margin:0;">
            <div class="term-bar">
              <span class="term-dot"></span><span class="term-dot"></span><span class="term-dot"></span>
              <span style="margin-left:8px;opacity:0.5;">console.sh</span>
            </div>
            <div class="term-body" style="min-height:280px;">
              <div class="term-line">JetCPP Console v1.0</div>
              <div class="term-line" style="color:var(--color-text-dim);">Type 'help' for available commands</div>
              <div v-for="(line, i) in terminalLog" :key="i" class="term-line" :style="line.error ? 'color:#ff5f57;' : ''">{{ line.text }}</div>
              <div class="term-input-line">
                <span class="term-prompt">$&nbsp;</span>
                <input v-model="terminalInput" @keydown.enter="execCommand" class="term-command-input" autofocus placeholder="输入命令..." />
              </div>
            </div>
          </div>
          <div style="margin-top:16px;">
            <button class="btn-geek" style="font-size:var(--font-size-xs);" @click="copyEnvInfo"><Icon icon="mdi:clipboard" /> 复制环境信息</button>
          </div>
        </div>

        <!-- ========== 模块五：成就与任务系统 ========== -->
        <div v-if="tab === 'achievements'" class="module-section">
          <div class="section-title"><Icon icon="mdi:calendar-check" /> 每日打卡</div>
          <div class="checkin-row">
            <div class="checkin-info">
              <span class="checkin-streak">连续 {{ streak }} 天</span>
              <span class="checkin-total">累计 {{ totalCheckins }} 次</span>
            </div>
            <button v-if="!checkedInToday" class="btn-geek" style="font-size:var(--font-size-xs);" @click="doCheckin">签到</button>
            <span v-else class="checked-badge"><Icon icon="mdi:check-circle" /> 已签到</span>
          </div>

          <div class="section-title" style="margin-top:28px;"><Icon icon="mdi:clipboard-list" /> 任务中心</div>
          <div class="task-list">
            <div v-for="(task, i) in tasks" :key="i" class="task-row" :class="{ done: task.done }">
              <Icon :icon="task.done ? 'mdi:check-circle' : 'mdi:circle-outline'" :color="task.done ? 'var(--color-green)' : undefined" />
              <div class="task-info">
                <div class="task-name">{{ task.name }}</div>
                <div class="task-progress">{{ task.progress }}/{{ task.total }}</div>
              </div>
              <span v-if="task.done" class="task-reward">{{ task.reward }}</span>
            </div>
          </div>

          <div class="section-title" style="margin-top:28px;"><Icon icon="mdi:shield-star" /> 徽章墙</div>
          <div class="badge-grid">
            <div v-for="badge in badges" :key="badge.id" class="badge-card" :class="{ locked: !badge.earned }">
              <Icon :icon="badge.icon" width="40" :color="badge.earned ? 'var(--color-green)' : 'var(--color-text-faint)'" />
              <div class="badge-name">{{ badge.name }}</div>
              <div class="badge-desc">{{ badge.earned ? '已获得' : badge.unlock }}</div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="not-found">
        <Icon icon="mdi:account-remove" width="64" />
        <h2>用户不存在</h2>
        <RouterLink to="/" class="btn-geek">返回首页</RouterLink>
      </div>
    </div>

    <!-- 编辑资料模态框 -->
    <div v-if="showEdit" class="modal-overlay" @click.self="showEdit = false">
      <div class="modal-content">
        <div class="modal-header"><h3>编辑资料</h3><button class="close-btn" @click="showEdit = false"><Icon icon="mdi:close" /></button></div>
        <form @submit.prevent="updateProfile" class="modal-body">
          <div class="field">
            <label>昵称</label>
            <input v-model="editForm.nickname" class="term-input" maxlength="20" />
          </div>
          <div class="field">
            <label>性别</label>
            <select v-model="editForm.gender" class="term-input">
              <option value="">未设置</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-geek" style="font-size:var(--font-size-xs);" @click="showEdit = false">取消</button>
            <button type="submit" class="btn-geek" style="font-size:var(--font-size-xs);" :disabled="saving">{{ saving ? '保存中...' : '保存' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'
import { testConfigs } from '@/data/tests'

const route = useRoute()
const router = useRouter()
const { user: currentUser } = useAuth()
const userId = computed(() => route.params.userId as string)
const isOwnProfile = computed(() => currentUser.value?.id === userId.value)

// ---- 状态 ----
const profile = ref<any>(null)
const loading = ref(true)
const showEdit = ref(false)
const saving = ref(false)
const editForm = ref({ nickname: '', gender: '' })
const fileInput = ref<HTMLInputElement>()

const tab = ref('tests')
const tabs = [
  { key: 'tests', icon: 'mdi:test-tube', label: '测评指挥中心' },
  { key: 'content', icon: 'mdi:pencil', label: '内容创作' },
  { key: 'account', icon: 'mdi:shield-account', label: '账户安全' },
  { key: 'terminal', icon: 'mdi:console', label: '终端' },
  { key: 'achievements', icon: 'mdi:trophy', label: '成就' },
]

// ---- 测评模块 ----
const testHistory = ref<any[]>([])
const testFilter = ref('')
const compareIdx = ref(-1)

const testTypes = Object.entries(testConfigs).map(([id, c]) => ({ id, label: c.title }))

const filteredTests = computed(() =>
  testHistory.value.filter(r => !testFilter.value || r.test_id === testFilter.value)
)

const compareItems = computed(() => {
  if (compareIdx.value < 0) return []
  const current = filteredTests.value[compareIdx.value]
  if (!current) return []
  const sameType = testHistory.value.filter(r => r.test_id === current.test_id)
  const idx = sameType.findIndex(r => r.id === current.id)
  const items = []
  if (idx > 0) items.push(sameType[idx - 1])
  items.push(current)
  return items
})

const lastTest = computed(() => testHistory.value[0] || null)
const randomTestName = computed(() => {
  const keys = Object.keys(testConfigs)
  return testConfigs[keys[Math.floor(Math.random() * keys.length)]]?.title || ''
})

const testCount = computed(() => testHistory.value.length)
const publishedCount = ref(0)
const draftCount = ref(0)
const totalViews = ref(0)
const totalLikes = ref(0)
const postCount = computed(() => publishedCount.value + draftCount.value)

function resumeLastTest() {
  if (lastTest.value) router.push(`/tests/${lastTest.value.test_id}`)
}

function randomTest() {
  const keys = Object.keys(testConfigs)
  const id = keys[Math.floor(Math.random() * keys.length)]
  router.push(`/tests/${id}`)
}

function retakeTest(testId: string) {
  router.push(`/tests/${testId}`)
}

function compareTest(i: number) {
  compareIdx.value = i
}

function exportPDF() { alert('PDF 导出功能（可使用浏览器打印 → 另存为 PDF）') }
function exportMarkdown() {
  const rows = filteredTests.value.map(r => `- ${r.test_title} | ${r.level} | ${r.score}/${r.max_score} | ${r.completed_at}`).join('\n')
  const md = `# 测评报告\n\n${rows || '暂无数据'}`
  const blob = new Blob([md], { type: 'text/markdown' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'test-report.md'; a.click()
}
function shareAnonymously() {
  const last = filteredTests.value[0]
  if (!last) { alert('暂无测评数据'); return }
  const text = `匿名测评分享\n测试: ${last.test_title}\n结果: ${last.level}\n得分: ${last.score}/${last.max_score}`
  navigator.clipboard.writeText(text).then(() => alert('分享内容已复制到剪贴板'))
}

// ---- 内容模块 ----
const posts = ref<any[]>([])
const favorites = ref<any[]>([])
const favTag = ref('')

const filteredFavs = computed(() =>
  !favTag.value ? favorites.value : favorites.value.filter(f =>
    f.item_title?.includes(favTag.value) || f.item_description?.includes(favTag.value)
  )
)

async function removeFav(id: string) {
  await supabase.from('user_favorites').delete().eq('id', id)
  favorites.value = favorites.value.filter(f => f.id !== id)
}

// ---- 账户模块 ----
const providers = ref([
  { id: 'google', icon: 'mdi:google', label: 'Google', bound: false },
  { id: 'github', icon: 'mdi:github', label: 'GitHub', bound: false },
  { id: 'azure', icon: 'mdi:microsoft', label: 'Microsoft', bound: false },
])
const privacyMode = ref('755')

const devices = ref<any[]>([])

async function loadLoginLogs() {
  if (!isOwnProfile.value) return
  const { data } = await supabase.rpc('fn_get_my_login_logs')
  if (data) {
    devices.value = data.map((d: any) => ({
      device: d.user_agent?.split('/')[0] || 'Unknown',
      ip: d.ip_address || '-',
      time: new Date(d.logged_in_at).toLocaleString('zh-CN'),
    }))
  }
}

async function linkProvider(id: string) {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
  try {
    const { error } = await supabase.auth.linkIdentity({
      provider: id as 'google' | 'github' | 'azure',
      options: { redirectTo: siteUrl + '/auth/callback' },
    })
    if (error) throw error
  } catch (err: any) {
    alert(`绑定失败：${err.message || '请稍后重试'}`)
  }
}

async function unbindProvider(id: string) {
  if (!confirm(`确定解绑 ${id} 吗？`)) return
  try {
    const { error } = await supabase.auth.unlinkIdentity({ provider: id })
    if (error) throw error
    const p = providers.value.find(x => x.id === id)
    if (p) p.bound = false
  } catch (err: any) {
    alert(`解绑失败：${err.message || '请稍后重试'}`)
  }
}

function exportData() {
  const data = {
    profile: profile.value,
    tests: testHistory.value,
    posts: posts.value,
    favorites: favorites.value,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'user-data.json'; a.click()
}

// ---- 终端模块 ----
const terminalInput = ref('')
const terminalLog = ref<{ text: string; error?: boolean }[]>([])

function execCommand() {
  const cmd = terminalInput.value.trim().toLowerCase()
  terminalLog.value.push({ text: `$ ${cmd}` })
  terminalInput.value = ''

  const parts = cmd.split(/\s+/)
  const main = parts[0]

  if (main === 'help') {
    terminalLog.value.push({ text: '可用命令:\n  run <test_id> - 开始测评\n  blog new - 新建文章\n  stats - 近期趋势\n  tests - 列出测评\n  help - 帮助' })
  } else if (main === 'run' && parts[1]) {
    const tid = parts[1]
    if (testConfigs[tid]) {
      router.push(`/tests/${tid}`)
    } else {
      terminalLog.value.push({ text: `未知测评: ${tid}`, error: true })
    }
  } else if (main === 'blog' && parts[1] === 'new') {
    router.push('/blog/new')
  } else if (main === 'stats') {
    const recent = testHistory.value.slice(0, 7)
    if (recent.length === 0) {
      terminalLog.value.push({ text: '暂无测评数据', error: true })
    } else {
      const bar = recent.map(r => `${r.test_title.slice(0, 12).padEnd(12)} ${'█'.repeat(Math.min(r.score || 0, 20))} ${r.level}`).join('\n')
      terminalLog.value.push({ text: '最近测评趋势:\n' + bar })
    }
  } else if (main === 'tests') {
    const list = Object.entries(testConfigs).map(([id, c]) => `  ${id.padEnd(12)} ${c.title}`).join('\n')
    terminalLog.value.push({ text: `可用测评:\n${list}` })
  } else {
    terminalLog.value.push({ text: `未知命令: ${main}。输入 help 查看可用命令`, error: true })
  }
}

function copyEnvInfo() {
  const info = `User-Agent: ${navigator.userAgent}\nScreen: ${screen.width}x${screen.height}\nTimezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`
  navigator.clipboard.writeText(info).then(() => {
    terminalLog.value.push({ text: '环境信息已复制到剪贴板' })
  })
}

// ---- 成就模块 ----
const streak = ref(0)
const totalCheckins = ref(0)
const checkedInToday = ref(false)

const tasks = ref([
  { name: '完成 3 次测评', progress: 0, total: 3, reward: '+50 分', done: false },
  { name: '发布 1 篇博客', progress: 0, total: 1, reward: '徽章: 创作者', done: false },
  { name: '连续签到 7 天', progress: 0, total: 7, reward: '徽章: 代码行者', done: false },
])

const badges = ref([
  { id: 'walker', name: '代码行者', icon: 'mdi:walk', earn: '连续签到 7 天', earned: false },
  { id: 'knight', name: '心灵骑士', icon: 'mdi:shield-star', earn: '完成 10 次测评', earned: false },
  { id: 'creator', name: '创作者', icon: 'mdi:pencil', earn: '发布 1 篇博客', earned: false },
  { id: 'scholar', name: '学者', icon: 'mdi:book', earn: '阅读 10 篇文章', earned: false },
])

function doCheckin() {
  checkedInToday.value = true
  streak.value++
  totalCheckins.value++
  localStorage.setItem('op_checkin_streak', String(streak.value))
  localStorage.setItem('op_checkin_total', String(totalCheckins.value))
  localStorage.setItem('op_checkin_date', new Date().toDateString())
}

// ---- 数据加载 ----
onMounted(async () => {
  await fetchProfile()
  await Promise.all([fetchTests(), fetchPosts(), fetchFavorites(), loadLoginLogs()])
  updateTasks()
  updateBadges()
})

async function fetchProfile() {
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId.value).single()
    profile.value = data
    editForm.value = { nickname: data?.nickname || '', gender: data?.gender || '' }
  } catch { profile.value = null }
  loading.value = false
}

async function fetchTests() {
  const { data } = await supabase.from('user_test_history').select('*').eq('user_id', userId.value).order('completed_at', { ascending: false })
  testHistory.value = data || []
}

async function fetchPosts() {
  const { data } = await supabase.from('user_posts').select('title, published, views, likes').eq('author_id', userId.value)
  posts.value = data || []
  publishedCount.value = data?.filter(p => p.published).length || 0
  draftCount.value = data?.filter(p => !p.published).length || 0
  totalViews.value = data?.reduce((s, p) => s + (p.views || 0), 0) || 0
  totalLikes.value = data?.reduce((s, p) => s + (p.likes || 0), 0) || 0
}

async function fetchFavorites() {
  const { data } = await supabase.from('user_favorites').select('*').eq('user_id', userId.value).order('created_at', { ascending: false })
  favorites.value = data || []
  // 从 currentUser 的 identities 获取绑定信息
  const identities = (currentUser.value as any)?.identities || []
  for (const p of providers.value) {
    p.bound = identities.some((i: any) => i.provider === p.id)
  }
}

function updateTasks() {
  tasks.value[0].progress = Math.min(testHistory.value.length, 3)
  tasks.value[0].done = testHistory.value.length >= 3
  tasks.value[1].progress = publishedCount.value
  tasks.value[1].done = publishedCount.value >= 1
  const stored = localStorage.getItem('op_checkin_streak')
  if (stored) streak.value = parseInt(stored)
  const storedTotal = localStorage.getItem('op_checkin_total')
  if (storedTotal) totalCheckins.value = parseInt(storedTotal)
  const lastDate = localStorage.getItem('op_checkin_date')
  checkedInToday.value = lastDate === new Date().toDateString()
  tasks.value[2].progress = streak.value
  tasks.value[2].done = streak.value >= 7
}

function updateBadges() {
  badges.value[0].earned = streak.value >= 7
  badges.value[1].earned = testHistory.value.length >= 10
  badges.value[2].earned = publishedCount.value >= 1
  badges.value[3].earned = totalViews.value >= 10
}

// ---- 通用操作 ----
async function updateProfile() {
  saving.value = true
  try {
    await supabase.from('profiles').update({
      nickname: editForm.value.nickname || null,
      gender: editForm.value.gender || null,
      updated_at: new Date().toISOString(),
    }).eq('id', userId.value)
    showEdit.value = false
    await fetchProfile()
  } catch {}
  saving.value = false
}

async function handleAvatarUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type) || file.size > 2 * 1024 * 1024) return
  const ext = file.name.split('.').pop()
  const path = `${userId.value}/${Date.now()}.${ext}`
  await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  await supabase.from('profiles').update({ avatar_url: data.publicUrl, updated_at: new Date().toISOString() }).eq('id', userId.value)
  await fetchProfile()
}

function formatDate(d?: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.profile-page { min-height: calc(100vh - 200px); padding: 2rem 0; }
.loading-container { display:flex;flex-direction:column;align-items:center;gap:1.5rem;padding:4rem 0; }

.profile-header-card {
  background: var(--color-bg-card); border-radius: var(--radius-md); padding: 2rem; margin-bottom: 1.5rem;
}
.profile-header { display: flex; align-items: center; gap: 1.5rem; }
.user-avatar { position: relative; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.05); overflow: hidden; flex-shrink: 0; }
.user-avatar.owner { cursor: pointer; }
.user-avatar.owner:hover .avatar-overlay { opacity: 1; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.avatar-overlay { position: absolute; inset:0; background: rgba(0,0,0,0.6); display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;color:#fff;gap:4px;font-size:var(--font-size-xs); }
.user-meta h1 { margin:0 0 6px; font-size:var(--font-size-lg); }
.user-stats-row { display:flex;gap:16px;font-size:var(--font-size-xs);color:var(--color-text-dim); }
.user-stats-row span { display:flex;align-items:center;gap:4px; }
.header-actions { margin-left: auto; }

/* Tabs */
.tab-bar { display:flex;gap:4px;margin-bottom:1.5rem;flex-wrap:wrap; }
.tab-btn {
  padding: 8px 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); color: var(--color-text-dim); cursor: pointer; font-family: var(--font-mono);
  font-size: var(--font-size-xs); transition: all .2s; display:flex;align-items:center;gap:6px;
}
.tab-btn:hover { color: var(--color-white); border-color: var(--color-border-hover); }
.tab-btn.active { background: rgba(255,255,255,0.08); color: var(--color-white); border-color: var(--color-border-hover); }

/* Module sections */
.module-section { max-width: 700px; }
.section-title { font-size: var(--font-size-xs); color: var(--color-text-dim); margin-bottom: 12px; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid var(--color-border); padding-bottom: 8px; }

/* Quick start */
.quick-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
.quick-card {
  display:flex;align-items:center;gap:12px;padding:16px;background:rgba(255,255,255,0.02);
  border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;transition:all .25s;text-align:left;font-family:var(--font-mono);
}
.quick-card:hover { background:rgba(255,255,255,0.05);border-color:var(--color-border-hover); }
.quick-card-title { font-size:var(--font-size-xs);color:var(--color-white); }
.quick-card-desc { font-size:var(--font-size-xs);color:var(--color-text-dim);margin-top:4px; }

.filter-row { margin-bottom:12px;display:flex;gap:8px; }
.term-input {
  padding:6px 10px;font-family:var(--font-mono);font-size:var(--font-size-xs);
  background:rgba(255,255,255,0.03);border:1px solid var(--color-border);border-radius:var(--radius-sm);
  color:var(--color-white);outline:none;box-sizing:border-box;
}
.term-input:focus { border-color:var(--color-border-hover); }

.test-list { display:flex;flex-direction:column;gap:8px; }
.test-row { display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm); }
.test-row-info { display:flex;flex-direction:column;gap:2px; }
.test-row-title { font-size:var(--font-size-xs);color:var(--color-white); }
.test-row-meta { font-size:var(--font-size-xs);color:var(--color-text-dim); }
.test-row-actions { display:flex;gap:8px; }

.action-row { display:flex;gap:8px;flex-wrap:wrap; }

.compare-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
.compare-card { padding:20px;text-align:center;background:rgba(255,255,255,0.02);border:1px solid var(--color-border);border-radius:var(--radius-sm); }
.compare-date { font-size:var(--font-size-xs);color:var(--color-text-dim);margin-bottom:8px; }
.compare-score { font-size:var(--font-size-lg);color:var(--color-white); }
.compare-score small { font-size:var(--font-size-xs);color:var(--color-text-dim); }
.compare-level { font-size:var(--font-size-xs);color:var(--color-text-dim);margin-top:4px; }

/* Content dashboard */
.dash-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:12px; }
.dash-card { padding:16px;text-align:center;background:rgba(255,255,255,0.02);border:1px solid var(--color-border);border-radius:var(--radius-sm); }
.dash-num { font-size:var(--font-size-lg);color:var(--color-white); }
.dash-label { font-size:var(--font-size-xs);color:var(--color-text-dim);margin-top:4px;display:flex;align-items:center;justify-content:center;gap:4px; }
.badge-dot { width:8px;height:8px;border-radius:50%;background:#ff5f57;display:inline-block; }

.fav-list { display:flex;flex-direction:column;gap:8px; }
.fav-row { display:flex;align-items:center;gap:12px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm); }
.fav-info { flex:1; }
.fav-title { font-size:var(--font-size-xs);color:var(--color-white); }
.fav-meta { font-size:var(--font-size-xs);color:var(--color-text-dim); }

.empty-state { padding:2rem;text-align:center;color:var(--color-text-dim);font-size:var(--font-size-xs); }

/* Account */
.social-bind-list { display:flex;flex-direction:column;gap:8px; }
.bind-row { display:flex;align-items:center;gap:12px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm); }
.bind-status { font-size:var(--font-size-xs);color:var(--color-text-dim);margin-left:auto; }
.bind-status.bound { color:var(--color-green); }

.device-list { display:flex;flex-direction:column;gap:8px; }
.device-row { display:flex;align-items:center;gap:12px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm); }
.device-meta { font-size:var(--font-size-xs);color:var(--color-text-dim); }

.privacy-row { display:flex;gap:8px; }
.privacy-btn { padding:8px 20px;background:rgba(255,255,255,0.03);border:1px solid var(--color-border);border-radius:var(--radius-sm);color:var(--color-text-dim);cursor:pointer;font-family:var(--font-mono);font-size:var(--font-size-xs);transition:all .2s; }
.privacy-btn.active { background:rgba(255,255,255,0.08);border-color:var(--color-border-hover);color:var(--color-white); }

/* Terminal */
.term-input-line { display:flex;align-items:center;margin-top:8px; }
.term-prompt { color:var(--color-green); }
.term-command-input {
  flex:1;background:none;border:none;color:var(--color-white);font-family:var(--font-mono);
  font-size:var(--font-size-xs);outline:none;padding:0;
}
.term-command-input::placeholder { color:var(--color-text-faint); }

/* Achievements */
.checkin-row { display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(255,255,255,0.02);border:1px solid var(--color-border);border-radius:var(--radius-sm); }
.checkin-info { display:flex;gap:16px; }
.checkin-streak { font-size:var(--font-size-xs);color:var(--color-white); }
.checkin-total { font-size:var(--font-size-xs);color:var(--color-text-dim); }
.checked-badge { display:flex;align-items:center;gap:6px;color:var(--color-green);font-size:var(--font-size-xs); }

.task-list { display:flex;flex-direction:column;gap:8px; }
.task-row { display:flex;align-items:center;gap:12px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm); }
.task-row.done { opacity:.5; }
.task-info { flex:1; }
.task-name { font-size:var(--font-size-xs);color:var(--color-white); }
.task-progress { font-size:var(--font-size-xs);color:var(--color-text-dim); }
.task-reward { font-size:var(--font-size-xs);color:var(--color-green); }

.badge-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:12px; }
.badge-card { padding:20px;text-align:center;background:rgba(255,255,255,0.02);border:1px solid var(--color-border);border-radius:var(--radius-sm);transition:all .2s; }
.badge-card.locked { opacity:.45; }
.badge-name { font-size:var(--font-size-xs);color:var(--color-white);margin-top:8px; }
.badge-desc { font-size:var(--font-size-xs);color:var(--color-text-dim);margin-top:4px; }

/* Modal */
.modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem; }
.modal-content { background:var(--color-bg-card);border-radius:var(--radius-md);width:100%;max-width:500px;max-height:90vh;overflow-y:auto; }
.modal-header { display:flex;justify-content:space-between;align-items:center;padding:1.25rem;border-bottom:1px solid var(--color-border); }
.modal-header h3 { margin:0;font-size:var(--font-size-xs);color:var(--color-white); }
.close-btn { background:none;border:none;color:var(--color-text-dim);cursor:pointer;padding:4px; }
.close-btn:hover { color:var(--color-white); }
.modal-body { padding:1.25rem; }
.modal-footer { display:flex;justify-content:flex-end;gap:8px;margin-top:16px; }
.field { margin-bottom:14px; }
.field label { display:block;font-size:var(--font-size-xs);color:var(--color-text-dim);margin-bottom:6px; }

@media (max-width:600px) {
  .quick-grid { grid-template-columns:1fr; }
  .dash-grid { grid-template-columns:repeat(2,1fr); }
  .badge-grid { grid-template-columns:repeat(2,1fr); }
  .user-stats-row { flex-direction:column;gap:4px; }
}
</style>