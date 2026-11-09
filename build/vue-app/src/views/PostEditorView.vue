<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ vim blog/{{ editingId ? 'edit' : 'new' }}.md</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">写文章</span>
      </h1>
    </section>

    <div v-if="!isAuthenticated" class="notice">
      请先 <RouterLink to="/auth">登录</RouterLink> 后再发布文章。
    </div>

    <div v-else class="editor-layout" style="padding-left:40px; padding-right:40px;">
      <section class="form-panel">
        <div class="sec-head">{{ editingId ? '编辑文章' : '新建文章' }}</div>

        <label>标题 / TITLE</label>
        <input v-model.trim="form.title" placeholder="文章标题" @input="syncSlug" />

        <label>Slug / 链接</label>
        <input v-model.trim="form.slug" :disabled="!!editingId" placeholder="my-first-post" />

        <label>摘要 / EXCERPT</label>
        <input v-model.trim="form.excerpt" placeholder="一句话简介" />

        <label>分类 / CATEGORY</label>
        <select v-model="form.category">
          <option value="个人文章">个人文章</option>
          <option value="编程教程">编程教程</option>
          <option value="技术分享">技术分享</option>
          <option value="团队动态">团队动态</option>
        </select>

        <label>标签 / TAGS（逗号分隔）</label>
        <input v-model.trim="form.tags" placeholder="Vue, Cloudflare, 笔记" />

        <label>主题色 / COLOR</label>
        <ColorPicker v-model="form.color" />

        <label>正文 / MARKDOWN</label>
        <MarkdownEditor v-model="form.content" />

        <div class="row-line">
          <label class="check">
            <input v-model="form.published" type="checkbox" /> 立即发布
          </label>
        </div>

        <div class="draft-line">
          <span>{{ draftSavedAt ? '草稿已自动保存到本机 · ' + draftSavedAt : '草稿自动保存在本机，只有发布才上云' }}</span>
          <button v-if="draftSavedAt" class="link-btn" type="button" @click="discardDraft">[清除草稿]</button>
        </div>

        <p v-if="error" class="err">{{ error }}</p>
        <p v-if="msg" class="ok">{{ msg }}</p>

        <div class="actions">
          <button class="btn-geek primary" :disabled="busy" @click="save">
            {{ busy ? '保存中...' : editingId ? '保存修改（上云）' : form.published ? '发布到云端' : '保存本地草稿' }}
          </button>
          <button v-if="editingId" class="btn-geek" @click="resetForm">取消编辑</button>
        </div>
      </section>

      <aside class="side-panel">
        <div class="sec-head">我的文章 <span class="count">{{ myPosts.length }}</span></div>
        <div v-if="!myPosts.length" class="empty">还没有文章</div>
        <div v-for="p in myPosts" :key="p.id" class="mine" :class="{ on: editingId === p.id }">
          <div class="mine-title">{{ p.title }}</div>
          <div class="mine-meta">{{ String(p.createdAt).slice(0, 10) }} · {{ p.published ? '已发布' : '草稿' }}</div>
          <div class="mine-actions">
            <button class="link-btn" @click="editPost(p)">[编辑]</button>
            <RouterLink class="link-btn" :to="`/blog/${p.slug}`">[查看]</RouterLink>
            <button class="link-btn danger" @click="deletePost(p)">[删除]</button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import ColorPicker from '@/components/ColorPicker.vue'
import { useAuth } from '@/composables/useAuth'
import {
  createPost,
  getMyPosts,
  removePost,
  updatePost,
  type DynamicPost,
  type PostPayload,
} from '@/composables/useSiteData'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()

const emptyForm = () => ({
  title: '', slug: '', excerpt: '', content: '', category: '个人文章',
  tags: '', color: '#FFB347', published: true,
})

const form = ref(emptyForm())
const editingId = ref('')
const myPosts = ref<DynamicPost[]>([])
const busy = ref(false)
const error = ref('')
const msg = ref('')

const DRAFT_PREFIX = 'post_draft_'
const draftKey = computed(() => DRAFT_PREFIX + (editingId.value || 'new'))
const draftSavedAt = ref('')
let draftTimer: ReturnType<typeof setTimeout> | null = null
let suppressDraft = false

function saveDraft() {
  try {
    localStorage.setItem(draftKey.value, JSON.stringify({ form: form.value, savedAt: Date.now() }))
    draftSavedAt.value = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } catch {}
}

function clearDraft(key = draftKey.value) {
  try {
    localStorage.removeItem(key)
  } catch {}
  draftSavedAt.value = ''
}

function restoreDraft(key: string): boolean {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return false
    const data = JSON.parse(raw)
    if (!data?.form) return false
    form.value = { ...emptyForm(), ...data.form }
    draftSavedAt.value = new Date(data.savedAt || Date.now()).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })
    return true
  } catch {
    return false
  }
}

