<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ ./oauth --bind</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">绑定已有账号</span>
      </h1>
      <p class="text-dim mt-20" style="max-width:520px;">
        该邮箱已注册本站账号。输入账号密码以确认身份，通过后第三方登录将绑定到同一账号。
      </p>
    </section>

    <section style="padding-left:40px; padding-right:40px;">
      <div class="term-block bind-block">
        <div class="term-bar">
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span>bind-account.sh</span>
        </div>
        <div class="term-body">
          <label for="bind-password">密码 / PASSWORD</label>
          <input
            id="bind-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="输入该邮箱的本站密码"
            @keyup.enter="confirm"
          />
          <p v-if="error" class="err">{{ error }}</p>
          <div class="actions">
            <button class="btn-geek primary" :disabled="busy || !password" @click="confirm">
              {{ busy ? '验证中...' : '确认绑定并登录' }}
            </button>
            <RouterLink to="/auth" class="btn-geek">取消</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { confirmOAuthBind, exchangeOAuthCode } from '@/composables/useSiteData'

const route = useRoute()
const router = useRouter()
const { applySession } = useAuth()

const password = ref('')
const busy = ref(false)
const error = ref('')

async function confirm() {
  if (!password.value || busy.value) return
  const ticket = route.query.ticket as string
  if (!ticket) {
    error.value = '绑定请求无效，请重新发起快捷登录'
    return
  }
  busy.value = true
  error.value = ''
  try {
    const { code } = await confirmOAuthBind(ticket, password.value)
    const session = await exchangeOAuthCode(code)
    applySession(session.token, session.user)
    router.replace(`/user/${session.user.id}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '绑定失败'
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.bind-block {
  max-width: 460px;
}

label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  margin-bottom: 8px;
}

input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  outline: none;
}

input:focus {
  border-color: rgba(255, 255, 255, 0.3);
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.err {
  font-size: var(--font-size-xs);
  color: #ff7b72;
  margin-top: 10px;
}
</style>
