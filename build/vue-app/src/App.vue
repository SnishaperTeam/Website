<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from './composables/useAuth'
import { useNoiseOverlay } from './composables/useNoiseOverlay'

const { user, isAuthenticated, signOut } = useAuth()

const handleSignOut = async () => {
  try {
    await signOut()
  } catch (_) {}
  window.location.href = '/'
}

onMounted(() => useNoiseOverlay())
</script>

<template>
  <nav class="geek-nav">
    <RouterLink to="/" class="geek-nav-brand">
      <span>&#x25a0;</span> JetCPP
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
      <RouterLink v-else to="/auth" class="nav-icon-btn" title="登录">
        <Icon icon="mdi:login-variant" width="18" />
      </RouterLink>
    </div>
  </nav>

  <main>
    <RouterView v-slot="{ Component }">
      <transition name="page-fade" appear>
        <component :is="Component" :key="$route.fullPath" />
      </transition>
    </RouterView>
  </main>

  <footer class="geek-footer">
    <div class="footer-row">
      <span>
        <span class="text-faint">// 2026</span> JetCPP &mdash; 代码重塑世界
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
</style>