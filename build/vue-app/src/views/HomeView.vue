<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useTypewriter } from '@/composables/useTypewriter'
import { useParallaxTilt } from '@/composables/useParallaxTilt'
import { useStaggeredFade } from '@/composables/useStaggeredFade'

const { display, cursor, done } = useTypewriter('代码重塑世界。', 55)

const cardA = ref<HTMLElement | null>(null)
const cardB = ref<HTMLElement | null>(null)
const cardC = ref<HTMLElement | null>(null)
const { transform: ta, onMove: ma, onLeave: la } = useParallaxTilt(cardA, 10)
const { transform: tb, onMove: mb, onLeave: lb } = useParallaxTilt(cardB, 7)
const { transform: tc, onMove: mc, onLeave: lc } = useParallaxTilt(cardC, 7)

const features = [
  { icon: 'mdi:code-brackets', title: '系统编程', text: '底层 C++、Rust 与 WASM 工具链。' },
  { icon: 'mdi:lan-connect', title: '网络协议', text: '自定义协议设计、Socket 框架。' },
  { icon: 'mdi:cube-outline', title: '桌面应用', text: 'WinUI 3、Qt、跨平台开发。' },
  { icon: 'mdi:chart-line', title: '极致性能', text: '性能分析、SIMD、缓存优化。' },
]
const { visible: featVisible } = useStaggeredFade(features.length, 100)

const tags = ['C++', 'Rust', 'Vue 3', 'TypeScript', 'WebAssembly', '开源']
const { visible: tagVisible } = useStaggeredFade(tags.length, 80)

const uptime = ref(0)
const stars = ref(0)
const repoCount = ref(0)
const langCount = ref(0)
const topLang = ref('--')
const recentCommits = ref(0)
const activeRepos = ref<string[]>([])
const forks = ref(0)

onMounted(async () => {
  try {
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch('https://api.github.com/users/dongzheyu'),
      fetch('https://api.github.com/users/dongzheyu/repos?per_page=100&sort=updated'),
      fetch('https://api.github.com/users/dongzheyu/events?per_page=60'),
    ])
    const user = await userRes.json()
    const repos = await reposRes.json()
    const events = await eventsRes.json()

    const created = new Date(user.created_at)
    uptime.value = Math.floor((Date.now() - created.getTime()) / 86400000)
    repoCount.value = user.public_repos
    stars.value = repos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0)
    forks.value = repos.reduce((sum: number, r: any) => sum + r.forks_count, 0)

    const langs = new Set(repos.filter((r: any) => r.language).map((r: any) => r.language))
    langCount.value = langs.size

    const langCounts: Record<string, number> = {}
    repos.filter((r: any) => r.language).forEach((r: any) => {
      langCounts[r.language] = (langCounts[r.language] || 0) + 1
    })
    topLang.value = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '--'

    const repoSet = new Set<string>()
    let commitCount = 0
    events.forEach((e: any) => {
      if (e.type === 'PushEvent') {
        commitCount += e.payload?.size || 0
        const name = e.repo?.name?.replace('dongzheyu/', '') || ''
        if (name && repoSet.size < 5) repoSet.add(name)
      }
    })
    recentCommits.value = commitCount
    activeRepos.value = [...repoSet].slice(0, 5)
  } catch (_) {}
})
</script>

