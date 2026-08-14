<template>
  <div style="max-width:520px; margin:0 auto;">
    <div class="term-block">
      <div class="term-bar">
        <span class="term-dot"></span>
        <span class="term-dot"></span>
        <span class="term-dot"></span>
        <span style="margin-left:8px;opacity:0.5;">auth.reset.sh</span>
      </div>
      <div class="term-body">
        <template v-if="step === 1">
          <div class="term-line" style="margin-bottom:20px;">./auth --send-code</div>

          <form @submit.prevent="handleSendCode">
            <div class="field">
              <label for="email">邮箱</label>
              <input id="email" v-model="email" type="email" placeholder="输入注册时的邮箱" required class="term-input" />
            </div>

            <div class="cf-turnstile" data-sitekey="0x4AAAAAAD9eupJAQYJfXjdp" data-action="turnstile-spin-v2"></div>

            <div v-if="error" class="msg msg-error">
              <Icon icon="mdi:alert-circle" /> {{ error }}
            </div>
            <div v-if="successMessage" class="msg msg-success">
              <Icon icon="mdi:check-circle" /> {{ successMessage }}
            </div>

            <button type="submit" class="btn-geek" style="width:100%;" :disabled="loading">
              {{ loading ? '发送中...' : '发送验证码' }}
            </button>
          </form>

          <div style="margin-top:14px;">
            <RouterLink to="/auth" class="link-like">
              <Icon icon="mdi:arrow-left" /> 返回登录
            </RouterLink>
          </div>
        </template>

        <template v-else>
          <div class="term-line" style="margin-bottom:20px;">./auth --verify-code</div>

          <form @submit.prevent="handleResetPassword">
            <div class="field">
              <label for="code">验证码</label>
              <input id="code" v-model="code" type="text" placeholder="输入邮件中的验证码" required class="term-input" />
            </div>

            <div class="field">
              <label for="newPassword">新密码</label>
              <div class="pw-wrap">
                <input
                  id="newPassword"
                  v-model="newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="至少6位"
                  required
                  minlength="6"
                  class="term-input"
                />
                <button type="button" class="pw-toggle" @click="showNewPassword = !showNewPassword" :title="showNewPassword ? '隐藏' : '显示'">
                  <Icon :icon="showNewPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                </button>
              </div>
            </div>

            <div class="field">
              <label for="confirmPassword">确认密码</label>
              <div class="pw-wrap">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="再次输入新密码"
                  required
                  minlength="6"
                  class="term-input"
                />
                <button type="button" class="pw-toggle" @click="showConfirmPassword = !showConfirmPassword" :title="showConfirmPassword ? '隐藏' : '显示'">
                  <Icon :icon="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                </button>
              </div>
            </div>

            <div class="cf-turnstile" data-sitekey="0x4AAAAAAD9eupJAQYJfXjdp" data-action="turnstile-spin-v2"></div>

            <div v-if="error" class="msg msg-error">
              <Icon icon="mdi:alert-circle" /> {{ error }}
            </div>
            <div v-if="successMessage" class="msg msg-success">
              <Icon icon="mdi:check-circle" /> {{ successMessage }}
            </div>

            <div style="display:flex;gap:8px;">
              <button type="button" class="btn-geek" style="flex:1;" @click="step = 1">
                返回
              </button>
              <button type="submit" class="btn-geek" style="flex:2;" :disabled="loading">
                {{ loading ? '验证中...' : '重置密码' }}
              </button>
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'

const router = useRouter()
const step = ref(1)
const email = ref('')
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const siteVerify = async (token: string): Promise<boolean> => {
  try {
    const r = await fetch('/turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    const data = await r.json()
    return data.success === true
  } catch {
    return import.meta.env.DEV
  }
}

function renderTurnstile() {
  nextTick(() => {
    const fn = () => {
      const el = document.querySelector('.cf-turnstile') as HTMLElement
      if (!el) return
      const t = (window as any).turnstile
      if (t) { try { t.render(el) } catch {} }
      else { setTimeout(fn, 200) }
    }
    fn()
  })
}

onMounted(() => {
  renderTurnstile()
})

const handleSendCode = async () => {
  let turnstileToken: string | undefined
  try { turnstileToken = (window as any).turnstile?.getResponse() } catch {}
  if (!turnstileToken) {
    error.value = '请先完成人机验证'
    return
  }
  const valid = await siteVerify(turnstileToken)
  if (!valid) {
    error.value = '人机验证失败，请稍后重试'
    ;(window as any).turnstile?.reset()
    return
  }

  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: { shouldCreateUser: false },
    })
    if (sendError) throw sendError
    successMessage.value = '验证码已发送到你的邮箱'
    setTimeout(() => { step.value = 2; renderTurnstile() }, 1000)
  } catch (err: any) {
    console.error('发送失败:', err)
    error.value = err.message || '发送失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  if (newPassword.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    loading.value = false
    return
  }
  if (newPassword.value.length < 6) {
    error.value = '密码长度至少为6位'
    loading.value = false
    return
  }
  if (!code.value.trim()) {
    error.value = '请输入验证码'
    loading.value = false
    return
  }

  let turnstileToken: string | undefined
  try { turnstileToken = (window as any).turnstile?.getResponse() } catch {}
  if (!turnstileToken) {
    error.value = '请先完成人机验证'
    loading.value = false
    return
  }
  const valid = await siteVerify(turnstileToken)
  if (!valid) {
    error.value = '人机验证失败，请稍后重试'
    loading.value = false
    return
  }

  try {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.value,
      token: code.value.trim(),
      type: 'email',
    })
    if (verifyError) throw verifyError

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.value,
    })
    if (updateError) throw updateError

    successMessage.value = '密码重置成功！正在跳转...'
    setTimeout(() => { router.push('/auth') }, 2000)
  } catch (err: any) {
    console.error('重置失败:', err)
    if (err.message?.includes('OTP')) {
      error.value = '验证码错误或已过期'
    } else {
      error.value = err.message || '重置失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.field {
  margin-bottom: 14px;
}
.field label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  margin-bottom: 6px;
}
.term-input {
  width: 100%;
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-white);
  outline: none;
  transition: all 0.25s var(--ease-out-expo);
  box-sizing: border-box;
}
.term-input:focus {
  border-color: var(--color-border-hover);
  background: rgba(255,255,255,0.06);
}
.pw-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.pw-wrap .term-input {
  padding-right: 32px;
}
.pw-toggle {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: var(--color-text-faint);
  cursor: pointer;
  padding: 4px;
  display: flex;
}
.pw-toggle:hover {
  color: var(--color-text-dim);
}

.msg {
  font-size: var(--font-size-xs);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.msg-error {
  color: #ff5f57;
  border: 1px solid rgba(255,95,87,0.2);
}
.msg-success {
  color: var(--color-green);
  border: 1px solid rgba(120,220,160,0.2);
}

.link-like {
  background: none;
  border: none;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  cursor: pointer;
  text-decoration: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.link-like:hover {
  color: var(--color-white);
}
</style>