<template>
  <div class="auth-block">
    <div class="term-block">
      <div class="term-bar">
        <span class="term-dot"></span>
        <span class="term-dot"></span>
        <span class="term-dot"></span>
        <span style="margin-left:8px;opacity:0.5;">auth.{{ isLogin ? 'login' : 'register' }}.sh</span>
      </div>
      <div class="term-body">
        <div class="term-line" style="margin-bottom:20px;">
          {{ isLogin ? './auth --login' : './auth --register' }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="field">
            <label for="email">邮箱</label>
            <input id="email" v-model="email" type="email" placeholder="user@example.com" required class="term-input" />
          </div>

          <div class="field">
            <label for="password">密码</label>
            <div class="pw-wrap">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="至少6位"
                required
                minlength="6"
                class="term-input"
              />
              <button type="button" class="pw-toggle" @click="showPassword = !showPassword" :title="showPassword ? '隐藏' : '显示'">
                <Icon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
              </button>
            </div>
          </div>

          <div class="consent-row" v-if="!isLogin">
            <label class="consent-label">
              <input type="checkbox" v-model="agreeTerms" />
              <span>我已阅读并同意<a href="/terms" target="_blank">服务条款</a>和<a href="/privacy" target="_blank">隐私政策</a></span>
            </label>
          </div>

          <div class="consent-row" v-if="isLogin">
            <label class="consent-label">
              <input type="checkbox" v-model="rememberMe" />
              <span>记住我（下次自动登录，有效期30天）</span>
            </label>
          </div>

          <div class="cf-turnstile" data-sitekey="0x4AAAAAAD9eupJAQYJfXjdp" data-action="turnstile-spin-v2"></div>

          <div v-if="error" class="msg msg-error">
            <Icon icon="mdi:alert-circle" /> {{ error }}
          </div>
          <div v-if="successMessage" class="msg msg-success">
            <Icon icon="mdi:check-circle" /> {{ successMessage }}
          </div>

          <button type="submit" class="btn-geek" style="width:100%;margin-top:8px;" :disabled="loading || (!isLogin && !agreeTerms)">
            {{ loading ? '处理中...' : isLogin ? '$ 登录' : '$ 注册' }}
          </button>
        </form>

        <div class="action-row">
          <button class="link-like" @click="toggleMode">
            {{ isLogin ? '注册' : '登录' }}
          </button>
          <RouterLink v-if="isLogin" to="/reset-password" class="link-like">忘记密码</RouterLink>
        </div>

        <div class="divider"><span>第三方登录</span></div>

        <div class="social-row">
          <button type="button" class="social-btn" @click="loginWithOAuth('google')" :disabled="loading">
            <Icon icon="mdi:google" /> Google
          </button>
          <button type="button" class="social-btn" @click="loginWithOAuth('github')" :disabled="loading">
            <Icon icon="mdi:github" /> GitHub
          </button>
          <button type="button" class="social-btn" @click="loginWithOAuth('azure')" :disabled="loading">
            <Icon icon="mdi:microsoft" /> Microsoft
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

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
import { supabase } from '@/supabase/client'
import { Icon } from '@iconify/vue'

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const agreeTerms = ref(false)
const rememberMe = ref(true)

const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': '邮箱或密码错误',
  'Email not confirmed': '邮箱未验证，请检查邮箱',
  'User already registered': '该邮箱已注册，请直接登录',
  'Signup requires a valid email': '请输入有效的邮箱地址',
  'Password should be at least': '密码长度至少为6位',
  'Invalid OTP': '验证码错误或已过期',
}

function mapError(err: any): string {
  const msg = err?.message || ''
  for (const [key, val] of Object.entries(ERROR_MAP)) {
    if (msg.includes(key)) return val
  }
  return msg || '操作失败，请稍后重试'
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  successMessage.value = ''
  email.value = ''
  password.value = ''
  agreeTerms.value = false
}

const handleRememberMe = () => {
  if (!rememberMe.value) {
    const handler = () => { supabase.auth.signOut() }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }
  return () => {}
}

onMounted(() => {
  renderTurnstile()
})

const loginWithOAuth = async (provider: 'google' | 'github' | 'azure') => {
  loading.value = true
  error.value = ''
  try {
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: siteUrl + '/auth/callback' },
    })
    if (oauthError) throw oauthError
  } catch (err: any) {
    console.error('OAuth 登录失败:', err)
    error.value = err.message || 'OAuth 登录失败'
    loading.value = false
  }
}

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

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const turnstileToken = (window as any).turnstile?.getResponse()
    if (!turnstileToken) {
      error.value = '请完成人机验证'
      loading.value = false
      return
    }
    const valid = await siteVerify(turnstileToken)
    if (!valid) {
      error.value = '人机验证失败，请稍后重试'
      ;(window as any).turnstile?.reset()
      loading.value = false
      return
    }

    if (isLogin.value) {
      const { data: rateLimited } = await supabase.rpc('fn_is_rate_limited', {
        p_email: email.value,
        p_ip: '',
      })
      if (rateLimited) {
        error.value = '登录失败次数过多，请15分钟后再试'
        loading.value = false
        return
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (signInError) throw signInError

      await supabase.rpc('fn_record_login_attempt', {
        p_email: email.value,
        p_ip: '',
        p_success: true,
      })

      if (data.user) {
        if (!rememberMe.value) handleRememberMe()
        const { data: profile } = await supabase
          .from('profiles').select('banned, is_admin').eq('id', data.user.id).single()
        if (profile?.banned) {
          await supabase.auth.signOut()
          error.value = '账户已被封禁'
          loading.value = false
          return
        }
      }
      successMessage.value = '登录成功！'
    } else {
      if (!agreeTerms.value) {
        error.value = '请先同意服务条款和隐私政策'
        loading.value = false
        return
      }
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (signUpError) throw signUpError
      if (data.user) {
        successMessage.value = '注册成功！请检查邮箱验证'
      }
    }
  } catch (err: any) {
    console.error('操作失败:', err)
    await supabase.rpc('fn_record_login_attempt', {
      p_email: email.value,
      p_ip: '',
      p_success: false,
    }).catch(() => {})
    error.value = mapError(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-block {
  max-width: 520px;
  margin: 0 auto;
}

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

.consent-row {
  margin-bottom: 14px;
}
.consent-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  cursor: pointer;
}
.consent-label a {
  color: var(--color-white);
  text-decoration: none;
}
.consent-label a:hover {
  text-decoration: underline;
}
.consent-label input {
  width: 16px;
  height: 16px;
  margin-top: 1px;
  cursor: pointer;
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

.action-row {
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
  margin-bottom: 18px;
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
}
.link-like:hover {
  color: var(--color-white);
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  margin-bottom: 14px;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}
.divider span { padding: 0; }

.social-row {
  display: flex;
  gap: 8px;
}
.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}
.social-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.08);
  border-color: var(--color-border-hover);
  color: var(--color-white);
}
.social-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>