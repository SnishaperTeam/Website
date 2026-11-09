<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useTypewriter } from '@/composables/useTypewriter'
import { useStaggeredFade } from '@/composables/useStaggeredFade'
import { useAdmin } from '@/composables/useAdmin'
import { useProjects, type ProjectPayload } from '@/composables/useProjects'

const { display, cursor, done } = useTypewriter('探索我们的开源项目。', 50)
const { isAdmin, checkAdmin } = useAdmin()
const { dynamicProjects, loadProjects, createProject, updateProject, deleteProject } = useProjects()

const activeCategory = ref('all')

const categories = [
  { value: 'all', label: '全部', icon: 'mdi:view-grid' },
  { value: '网络', label: '网络', icon: 'mdi:web' },
  { value: '教育', label: '教育', icon: 'mdi:school' },
  { value: '系统', label: '系统', icon: 'mdi:desktop-mac' },
  { value: '游戏', label: '游戏', icon: 'mdi:gamepad-variant' },
]

const staticProjects = [
  {
    id: 1,
    title: 'SniShaper',
    description: '基于 Go + Wails v3 的智能网络代理工具，集成 ECH 注入、TLS-RF 分片、QUIC 重建连接',
    category: '网络',
    link: '/snishaper',
    external: false,
    managed: false,
    rawId: '',
  },
  {
    id: 2,
    title: 'English Listen WinUI',
    description: '现代化英语听写训练工具，WinUI 3 + C# + C++ 混合开发，MVVM 架构，Mica 材质',
    category: '教育',
    link: '/project/english-listen-winui',
    external: false,
    managed: false,
    rawId: '',
  },
  {
    id: 3,
    title: 'English-Listen',
    description: '专业英语听写训练工具，基于 C++ 和 Qt6 开发的现代化听写软件',
    category: '教育',
    link: '/project/english-listen',
    external: false,
    managed: false,
    rawId: '',
  },
  {
    id: 4,
    title: 'Lumine-For-Android',
    description: 'enimul 引擎驱动的 Clash 风格 Android 代理，VPN/TUN 管道 + GFWlist 智能分流',
    category: '网络',
    link: '/lumine',
    external: false,
    managed: false,
    rawId: '',
  },
]

const allProjects = computed(() => [
  ...dynamicProjects.value.map((p) => ({
    id: 'dynamic-' + p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    link: p.link,
    external: p.external,
    managed: true,
    rawId: p.id,
  })),
  ...staticProjects,
])

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') return allProjects.value
  return allProjects.value.filter(p => p.category === activeCategory.value)
})

const getCategoryCount = (cat: string) => allProjects.value.filter(p => p.category === cat).length

const { visible } = useStaggeredFade(24, 120)

const emptyForm = (): ProjectPayload => ({
  title: '',
  description: '',
  category: '系统',
  link: '',
  external: false,
})

const showForm = ref(false)
const editingId = ref('')
const form = ref<ProjectPayload>(emptyForm())
const formError = ref('')
const formBusy = ref(false)
const notice = ref('')

function openCreate() {
  editingId.value = ''
  form.value = emptyForm()
  formError.value = ''
  showForm.value = true
}

function openEdit(p: typeof allProjects.value[number]) {
  editingId.value = p.rawId
  form.value = {
    title: p.title,
    description: p.description,
    category: p.category,
    link: p.link,
    external: p.external,
  }
  formError.value = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  formError.value = ''
}

async function save() {
  formError.value = ''
  const payload = form.value
  if (!payload.title.trim()) {
    formError.value = '标题不能为空'
    return
  }
  if (!payload.description.trim()) {
    formError.value = '描述不能为空'
    return
  }
  if (!payload.link.trim()) {
    formError.value = '链接不能为空'
    return
  }
  if (payload.external && !/^https?:\/\//.test(payload.link)) {
    formError.value = '外链需以 http(s):// 开头'
    return
  }
  if (!payload.external && !payload.link.startsWith('/')) {
    formError.value = '站内链接需以 / 开头'
    return
  }
  formBusy.value = true
  try {
    if (editingId.value) await updateProject(editingId.value, payload)
    else await createProject(payload)
    await loadProjects(true)
    notice.value = editingId.value ? '项目已更新' : '项目已新增'
    closeForm()
    setTimeout(() => { notice.value = '' }, 3000)
  } catch (e) {
    formError.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    formBusy.value = false
  }
}

async function remove(p: typeof allProjects.value[number]) {
  if (!confirm(`删除项目「${p.title}」？`)) return
  try {
    await deleteProject(p.rawId)
    await loadProjects(true)
    notice.value = '项目已删除'
    setTimeout(() => { notice.value = '' }, 3000)
  } catch (e) {
    notice.value = e instanceof Error ? e.message : '删除失败'
  }
}

onMounted(async () => {
  await loadProjects()
  await checkAdmin()
})
</script>

