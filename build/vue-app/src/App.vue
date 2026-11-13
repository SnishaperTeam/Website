<script setup lang="ts">
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { onMounted, ref, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from './composables/useAuth'
import { useNoiseOverlay } from './composables/useNoiseOverlay'
import { checkAdmin, adminHeaders } from './composables/useAdmin'
import {
  applyOverrides,
  disableEditing,
  enableEditing,
  loadEdits,
  readOverrides,
  saveEdits,
  type EditOverrides,
} from './composables/useInlineEdit'
import InlineEditToolbar from './components/InlineEditToolbar.vue'

const router = useRouter()
const route = useRoute()
const { user, loading, isAuthenticated, signOut } = useAuth()

const handleSignOut = () => {
  signOut()
  router.push('/')
}

const pageRoot = ref<HTMLElement | null>(null)
const editMode = ref(false)
const editSaving = ref(false)
const editMessage = ref('')
const editError = ref(false)
let cached: { path: string; overrides: EditOverrides } = { path: '', overrides: {} }
let observer: MutationObserver | null = null
let refreshToken = 0

async function refreshPage() {
  const token = ++refreshToken
  const path = route.path
  const wantEdit = route.query.edit === '1'
  const overrides = await loadEdits(path)
  if (token !== refreshToken || route.path !== path) return
  await nextTick()
  const root = pageRoot.value
  if (!root || token !== refreshToken || route.path !== path) return
  cached = { path, overrides }
  disableEditing(root)
  applyOverrides(root, overrides)

  const admin = wantEdit ? await checkAdmin() : false
  if (token !== refreshToken || route.path !== path) return
  if (wantEdit && !admin) {
    router.replace({ path, query: {} })
    return
  }
  editMode.value = admin
  editMessage.value = ''
  editError.value = false
  if (editMode.value) enableEditing(root)
  watchDom()
}

function watchDom() {
  observer?.disconnect()
  const root = pageRoot.value
  if (!root) return
  let pending = false
  observer = new MutationObserver(() => {
    if (pending) return
    pending = true
    requestAnimationFrame(() => {
      pending = false
      const el = pageRoot.value
      if (!el || cached.path !== route.path) return
      if (editMode.value) enableEditing(el)
      else applyOverrides(el, cached.overrides)
    })
  })
  observer.observe(root, { childList: true, subtree: true, characterData: true })
}

async function reloadCurrentPath() {
  await router.replace({ path: route.path, query: {} })
  window.location.reload()
}

async function saveInlineEdits() {
  const root = pageRoot.value
  if (!root) return
  editSaving.value = true
  editMessage.value = ''
  editError.value = false
  try {
    const overrides = readOverrides(root)
    await saveEdits(route.path, overrides, adminHeaders())
    editMessage.value = '已保存'
    await reloadCurrentPath()
  } catch (e) {
    editMessage.value = e instanceof Error ? e.message : '保存失败'
    editError.value = true
  } finally {
    editSaving.value = false
  }
}

async function cancelInlineEdits() {
  await reloadCurrentPath()
}

watch(() => route.fullPath, () => {
  setTimeout(refreshPage, 80)
})

onMounted(() => {
  useNoiseOverlay()
  setTimeout(refreshPage, 150)
})
</script>

<template>
  <nav class="geek-nav">
    <RouterLink to="/" class="geek-nav-brand">
      <span>&#x25a0;</span> SnishaperTeam
    </RouterLink>
    <ul class="geek-nav-links">
      <li><RouterLink to="/">[首页]</RouterLink></li>
      <li><RouterLink to="/projects">[项目]</RouterLink></li>
      <li><RouterLink to="/blog">[博客]</RouterLink></li>
      <li><RouterLink to="/about">[关于]</RouterLink></li>
      <li><RouterLink to="/tests">[测评]</RouterLink></li>
      <li><RouterLink to="/emergency">[求助]</RouterLink></li>
    </ul>
    <div class="geek-nav-actions">
      <a class="nav-icon-btn" href="https://github.com/dongzheyu" target="_blank" title="GitHub">
        <Icon icon="mdi:github" width="16" />
      </a>
      <template v-if="isAuthenticated && user">
        <RouterLink :to="`/user/${user.id}`" class="nav-icon-btn" title="个人主页">
          <Icon icon="mdi:account-circle" width="18" />
        </RouterLink>
        <button class="nav-icon-btn" @click="handleSignOut" title="退出登录">
          <Icon icon="mdi:exit-to-app" width="18" />
        </button>
      </template>
      <RouterLink v-else-if="!loading" to="/auth" class="nav-icon-btn" title="登录">
        <Icon icon="mdi:login-variant" width="18" />
      </RouterLink>
    </div>
  </nav>

  <main ref="pageRoot">
    <RouterView v-slot="{ Component }">
      <transition name="page-fade" appear>
        <component :is="Component" :key="$route.fullPath" />
      </transition>
    </RouterView>
  </main>

  <InlineEditToolbar
    :active="editMode"
    :saving="editSaving"
    :message="editMessage"
    :is-error="editError"
    @save="saveInlineEdits"
    @cancel="cancelInlineEdits"
  />

  <footer class="geek-footer">
    <div class="footer-row">
      <span>
        <span class="text-faint">// 2026</span> SnishaperTeam &mdash; 代码重塑世界
      </span>
      <span class="flex gap-16">
        <RouterLink to="/privacy">隐私</RouterLink>
        <RouterLink to="/terms">条款</RouterLink>
        <a href="https://github.com/dongzheyu" target="_blank" class="text-faint">Github</a>
        <a href="https://gitee.com/jetcpp" target="_blank" class="text-faint">Gitee</a>
      </span>
    </div>
    <div class="powered-by">
      <span class="text-faint">// 由</span>
      <a href="https://my.dnshe.com/go.php?code=pPuY9hh0Iw" target="_blank" class="pw-link"><img src="/dnshe.png" width="14" height="14" style="vertical-align:middle;" /> DNSHE</a>
      <span class="text-faint">、</span>
      <a href="https://www.cloudflare-cn.com/" target="_blank" class="pw-link"><Icon icon="simple-icons:cloudflare" width="14" /> Cloudflare</a>
      <span class="text-faint">、</span>
      <a href="https://vuejs.org/" target="_blank" class="pw-link"><Icon icon="mdi:vuejs" width="14" /> Vue</a>
      <span class="text-faint">、</span>
      <a href="https://bun.sh/" target="_blank" class="pw-link"><Icon icon="simple-icons:bun" width="14" /> Bun</a>
      <span class="text-faint">、</span>
      <a href="https://github.com/" target="_blank" class="pw-link"><Icon icon="mdi:github" width="14" /> GitHub</a>
      <span class="text-faint">强力驱动</span>
    </div>
  </footer>
</template>

<style>
.page-fade-enter-active { transition: opacity 0.45s var(--ease-out-expo), transform 0.45s var(--ease-out-expo); }
.page-fade-leave-active { transition: opacity 0.2s var(--ease-out-expo); position: absolute; width: 100%; }
.page-fade-enter-from { opacity: 0; transform: translateY(12px); }
.page-fade-leave-to { opacity: 0; }

.inline-editable {
  cursor: text;
  border-radius: 2px;
  outline: 1px dashed transparent;
  outline-offset: 3px;
  transition: outline-color 0.2s, background 0.2s;
}

.inline-editable:hover {
  outline-color: rgba(255, 179, 71, 0.55);
  background: rgba(255, 179, 71, 0.07);
}

.inline-editable:focus {
  outline: 1px solid rgba(255, 179, 71, 0.85);
  background: rgba(255, 179, 71, 0.1);
}
</style>