<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ ./oauth --exchange</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ status }}</span>
      </h1>
      <p v-if="error" class="auth-error mt-20">{{ error }}</p>
      <RouterLink v-if="error" to="/auth" class="btn-geek mt-20">返回登录</RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { exchangeOAuthCode } from '@/composables/useSiteData'

const route = useRoute()
const router = useRouter()
const { applySession } = useAuth()

const status = ref('正在完成登录...')
const error = ref('')

onMounted(async () => {
  const code = route.query.code as string
  if (!code) {
    error.value = '缺少登录码'
    status.value = '登录失败'
    return
  }
  try {
    const session = await exchangeOAuthCode(code)
    applySession(session.token, session.user)
    status.value = '登录成功'
    router.replace(`/user/${session.user.id}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '登录失败'
    status.value = '登录失败'
  }
})
</script>