<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ ls projects/</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ display }}</span>
        <span class="typewriter-cursor" :class="{ done }"></span>
      </h1>
    </section>

    <section class="mb-40">
      <div class="flex gap-12 flex-wrap items-center" style="padding-left:40px;">
        <button
          v-for="cat in categories" :key="cat.value"
          class="tag-pill"
          :style="{
            color: activeCategory === cat.value ? 'rgba(255,255,255,0.85)' : 'var(--color-text-faint)',
            borderColor: activeCategory === cat.value ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
            cursor: 'pointer',
            background: activeCategory === cat.value ? 'rgba(255,255,255,0.06)' : 'transparent',
          }"
          @click="activeCategory = cat.value"
        >
          <Icon :icon="cat.icon" width="14" style="margin-right:4px" /> {{ cat.label }}
          <span v-if="cat.value !== 'all'" style="margin-left:4px; opacity:0.5;">({{ getCategoryCount(cat.value) }})</span>
        </button>
        <span class="cat-spacer"></span>
        <button v-if="isAdmin" class="btn-geek" style="font-size:var(--font-size-xs);" @click="openCreate">
          <Icon icon="mdi:plus" width="14" /> 新增项目
        </button>
        <RouterLink v-else to="/admin" class="admin-link">管理登录</RouterLink>
      </div>
      <p v-if="notice" class="admin-notice">{{ notice }}</p>
    </section>

    <div class="divider-geek mb-40">
      <span>{{ filteredProjects.length }} results</span>
    </div>

    <section class="mb-60">
      <div class="grid-2">
        <div
          v-for="(p, i) in filteredProjects" :key="p.id"
          class="card-geek stagger-item" :class="{ visible: visible[i] }"
        >
          <div class="flex items-center justify-between mb-20">
            <span class="badge-geek">{{ p.category }}</span>
            <span v-if="p.managed" class="badge-geek green">在线</span>
          </div>
          <h3 style="font-size:var(--font-size-base); font-weight:400; color:rgba(255,255,255,0.82);">{{ p.title }}</h3>
          <p class="text-dim" style="margin:12px 0 20px;">{{ p.description }}</p>
          <div class="flex items-center gap-12 flex-wrap">
            <a v-if="p.external" :href="p.link" target="_blank" class="btn-geek" style="font-size:var(--font-size-xs);">
              <Icon icon="mdi:open-in-new" width="14" /> 查看
            </a>
            <RouterLink v-else :to="p.link" class="btn-geek" style="font-size:var(--font-size-xs);">
              <Icon icon="mdi:arrow-right" width="14" /> 查看
            </RouterLink>
            <template v-if="isAdmin && p.managed">
              <button class="mini-btn" @click="openEdit(p)">[编辑]</button>
              <button class="mini-btn danger" @click="remove(p)">[删除]</button>
            </template>
          </div>
        </div>
      </div>
      <div v-if="filteredProjects.length === 0" class="text-dim mt-40" style="padding-left:40px;">
        <Icon icon="mdi:folder-remove" width="20" style="margin-right:8px;" /> 没有匹配的项目。
      </div>
    </section>

    <div v-if="showForm" class="modal-mask" @click.self="closeForm">
      <div class="modal-card">
        <div class="term-block">
          <div class="term-bar">
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span>project-editor.sh</span>
          </div>
          <div class="term-body">
            <div class="modal-title">{{ editingId ? '编辑项目' : '新增项目' }}</div>

            <label>标题 / TITLE</label>
            <input v-model.trim="form.title" placeholder="项目名称" />

            <label>描述 / DESCRIPTION</label>
            <textarea v-model.trim="form.description" rows="3" placeholder="一句话简介"></textarea>

            <label>分类 / CATEGORY</label>
            <select v-model="form.category">
              <option value="网络">网络</option>
              <option value="教育">教育</option>
              <option value="系统">系统</option>
              <option value="游戏">游戏</option>
            </select>

            <label>链接 / LINK</label>
            <input v-model.trim="form.link" placeholder="/project/xxx 或 https://..." />

            <label class="check-line">
              <input v-model="form.external" type="checkbox" /> 外链（新窗口打开）
            </label>

            <p v-if="formError" class="form-error">{{ formError }}</p>

            <div class="modal-actions">
              <button class="btn-geek primary" :disabled="formBusy" @click="save">
                {{ formBusy ? '保存中...' : editingId ? '保存修改' : '创建' }}
              </button>
              <button class="btn-geek" @click="closeForm">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cat-spacer {
  flex: 1;
}

.admin-link {
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
  text-decoration: none;
}

.admin-link:hover {
  color: var(--color-text);
}

.admin-notice {
  margin: 14px 0 0 40px;
  font-size: var(--font-size-xs);
  color: var(--color-green);
}

.mini-btn {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  cursor: pointer;
}

.mini-btn:hover {
  color: var(--color-text);
}

.mini-btn.danger:hover {
  color: #ff7b72;
}

.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  font-size: var(--font-size-lg);
  color: var(--color-white);
  margin-bottom: 8px;
}

label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  margin: 14px 0 7px;
  letter-spacing: 0.06em;
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
  resize: vertical;
}

input:focus,
textarea:focus,
select:focus {
  border-color: rgba(255, 255, 255, 0.25);
}

select option {
  background: var(--color-bg);
}

.check-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.check-line input {
  width: auto;
}

.form-error {
  font-size: var(--font-size-xs);
  color: #ff7b72;
  margin-top: 12px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
  flex-wrap: wrap;
}
</style>
