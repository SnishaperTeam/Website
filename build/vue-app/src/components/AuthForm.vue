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

      <div class="oauth-divider">或使用第三方账号</div>
      <div class="oauth-row">
        <button v-for="p in providers" :key="p.key" class="oauth-btn" type="button" @click="startOAuth(p.key)">
          <Icon :icon="p.icon" width="16" /> {{ p.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuth } from '@/composables/useAuth'

const emit = defineEmits<{ success: [] }>()
const route = useRoute()

const { signIn, signUp } = useAuth()

const providers = [
  { key: 'github', label: 'GitHub', icon: 'simple-icons:github' },
  { key: 'google', label: 'Google', icon: 'simple-icons:google' },
  { key: 'microsoft', label: 'Microsoft', icon: 'simple-icons:microsoft' },
]

function startOAuth(key: string) {
  window.location.href = `/api/auth/oauth/${key}/start`
}

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const nickname = ref('')
const password = ref('')
const confirm = ref('')
const error = ref(typeof route.query.oauth_error === 'string' ? route.query.oauth_error : '')
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

.oauth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0 14px;
  font-size: 0.75rem;
  color: var(--color-text-faint);
}

.oauth-divider::before,
.oauth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.oauth-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.oauth-btn {
  flex: 1;
  min-width: 120px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.oauth-btn:hover {
  color: var(--color-text);
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}
</style>
