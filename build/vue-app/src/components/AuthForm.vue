<template>
  <div class="term-block auth-block">
    <div class="term-bar">
      <span class="term-dot"></span>
      <span class="term-dot"></span>
      <span class="term-dot"></span>
      <span class="auth-bar-title">{{ mode === 'login' ? 'auth/login.sh' : 'auth/register.sh' }}</span>
    </div>
    <div class="term-body">
      <div class="auth-tabs">
        <button class="auth-tab" :class="{ on: mode === 'login' }" @click="switchMode('login')">登录</button>
        <button class="auth-tab" :class="{ on: mode === 'register' }" @click="switchMode('register')">注册</button>
      </div>

      <form class="auth-form" @submit.prevent="submit">
        <label class="field">
          <span class="field-label">$ email</span>
          <input v-model.trim="email" type="email" autocomplete="email" placeholder="you@example.com" required />
        </label>

        <label v-if="mode === 'register'" class="field">
          <span class="field-label">$ nickname</span>
          <input v-model.trim="nickname" type="text" autocomplete="nickname" placeholder="2-24 个字符" maxlength="24" />
        </label>

        <label class="field">
          <span class="field-label">$ password</span>
          <input
            v-model="password"
            type="password"
            :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
            placeholder="至少 8 位"
            required
          />
        </label>

        <label v-if="mode === 'register'" class="field">
          <span class="field-label">$ confirm</span>
          <input v-model="confirm" type="password" autocomplete="new-password" placeholder="再次输入密码" required />
        </label>

        <p v-if="error" class="auth-error">{{ error }}</p>
        <p v-if="info" class="auth-info">{{ info }}</p>

        <button class="btn-geek auth-submit" type="submit" :disabled="busy">
          {{ busy ? '处理中...' : mode === 'login' ? '$ 登录' : '$ 注册' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const emit = defineEmits<{ success: [] }>()

const { signIn, signUp } = useAuth()

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const nickname = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const info = ref('')
const busy = ref(false)

function switchMode(next: 'login' | 'register') {
  mode.value = next
  error.value = ''
  info.value = ''
  password.value = ''
  confirm.value = ''
}

async function submit() {
  error.value = ''
  info.value = ''
  if (!email.value) {
    error.value = '请输入邮箱'
    return
  }
  if (password.value.length < 8) {
    error.value = '密码至少 8 位'
    return
  }
  if (mode.value === 'register' && password.value !== confirm.value) {
    error.value = '两次输入的密码不一致'
    return
  }

  busy.value = true
  try {
    if (mode.value === 'login') {
      await signIn(email.value, password.value)
    } else {
      await signUp({ email: email.value, password: password.value, nickname: nickname.value || undefined })
    }
    emit('success')
  } catch (e) {
    error.value = e instanceof Error ? e.message : '操作失败'
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.auth-block {
  max-width: 460px;
  margin: 0 auto;
}

.auth-bar-title {
  margin-left: 8px;
  opacity: 0.55;
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.auth-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.auth-tab {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  padding: 0.45rem 1.1rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.auth-tab.on {
  color: var(--color-text);
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.field input {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
  color: var(--color-text);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus {
  border-color: rgba(255, 255, 255, 0.4);
}

.field input::placeholder {
  color: var(--color-text-faint);
}

.auth-error {
  margin: 0;
  font-size: 0.85rem;
  color: #ff7b72;
}

.auth-info {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.auth-submit {
  align-self: flex-start;
  margin-top: 0.5rem;
  font-family: var(--font-mono);
}

.auth-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
