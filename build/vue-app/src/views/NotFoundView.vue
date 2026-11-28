<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ cat /etc/not-found</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ display }}</span>
        <span class="typewriter-cursor" :class="{ done }"></span>
      </h1>
    </section>

    <section class="mb-60" style="padding-left:40px;">
      <div class="term-block">
        <div class="term-bar">
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span style="margin-left:8px; opacity:0.5;">404 — not_found</span>
        </div>
        <div class="term-body" style="text-align:center; padding:48px 32px;">
          <div style="font-size:var(--font-size-2xl); color:var(--color-white); letter-spacing:0.06em; font-weight:400;">
            4<span style="display:inline-block; animation: not-found-float 3s var(--ease-smooth) infinite; animation-delay:0.25s;">0</span>4
          </div>
          <div class="term-line-out" style="margin-top:20px; font-size:var(--font-size-base);">
            Error: page not found
          </div>
          <div class="term-line-out" style="margin-top:8px;">
            The requested resource does not exist or has been moved.
          </div>

          <div class="flex gap-12 mt-40" style="justify-content:center;">
            <RouterLink to="/" class="btn-geek">
              <Icon icon="mdi:home" width="14" /> 返回首页
            </RouterLink>
            <button @click="goBack" class="btn-geek">
              <Icon icon="mdi:arrow-left" width="14" /> 返回上一页
            </button>
          </div>

          <div class="divider-geek mt-40 mb-20">
            <span>suggestions</span>
          </div>

          <div class="flex gap-12" style="justify-content:center; flex-wrap:wrap;">
            <RouterLink to="/projects" class="btn-geek" style="font-size:var(--font-size-xs);">
              <Icon icon="mdi:folder" width="14" /> 项目展示
            </RouterLink>
            <RouterLink to="/blogs" class="btn-geek" style="font-size:var(--font-size-xs);">
              <Icon icon="mdi:newspaper-variant" width="14" /> 技术博客
            </RouterLink>
            <RouterLink to="/tests" class="btn-geek" style="font-size:var(--font-size-xs);">
              <Icon icon="mdi:clipboard-check" width="14" /> 心理评估
            </RouterLink>
          </div>

          <div class="term-line" style="margin-top:32px;">exit 1</div>
          <span class="term-cursor-block"></span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useTypewriter } from '@/composables/useTypewriter'

const { display, cursor, done } = useTypewriter('页面未找到 / Page Not Found', 50)
const router = useRouter()
const goBack = () => { if (window.history.length > 1) router.back(); else router.push('/') }
</script>

<style scoped>
@keyframes not-found-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
</style>