<template>
  <div>
    <section class="page-head flex" style="align-items: flex-start;">
      <div style="flex:1">
        <div class="flex items-center gap-8 mb-20">
          <span class="pulse-dot"></span>
          <span class="text-faint" style="font-size:var(--font-size-xs);">system online</span>
        </div>
        <h1>
          <span class="typewriter">{{ display }}</span>
          <span class="typewriter-cursor" :class="{ done }"></span>
        </h1>
        <p class="subtitle" style="transform: translateX(28px);">
          // SnishaperTeam &mdash; 系统软件、工具链与创意工程<br>
          // since 2021. 构建可编译的一切。
        </p>
        <div class="flex gap-12 mt-40">
          <RouterLink to="/projects" class="btn-geek">[ 查看项目 ]</RouterLink>
          <a href="https://github.com/dongzheyu" target="_blank" class="btn-geek">
            <Icon icon="mdi:github" width="16" /> Github
          </a>
        </div>
      </div>
      <div class="hero-visual" style="margin-left:auto; transform: translateY(-8px);">
        <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="400" height="240" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          <circle cx="20" cy="16" r="4" fill="#ff5f57" opacity="0.8"/>
          <circle cx="36" cy="16" r="4" fill="#ffbd2e" opacity="0.8"/>
          <circle cx="52" cy="16" r="4" fill="#28c840" opacity="0.8"/>
          <text x="68" y="20" fill="rgba(255,255,255,0.25)" font-size="10" font-family="monospace">bash — system_info</text>
          <line x1="0" y1="28" x2="400" y2="28" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

          <text x="16" y="50" fill="rgba(120,220,160,0.7)" font-size="11" font-family="monospace">$</text>
          <text x="28" y="50" fill="rgba(255,255,255,0.6)" font-size="11" font-family="monospace">neofetch</text>

          <text x="16" y="70" fill="rgba(255,255,255,0.35)" font-size="10" font-family="monospace">OS:       SnishaperTeam Linux x86_64</text>
          <text x="16" y="86" fill="rgba(255,255,255,0.35)" font-size="10" font-family="monospace">Kernel:   custom 6.8.0</text>
          <text x="16" y="102" fill="rgba(255,255,255,0.35)" font-size="10" font-family="monospace">Shell:    zsh 5.9</text>
          <text x="16" y="118" fill="rgba(255,255,255,0.35)" font-size="10" font-family="monospace">Uptime:   {{ uptime || '--' }} days</text>
          <text x="16" y="134" fill="rgba(255,255,255,0.35)" font-size="10" font-family="monospace">Packages: {{ (stars + forks) || '--' }} (aur)</text>

          <text x="16" y="158" fill="rgba(120,220,160,0.7)" font-size="11" font-family="monospace">$</text>
          <text x="28" y="158" fill="rgba(255,255,255,0.6)" font-size="11" font-family="monospace">ls -la projects/</text>

          <text x="16" y="178" fill="rgba(255,255,255,0.3)" font-size="10" font-family="monospace">drwxr-xr-x</text>
          <text x="88" y="178" fill="rgba(100,180,240,0.5)" font-size="10" font-family="monospace">SniShaper</text>
          <text x="16" y="194" fill="rgba(255,255,255,0.3)" font-size="10" font-family="monospace">drwxr-xr-x</text>
          <text x="88" y="194" fill="rgba(100,180,240,0.5)" font-size="10" font-family="monospace">English-Listen</text>
          <text x="16" y="210" fill="rgba(255,255,255,0.3)" font-size="10" font-family="monospace">drwxr-xr-x</text>
          <text x="88" y="210" fill="rgba(100,180,240,0.5)" font-size="10" font-family="monospace">blog</text>
          <text x="16" y="226" fill="rgba(255,255,255,0.3)" font-size="10" font-family="monospace">-rw-r--r--</text>
          <text x="88" y="226" fill="rgba(255,255,255,0.4)" font-size="10" font-family="monospace">README.md</text>
        </svg>
      </div>
    </section>

    <div class="divider-geek mb-60">
      <span>modules</span>
    </div>

    <section class="mb-60">
      <h2 class="section-title-term">// core/capabilities</h2>
      <div class="grid-2" style="padding-left: 40px;">
        <div
          v-for="(f, i) in features" :key="i"
          class="card-geek stagger-item" :class="{ visible: featVisible[i] }"
          :ref="i === 0 ? cardA : i === 1 ? cardB : i === 2 ? cardC : undefined"
          @mousemove="i === 0 ? ma : i === 1 ? mb : i === 2 ? mc : undefined"
          @mouseleave="i === 0 ? la : i === 1 ? lb : i === 2 ? lc : undefined"
          :style="{ transform: (i === 0 ? ta : i === 1 ? tb : i === 2 ? tc : 'none') }"
        >
          <Icon :icon="f.icon" width="28" style="color:rgba(255,255,255,0.45)" />
          <h3 style="font-size:var(--font-size-base); font-weight:400; margin:16px 0 8px; color:rgba(255,255,255,0.82);">{{ f.title }}</h3>
          <p class="text-dim">{{ f.text }}</p>
        </div>
      </div>
    </section>

    <section class="mb-60">
      <h2 class="section-title-term">// stack/dependencies</h2>
      <div class="flex gap-12 flex-wrap" style="padding-left: 40px;">
        <span
          v-for="(t, i) in tags" :key="t"
          class="tag-pill stagger-item" :class="{ visible: tagVisible[i] }"
        >{{ t }}</span>
      </div>
    </section>

    <section class="mb-60" style="padding-left: 40px;">
      <h2 class="section-title-term">// metrics/live</h2>
      <div class="term-block">
        <div class="term-bar">
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span class="term-dot"></span>
          <span style="margin-left:8px; opacity:0.5;">github_stats.sh</span>
        </div>
        <div class="term-body">
          <div class="term-line">fetch --remote dongzheyu</div>
          <div class="term-line-out">
            <span class="pulse-dot"></span> live &mdash; {{ uptime }}d uptime
          </div>
          <div class="term-line-out" style="margin-top:12px;">
            <span style="color:rgba(255,255,255,0.6);">github stats</span>
          </div>
          <div class="term-line-out" style="display:grid; grid-template-columns:1fr 1fr; gap:4px 24px; margin-top:8px;">
            <span>stars:   <span style="color:var(--color-white);">{{ stars }}</span></span>
            <span>forks:   <span style="color:var(--color-white);">{{ forks }}</span></span>
            <span>repos:   <span style="color:var(--color-white);">{{ repoCount }}</span></span>
            <span>langs:   <span style="color:var(--color-white);">{{ langCount }}</span></span>
            <span>top:     <span style="color:var(--color-white);">{{ topLang }}</span></span>
            <span>commits: <span style="color:var(--color-white);">{{ recentCommits }}</span></span>
          </div>
          <div v-if="activeRepos.length" class="term-line-out" style="margin-top:12px;">
            active repos: <span style="color:var(--color-white);">{{ activeRepos.join(', ') }}</span>
          </div>
          <div class="term-line" style="margin-top:12px;">exit 0</div>
          <span class="term-cursor-block"></span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-visual svg { width: 100%; max-width: 360px; height: auto; }
@media (max-width: 768px) {
  .hero-visual { display: none; }
}
</style>