watch(
  form,
  () => {
    if (suppressDraft) return
    if (draftTimer) clearTimeout(draftTimer)
    draftTimer = setTimeout(saveDraft, 600)
  },
  { deep: true },
)

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function syncSlug() {
  if (!editingId.value && !form.value.slug) form.value.slug = toSlug(form.value.title)
}

function payload(): PostPayload {
  return {
    title: form.value.title,
    slug: form.value.slug,
    excerpt: form.value.excerpt,
    content: form.value.content,
    category: form.value.category,
    tags: form.value.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
    color: form.value.color,
    published: form.value.published,
  }
}

async function loadMine() {
  if (!isAuthenticated.value) return
  myPosts.value = await getMyPosts()
}

async function save() {
  error.value = ''
  msg.value = ''
  if (!form.value.title) {
    error.value = '标题不能为空'
    return
  }
  if (!form.value.slug) {
    error.value = 'Slug 不能为空'
    return
  }
  if (!form.value.content) {
    error.value = '正文不能为空'
    return
  }

  if (!editingId.value && !form.value.published) {
    if (draftTimer) clearTimeout(draftTimer)
    saveDraft()
    msg.value = '已存为本地草稿，未上云'
    return
  }

  busy.value = true
  try {
    if (editingId.value) {
      await updatePost(editingId.value, payload())
      clearDraft(DRAFT_PREFIX + editingId.value)
      msg.value = '修改已同步到云端'
    } else {
      await createPost(payload())
      clearDraft(DRAFT_PREFIX + 'new')
      msg.value = '已发布到云端'
      resetForm()
    }
    await loadMine()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    busy.value = false
  }
}

function discardDraft() {
  clearDraft()
  if (editingId.value) {
    const target = myPosts.value.find((p) => p.id === editingId.value)
    if (target) editPost(target)
  } else {
    form.value = emptyForm()
  }
  msg.value = '本地草稿已清除'
}

function resetForm() {
  editingId.value = ''
  form.value = emptyForm()
  error.value = ''
  msg.value = ''
  draftSavedAt.value = ''
  router.replace('/blog/new')
}

function editPost(p: DynamicPost) {
  editingId.value = p.id
  form.value = {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || '',
    content: p.content,
    category: p.category || '个人文章',
    tags: (p.tags || []).join(', '),
    color: p.color || '#FFB347',
    published: p.published,
  }
  error.value = ''
  msg.value = ''
  router.replace(`/blog/edit/${p.id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deletePost(p: DynamicPost) {
  if (!confirm(`删除文章「${p.title}」？`)) return
  try {
    await removePost(p.id)
    if (editingId.value === p.id) resetForm()
    await loadMine()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败'
  }
}

onMounted(async () => {
  await loadMine()
  const id = route.params.id as string
  suppressDraft = true
  if (id) {
    const target = myPosts.value.find((p) => p.id === id)
    if (target) {
      editPost(target)
      restoreDraft(DRAFT_PREFIX + target.id)
    }
  } else {
    restoreDraft(DRAFT_PREFIX + 'new')
  }
  suppressDraft = false
})
</script>

<style scoped>
.notice {
  margin-left: 40px;
  padding: 16px 20px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-dim);
  font-size: var(--font-size-sm);
}

.editor-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.8fr);
  gap: 28px;
  align-items: start;
}

@media (max-width: 900px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
}

.form-panel,
.side-panel,
.preview-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 24px;
  background: rgba(255, 255, 255, 0.015);
}

.preview-panel {
  grid-column: 1 / -1;
}

.sec-head {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.count {
  color: var(--color-text-faint);
  margin-left: 6px;
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
  border-color: rgba(255, 255, 255, 0.25);
}

textarea {
  resize: vertical;
  line-height: 1.7;
}

select option {
  background: var(--color-bg);
}

.row-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
}

.check {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.check input {
  width: auto;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.draft-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
  font-family: var(--font-mono);
  flex-wrap: wrap;
}

.err {
  font-size: var(--font-size-xs);
  color: #ff7b72;
}

.ok {
  font-size: var(--font-size-xs);
  color: var(--color-green);
}

.empty {
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
  padding: 20px 0;
}

.mine {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  margin-bottom: 10px;
}

.mine.on {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.mine-title {
  font-size: var(--font-size-sm);
  color: var(--color-heading);
}

.mine-meta {
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
  margin-top: 4px;
  font-family: var(--font-mono);
}

.mine-actions {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.link-btn {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  cursor: pointer;
  text-decoration: none;
}

.link-btn:hover {
  color: var(--color-text);
}

.link-btn.danger:hover {
  color: #ff7b72;
}

.preview-title {
  font-size: var(--font-size-lg);
  font-weight: 400;
  margin-bottom: 20px;
}
</style>
