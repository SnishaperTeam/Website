<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ ./device --login</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">桌面端设备登录</span>
      </h1>
      <p class="text-dim" style="margin-top:12px; max-width:520px;">
        设备登录码用于授权 English Listen 桌面应用访问本账号。登录码 5 分钟内有效、仅可使用一次。
      </p>
    </section>

    <section class="mb-60" style="padding-left:40px; padding-right:40px;">
      <div class="term-block device-block">
        <div class="term-bar">
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span class="device-bar-title">device.sh</span>
        </div>
        <div class="term-body">
          <div class="term-line">generate-login-code</div>

          <template v-if="code">
            <div class="device-code">{{ code }}</div>
            <div class="term-line-out text-dim">{{ countdownText }}</div>
          </template>
          <template v-else>
            <div class="device-code device-code-idle">········</div>
            <div class="term-line-out text-dim">{{ hintText }}</div>
          </template>

          <div class="flex gap-12 mt-20">
            <button
              v-if="code"
              class="btn-geek"
              style="font-size:var(--font-size-xs);"
              @click="copyCode"
            >{{ copied ? '已复制 ✓' : '一键复制' }}</button>
            <button
              class="btn-geek"
              style="font-size:var(--font-size-xs);"
              :disabled="creating"
              @click="createCode"
            >{{ creating ? '生成中…' : code ? '重新生成' : '生成登录码' }}</button>
          </div>

          <div class="term-line-out mt-20 text-dim">
            打开桌面端「登录 → 设备登录」，粘贴登录码即可完成授权。
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isAuthenticated, loading, getToken } = useAuth()

const code = ref('')
const expiresAt = ref(0)
const creating = ref(false)
const copied = ref(false)
const nowSec = ref(Math.floor(Date.now() / 1000))
let timer: number | undefined
let copyTimer: number | undefined

const countdownText = computed(() => {
  const left = Math.max(0, expiresAt.value - nowSec.value)
  if (left <= 0) return '登录码已过期，请重新生成'
  const m = Math.floor(left / 60)
  const s = left % 60
  return `${m}:${String(s).padStart(2, '0')} 后失效`
})

const hintText = computed(() =>
  creating.value ? '正在生成…' : '点击下方按钮生成设备登录码',
)

async function createCode() {
  creating.value = true
  try {
    const res = await fetch('/api/devices/code', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    const data = (await res.json().catch(() => ({}))) as { code?: string; expiresAt?: number; error?: string }
    if (!res.ok || !data.code || !data.expiresAt) {
      code.value = ''
      throw new Error(data.error || '生成失败')
    }
    code.value = data.code
    expiresAt.value = data.expiresAt
    copied.value = false
    startTimer()
  } catch (e) {
    code.value = ''
    alert(e instanceof Error ? e.message : '生成失败')
  } finally {
    creating.value = false
  }
}

function startTimer() {
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(() => {
    nowSec.value = Math.floor(Date.now() / 1000)
    if (expiresAt.value && nowSec.value >= expiresAt.value) {
      code.value = ''
      expiresAt.value = 0
      stopTimer()
    }
  }, 1000)
}

function stopTimer() {
  if (timer) window.clearInterval(timer)
  timer = undefined
}

async function copyCode() {
  if (!code.value) return
  try {
    await navigator.clipboard.writeText(code.value)
  } catch {
    const input = document.createElement('textarea')
    input.value = code.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
  copied.value = true
  if (copyTimer) window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => (copied.value = false), 2000)
}

// 未登录 → 跳 /auth 登录后回跳 /device；已登录 → 自动生成登录码
watch(
  () => [isAuthenticated.value, loading.value] as const,
  ([authed, isLoading]) => {
    if (isLoading) return
    if (!authed) {
      stopTimer()
      router.replace('/auth?redirect=/device')
    } else if (!code.value && !creating.value) {
      createCode()
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  stopTimer()
  if (copyTimer) window.clearTimeout(copyTimer)
})
</script>

<style scoped>
.device-block {
  max-width: 460px;
}

.device-bar-title {
  margin-left: 8px;
  opacity: 0.55;
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.device-code {
  font-family: var(--font-mono);
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: 0.32em;
  margin: 18px 0 10px;
  user-select: all;
}

.device-code-idle {
  opacity: 0.25;
  user-select: none;
}
</style>
