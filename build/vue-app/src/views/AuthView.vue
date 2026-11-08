<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ ./auth --login</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ heading }}</span>
      </h1>
      <p class="text-dim" style="margin-top:12px; max-width:520px;">
        账号数据存储在 Cloudflare D1，仅用于身份识别与资料展示。本站不提供第三方快捷登录。
      </p>
    </section>

    <section class="mb-60" style="padding-left:40px; padding-right:40px;">
      <AuthForm v-if="!isAuthenticated" @success="onSuccess" />
      <div v-else class="term-block auth-block">
        <div class="term-bar">
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span class="auth-bar-title">session.sh</span>
        </div>
        <div class="term-body">
          <div class="term-line">whoami</div>
          <div class="term-line-out">{{ user?.nickname }}</div>
          <div class="term-line-out">{{ user?.email }}</div>
          <div class="flex gap-12 mt-20">
            <RouterLink :to="`/user/${user?.id}`" class="btn-geek" style="font-size:var(--font-size-xs);">个人主页</RouterLink>
            <button class="btn-geek" style="font-size:var(--font-size-xs);" @click="handleSignOut">退出登录</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthForm from '@/components/AuthForm.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, isAuthenticated, signOut } = useAuth()

const heading = computed(() => (isAuthenticated.value ? '会话已建立' : '登录或创建账号'))

function onSuccess() {
  router.push(`/user/${user.value?.id ?? ''}`)
}

function handleSignOut() {
  signOut()
}
</script>

<style scoped>
.auth-block {
  max-width: 460px;
}

.auth-bar-title {
  margin-left: 8px;
  opacity: 0.55;
  font-family: var(--font-mono);
  font-size: 0.8rem;
}
</style>
