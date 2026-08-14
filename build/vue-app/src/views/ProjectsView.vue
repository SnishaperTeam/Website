<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useTypewriter } from '@/composables/useTypewriter'
import { useStaggeredFade } from '@/composables/useStaggeredFade'

const { display, cursor, done } = useTypewriter('探索我们的开源项目。', 50)

const activeCategory = ref('all')

const categories = [
  { value: 'all', label: '全部', icon: 'mdi:view-grid' },
  { value: '网络', label: '网络', icon: 'mdi:web' },
  { value: '教育', label: '教育', icon: 'mdi:school' },
  { value: '系统', label: '系统', icon: 'mdi:desktop-mac' },
  { value: '游戏', label: '游戏', icon: 'mdi:gamepad-variant' },
]

const projects = [
  {
    id: 1,
    title: 'SniShaper',
    description: '基于 Go + Wails v3 的智能网络代理工具，集成 ECH 注入、TLS-RF 分片、QUIC 重建连接',
    category: '网络',
    link: '/snishaper',
    external: false,
  },
  {
    id: 2,
    title: 'English Listen WinUI',
    description: '现代化英语听写训练工具，WinUI 3 + C# + C++ 混合开发，MVVM 架构，Mica 材质',
    category: '教育',
    link: '/project/english-listen-winui',
    external: false,
  },
  {
    id: 3,
    title: 'English-Listen',
    description: '专业英语听写训练工具，基于 C++ 和 Qt6 开发的现代化听写软件',
    category: '教育',
    link: '/project/english-listen',
    external: false,
  },
  {
    id: 4,
    title: 'Lumine-For-Android',
    description: 'enimul 引擎驱动的 Clash 风格 Android 代理，VPN/TUN 管道 + GFWlist 智能分流',
    category: '网络',
    link: '/lumine',
    external: false,
  },
]

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') return projects
  return projects.filter(p => p.category === activeCategory.value)
})

const getCategoryCount = (cat: string) => projects.filter(p => p.category === cat).length

const { visible } = useStaggeredFade(projects.length, 120)
</script>

<template>
  <div>
    <section class="page-head">
      <h1>
        <span>$ ls projects/</span><br>
        <span class="typewriter" style="font-size:var(--font-size-lg);">{{ display }}</span>
        <span class="typewriter-cursor" :class="{ done }"></span>
      </h1>
    </section>

    <section class="mb-40">
      <div class="flex gap-12 flex-wrap" style="padding-left:40px;">
        <button
          v-for="cat in categories" :key="cat.value"
          class="tag-pill"
          :style="{
            color: activeCategory === cat.value ? 'rgba(255,255,255,0.85)' : 'var(--color-text-faint)',
            borderColor: activeCategory === cat.value ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
            cursor: 'pointer',
            background: activeCategory === cat.value ? 'rgba(255,255,255,0.06)' : 'transparent',
          }"
          @click="activeCategory = cat.value"
        >
          <Icon :icon="cat.icon" width="14" style="margin-right:4px" /> {{ cat.label }}
          <span v-if="cat.value !== 'all'" style="margin-left:4px; opacity:0.5;">({{ getCategoryCount(cat.value) }})</span>
        </button>
      </div>
    </section>

    <div class="divider-geek mb-40">
      <span>{{ filteredProjects.length }} results</span>
    </div>

    <section class="mb-60">
      <div class="grid-2">
        <div
          v-for="(p, i) in filteredProjects" :key="p.id"
          class="card-geek stagger-item" :class="{ visible: visible[i] }"
        >
          <div class="flex items-center justify-between mb-20">
            <span class="badge-geek">{{ p.category }}</span>
          </div>
          <h3 style="font-size:var(--font-size-base); font-weight:400; color:rgba(255,255,255,0.82);">{{ p.title }}</h3>
          <p class="text-dim" style="margin:12px 0 20px;">{{ p.description }}</p>
          <a v-if="p.external" :href="p.link" target="_blank" class="btn-geek" style="font-size:var(--font-size-xs);">
            <Icon icon="mdi:open-in-new" width="14" /> 查看
          </a>
          <RouterLink v-else :to="p.link" class="btn-geek" style="font-size:var(--font-size-xs);">
            <Icon icon="mdi:arrow-right" width="14" /> 查看
          </RouterLink>
        </div>
      </div>
      <div v-if="filteredProjects.length === 0" class="text-dim mt-40" style="padding-left:40px;">
        <Icon icon="mdi:folder-remove" width="20" style="margin-right:8px;" /> 没有匹配的项目。
      </div>
    </section>
  </div>
</template>