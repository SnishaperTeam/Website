<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ auth --login</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ display }}</span>
        <span class="typewriter-cursor" :class="{ done }"></span>
      </h1>
    </section>

    <section class="mb-60" style="max-width:520px; margin:0 auto;">
      <AuthForm v-if="!isAuthenticated" />
      <div v-else class="term-block">
        <div class="term-bar">
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span style="margin-left:8px; opacity:0.5;">session.sh</span>
        </div>
        <div class="term-body">
          <div class="term-line">whoami</div>
          <div class="term-line-out" style="margin-top:8px;">{{ user?.email }}</div>
          <div class="term-line-out" style="margin-top:12px;">
            <span class="pulse-dot"></span> authenticated
          </div>
          <div style="margin-top:16px;">
            <div class="term-line-out">uid: <span style="color:var(--color-white);">{{ user?.id }}</span></div>
            <div class="term-line-out">since: <span style="color:var(--color-white);">{{ formatDate(user?.created_at) }}</span></div>
          </div>
          <div class="flex gap-12 mt-20">
            <button @click="handleSignOut" class="btn-geek" style="font-size:var(--font-size-xs);">
              <Icon icon="mdi:logout" width="14" /> 退出登录
            </button>
          </div>
          <div class="term-line" style="margin-top:16px;">exit 0</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useTypewriter } from '@/composables/useTypewriter'
import AuthForm from '@/components/AuthForm.vue'
import { useAuth } from '@/composables/useAuth'

const { display, cursor, done } = useTypewriter('JetCPP 统一认证', 55)
const { user, isAuthenticated, signOut } = useAuth()

const handleSignOut = async () => {
  try { await signOut() } catch (_) {}
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>


