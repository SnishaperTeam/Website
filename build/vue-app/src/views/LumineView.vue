<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const showModal = ref(false)
const mobileMenuOpen = ref(false)
const carouselRef = ref<HTMLElement | null>(null)

let carouselRaf = 0

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  mobileMenuOpen.value = false
}

const toggleModal = () => { showModal.value = !showModal.value; document.body.style.overflow = showModal.value ? 'hidden' : '' }

const features = [
  { icon: 'mdi:cellphone-android', title: '配置订阅', desc: '支持订阅 URL 拉取远程配置，一键切换不同规则集，配置管理贴近 Clash 使用习惯。' },
  { icon: 'mdi:format-list-bulleted-square', title: '独立规则页', desc: '专属规则页面，可查看、编辑并新建规则，分流策略随时调整，即时生效。' },
  { icon: 'mdi:shield-lock-outline', title: 'GFWlist 黑名单驱动', desc: '基于 GFWlist 的黑名单分流模式，只代理被封锁的域名，日常流量直连，更省电更快。' },
  { icon: 'mdi:lan', title: 'VPN/TUN 管道', desc: '系统 VPN 接口接管流量，无需 root，所有应用开箱即用，配合 tun2socks 处理 TCP/UDP。' },
  { icon: 'mdi:dns', title: '灵活 Fake IP', desc: '可配置的 Fake IP 实现，配合 DNS 劫持与 DoH 上游，智能解析并分流域名请求。' },
  { icon: 'mdi:weather-night', title: 'MD3 深色模式', desc: 'Material Design 3 主题，支持深色模式，首页状态卡片实时显示连接状态与运行阶段。' },
  { icon: 'mdi:battery-charging', title: '增强保活', desc: '开机广播、前台服务、无障碍保活与看门狗多级兜底，后台连接更稳定。' },
  { icon: 'mdi:chip', title: '多架构支持', desc: 'arm64-v8a / armeabi-v7a / x86 / x86_64 全架构构建，minSdk 24 覆盖 Android 7.0+。' },
]

const faqs = [
  {
    q: 'Lumine-For-Android 和 SniShaper 是什么关系？',
    a: 'Lumine-For-Android（产品名 lumine-mobile）可以看作是 SniShaper 在移动端的功能扩展：桌面端使用 Go + Wails 构建，移动端则基于同一个 enimul 引擎，换成 Kotlin + gomobile 的原生 Android 实现，并提供 VPN/TUN 管道与移动端界面。'
  },
  {
    q: 'enimul 和原来的 lumine 是什么关系？',
    html: true,
    content: '<strong style="color:var(--color-white)">enimul</strong>&nbsp;是原&nbsp;<strong style="color:var(--color-white)">lumine</strong>&nbsp;（Codeberg 上的 solo connector）更名后的新仓库。Lumine-For-Android 以 enimul 为核心，并做了一部分本地修改：为优化移动端性能，删除原版规则中的部分 IP 段，并修改了分流方式。'
  },
  {
    q: '配置文件格式和上游兼容吗？',
    a: '兼容。配置文件的语法与上游 enimul 保持一致，原有配置可以直接沿用。当前处于早期阶段，部分模式可能工作不稳定，部分网站访问可能出现异常，欢迎反馈。'
  },
  {
    q: '黑名单驱动的分流模式是什么？',
    list: [
      { label: '黑名单模式', desc: '只对 GFWlist 中记录的域名走代理，其余流量直连，日常使用更省电、更快' },
      { label: '规则自定义', desc: '独立规则页可查看、编辑、新建规则，精确控制每个域名的走向' },
      { label: '订阅切换', desc: '通过订阅 URL 拉取配置，在规则集之间一键切换' },
    ]
  },
  {
    q: 'Fake IP 是怎么工作的？',
    a: '当域名匹配代理规则时，DNS 解析阶段直接返回一个伪造的虚拟 IP，流量进入 VPN 隧道后再由引擎还原真实域名进行连接。整个过程对应用透明，避免真实目标 IP 暴露在明文 DNS 查询中。'
  },
  {
    q: 'Lumine-For-Android 是否开源免费？',
    a: '是的，项目采用 AGPLv3 开源许可证，完全免费。源码托管在 GitHub（SniShaper/lumine-for-android），同时已上架 F-Droid，可直接从应用商店安装。'
  },
]

const changelogs = [
  {
    version: 'next',
    tag: 'master',
    title: '开发中 · 深色模式与保活',
    items: [
      'UI 升级 Material Design 3 主题，支持深色模式，重构首页',
      '增强保活：开机广播 + 前台服务 + 无障碍保活 + 看门狗多级兜底',
      '修复 tcpDialID / udpDialID 并发问题，改用 CAS 自旋',
      '修复配置 schema 漂移与日志写入冲突',
    ]
  },
  {
    version: '0.1.8',
    tag: 'latest',
    title: '迁移 enimul subtree v0.3.1',
    items: [
      '核心引擎升级为 enimul subtree v0.3.1',
      '修复配置文件中的拼写错误',
    ]
  },
  {
    version: '0.1.7',
    title: 'F-Droid 上架准备',
    items: [
      '添加 F-Droid 徽标',
      '上游仓库链接切换到 lzpls/enimul',
      '添加 lumine 备份仓库链接',
    ]
  },
  {
    version: '0.1.6',
    title: '应用图标与构建优化',
    items: [
      '禁用 DependencyInfoBlock',
      '生成并添加应用图标 icon.png',
    ]
  },
]

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add('snip-section-visible')
      }
    })
  }, { threshold: 0.1 })
  document.querySelectorAll('.snip-section').forEach(el => observer.observe(el))

  const carousel = carouselRef.value
  if (carousel) {
    const BASE_SPEED = 0.65
    let speed = 0, direction = 1, paused = false
    const tick = () => {
      if (!paused) {
        speed += (BASE_SPEED - speed) * 0.08
        carousel.scrollLeft += speed * direction
        const max = carousel.scrollWidth - carousel.clientWidth
        if (direction === 1 && carousel.scrollLeft >= max) { direction = -1; carousel.scrollLeft = max }
        else if (direction === -1 && carousel.scrollLeft <= 0) { direction = 1; carousel.scrollLeft = 0 }
      }
      carouselRaf = requestAnimationFrame(tick)
    }
    const onEnter = () => { paused = true; speed = 0 }
    const onLeave = () => { paused = false }
    carousel.addEventListener('mouseenter', onEnter)
    carousel.addEventListener('mouseleave', onLeave)
    carousel.style.scrollSnapType = 'none'
    carousel.style.overflowX = 'hidden'
    carouselRaf = requestAnimationFrame(tick)
  }
})

onUnmounted(() => {
  if (carouselRaf) cancelAnimationFrame(carouselRaf)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="lumine-page">
    <section class="page-head snip-section">
      <div class="flex items-center gap-8 mb-20">
        <span class="pulse-dot"></span>
        <span class="text-faint" style="font-size:var(--font-size-xs);">v0.1.8 Android 原生应用 · F-Droid 已上架 · 44 Stars</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:60px;flex-wrap:wrap;">
        <div style="flex:1;min-width:300px;">
          <h1 style="font-size:var(--font-size-2xl);line-height:1.15;margin-bottom:20px;">
            <span class="lumine-gradient">Lumine-For-Android</span>
            <br>Android 上的 Clash 风格代理
          </h1>
          <p class="subtitle" style="font-size:var(--font-size-base);margin-bottom:32px;">
            enimul 引擎 + VPN/TUN 管道，GFWlist 黑名单分流，订阅与规则管理一手掌控。
          </p>
          <div class="flex gap-12 flex-wrap">
            <button class="btn-geek" @click="toggleModal">
              <Icon icon="mdi:download" width="16" /> 获取 Lumine-For-Android
            </button>
            <button class="btn-geek" @click="scrollTo('tech')">
              <Icon icon="mdi:chip" width="16" /> 了解技术原理
            </button>
          </div>
        </div>
        <div class="term-block" style="flex:1;min-width:280px;max-width:420px;">
          <div class="term-bar">
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span style="margin-left:8px;opacity:0.5;">adb shell lumine status</span>
          </div>
          <div class="term-body" style="font-size:12px;">
            <div class="term-line">lumine --status</div>
            <div class="term-line-out"><span class="pulse-dot"></span> VPN 状态：已连接</div>
            <div class="term-line-out" style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-top:8px;">
              <span>核心: <span style="color:var(--color-white);">enimul</span></span>
              <span>分流: <span style="color:var(--color-white);">GFWlist</span></span>
              <span>DNS: <span style="color:var(--color-white);">Fake IP</span></span>
              <span>版本: <span style="color:var(--color-white);">v0.1.8</span></span>
            </div>
            <div class="term-line" style="margin-top:8px;">exit 0</div>
            <span class="term-cursor-block"></span>
          </div>
        </div>
      </div>
    </section>

    <div class="divider-geek mb-60">
      <span>// lumine-for-android</span>
    </div>

    <nav class="snip-subnav mb-60 snip-section">
      <span v-for="item in ['features','tech','faq','quickstart','changelog','download']" :key="item"
        class="tag-pill" style="cursor:pointer;text-transform:none;"
        @click="scrollTo(item)">{{ item === 'quickstart' ? '快速上手' : item === 'changelog' ? '更新日志' : { features: '核心优势', tech: '核心技术', faq: '常见问题', download: '下载' }[item] || item }}</span>
    </nav>

    <section id="features" class="snip-section mb-60">
      <h2 class="section-title-term">// advantages</h2>
      <div class="grid-3">
        <div class="card-geek">
          <Icon icon="mdi:cellphone-android" width="24" style="color:var(--color-white);margin-bottom:12px;" />
          <h3 style="font-size:var(--font-size-base);font-weight:400;color:var(--color-white);margin-bottom:8px;">Android 原生实现</h3>
          <p class="text-dim">Kotlin + gomobile 构建，Go 引擎编译为 AAR 嵌入应用，无需 root，系统 VPN 接口接管全部流量。</p>
        </div>
        <div class="card-geek">
          <Icon icon="mdi:swap-horizontal-bold" width="24" style="color:var(--color-white);margin-bottom:12px;" />
          <h3 style="font-size:var(--font-size-base);font-weight:400;color:var(--color-white);margin-bottom:8px;">Clash 风格配置管理</h3>
          <p class="text-dim">订阅 URL 拉取配置、独立规则页编辑规则、多配置一键切换，使用习惯贴近 Clash 用户。</p>
        </div>
        <div class="card-geek">
          <Icon icon="mdi:shield-search" width="24" style="color:var(--color-white);margin-bottom:12px;" />
          <h3 style="font-size:var(--font-size-base);font-weight:400;color:var(--color-white);margin-bottom:8px;">GFWlist 智能分流</h3>
          <p class="text-dim">黑名单驱动：只代理被封锁域名，日常流量直连。配合灵活 Fake IP，解析与分流都更聪明。</p>
        </div>
      </div>
    </section>

    <section id="tech" class="snip-section mb-60">
      <h2 class="section-title-term">// core technology</h2>
      <div class="grid-3 mb-40">
        <div class="card-geek">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span class="badge-geek">enimul</span>
            <span style="font-size:var(--font-size-xs);color:var(--color-white);">Go 核心引擎</span>
          </div>
          <p class="text-dim" style="font-size:var(--font-size-sm);">前身是 lumine（solo connector）。经 gomobile 编译为 LumineCore.aar 嵌入 Android 应用，处理拨号、规则匹配与 DNS 解析。</p>
        </div>
        <div class="card-geek">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span class="badge-geek">TUN/VPN</span>
            <span style="font-size:var(--font-size-xs);color:var(--color-white);">基于 tun2socks</span>
          </div>
          <p class="text-dim" style="font-size:var(--font-size-sm);">系统 VPN 服务建立 TUN 虚拟网卡，流量经 tun2socks v2 转换为 TCP/UDP 会话交给核心代理，应用无需任何配置。</p>
        </div>
        <div class="card-geek">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span class="badge-geek">Fake IP</span>
            <span style="font-size:var(--font-size-xs);color:var(--color-white);">DNS 劫持 + DoH</span>
          </div>
          <p class="text-dim" style="font-size:var(--font-size-sm);">对代理域名的 DNS 查询返回虚拟 IP，隧道内还原真实域名连接。支持 DoH 上游、DNS 劫持与缓存，解析更快更隐蔽。</p>
        </div>
      </div>
      <div class="card-geek" style="border-color:rgba(255,255,255,0.12);">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <Icon icon="mdi:battery-charging" width="20" style="color:var(--color-white);" />
          <span style="font-weight:500;">增强保活</span>
          <span class="text-dim" style="font-size:var(--font-size-xs);">开机广播 + 前台服务 + 无障碍保活 + 看门狗定时重启，多级兜底维持后台连接。</span>
        </div>
      </div>
    </section>

    <section id="features-carousel" class="snip-section mb-60">
      <h2 class="section-title-term">// features</h2>
      <div ref="carouselRef" class="snip-carousel" style="display:flex;gap:16px;padding-bottom:8px;">
        <div v-for="(f, i) in features" :key="i" class="card-geek" style="min-width:260px;flex-shrink:0;">
          <Icon :icon="f.icon" width="20" style="color:var(--color-white);margin-bottom:12px;" />
          <h3 style="font-size:var(--font-size-base);font-weight:400;color:var(--color-white);margin-bottom:8px;">{{ f.title }}</h3>
          <p class="text-dim" style="font-size:var(--font-size-sm);">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <section id="faq" class="snip-section mb-60">
      <h2 class="section-title-term">// faq</h2>
      <div style="max-width:800px;">
        <div v-for="(faq, i) in faqs" :key="i" class="card-geek" style="margin-bottom:12px;padding:0;">
          <details class="snip-faq-details" style="padding:20px 24px;">
            <summary style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;list-style:none;font-weight:500;">
              <span>{{ faq.q }}</span>
              <Icon icon="mdi:chevron-down" width="18" style="transition:transform 0.3s;color:var(--color-white);" class="snip-faq-chevron" />
            </summary>
            <div style="margin-top:16px;font-size:var(--font-size-sm);color:var(--color-white);line-height:1.8;border-top:1px solid var(--color-border);padding-top:16px;">
              <template v-if="faq.html">
                <span v-html="faq.content"></span>
              </template>
              <template v-else-if="faq.list">
                <ul style="list-style:none;padding:0;">
                  <li v-for="(item, j) in faq.list" :key="j" style="padding:6px 0;">
                    <strong style="color:var(--color-white);">{{ item.label }}</strong>: {{ item.desc }}
                  </li>
                </ul>
              </template>
              <template v-else>
                {{ faq.a }}
              </template>
            </div>
          </details>
        </div>
      </div>
    </section>

    <section id="quickstart" class="snip-section mb-60">
      <h2 class="section-title-term">// quickstart</h2>
      <div class="grid-3 mb-40">
        <div class="card-geek snip-step-card">
          <div class="snip-step-num">1</div>
          <h3 style="font-size:var(--font-size-base);font-weight:400;color:var(--color-white);margin-bottom:8px;">下载安装</h3>
          <p class="text-dim" style="font-size:var(--font-size-sm);margin-bottom:12px;">从 F-Droid 或 GitHub Releases 获取 APK，安装到 Android 7.0 及以上设备。</p>
          <div style="padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:2px;font-size:11px;color:var(--color-white);font-family:var(--font-mono);">arm64-v8a / armeabi-v7a / x86 / x86_64</div>
        </div>
        <div class="card-geek snip-step-card">
          <div class="snip-step-num">2</div>
          <h3 style="font-size:var(--font-size-base);font-weight:400;color:var(--color-white);margin-bottom:8px;">导入订阅</h3>
          <p class="text-dim" style="font-size:var(--font-size-sm);margin-bottom:12px;">在「配置订阅」页面添加订阅 URL 拉取配置，或直接使用内置配置，Clash 风格管理。</p>
          <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--color-white);"><span style="width:6px;height:6px;border-radius:50%;background:var(--color-green);"></span>配置切换即时生效</div>
        </div>
        <div class="card-geek snip-step-card">
          <div class="snip-step-num">3</div>
          <h3 style="font-size:var(--font-size-base);font-weight:400;color:var(--color-white);margin-bottom:8px;">启动代理</h3>
          <p class="text-dim" style="font-size:var(--font-size-sm);margin-bottom:12px;">在首页点击开启 VPN，授权系统 VPN 请求后即可全局代理，GFWlist 规则自动分流。</p>
          <div style="display:flex;gap:6px;">
            <span class="badge-geek">Fake IP</span>
            <span class="badge-geek">DoH</span>
            <span class="badge-geek">GFWlist</span>
          </div>
        </div>
      </div>
      <div class="card-geek">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
          <Icon icon="mdi:lightbulb-outline" width="18" style="color:var(--color-white);" />
          <span style="font-weight:500;">小贴士</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:var(--font-size-sm);color:var(--color-white);">
          <div v-for="(tip, i) in ['黑名单模式只代理被封锁域名，日常流量直连更省电','规则页面支持查看、编辑、新建，分流策略随时调整','日志页面可实时查看连接记录，便于排查问题','无障碍保活可提升后台稳定性，按需开启']" :key="i" style="display:flex;align-items:flex-start;gap:8px;">
            <span style="color:var(--color-white);">-</span>
            <span>{{ tip }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="snip-section mb-60">
      <h2 class="section-title-term">// stack</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;">
        <div>
          <p class="text-dim" style="margin-bottom:24px;">Kotlin + Jetpack Compose 构建 Material Design 3 界面。Go 引擎 enimul 负责代理核心与分流逻辑，经 gomobile 编译为 AAR 嵌入。tun2socks v2 提供 TUN 到会话的转换管道。</p>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div v-for="item in [{label:'Kotlin',text:'Jetpack Compose · Material 3'},{label:'Go',text:'enimul 核心引擎'},{label:'gomobile',text:'编译为 LumineCore.aar'},{label:'tun2socks',text:'TUN 网络管道'},{label:'AGPLv3',text:'开源免费'}]" :key="item.label" style="display:flex;align-items:center;gap:12px;">
              <div style="width:32px;height:32px;background:rgba(255,255,255,0.06);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--color-white);">{{ item.label }}</div>
              <span style="font-size:var(--font-size-sm);">{{ item.text }}</span>
            </div>
          </div>
        </div>
        <div class="term-block">
          <div class="term-body" style="font-size:11px;">
            <div style="display:flex;align-items:center;gap:8px;padding:8px 0;">
              <span style="color:var(--color-white);width:80px;">本地应用</span>
              <span style="flex:1;border-top:1px dashed var(--color-border);"></span>
              <span class="badge-geek" style="border-color:rgba(255,255,255,0.15);">直连</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;padding:8px 0;">
              <span style="color:var(--color-white);width:auto;min-width:80px;">Lumine-For-Android</span>
              <span style="padding:4px 10px;background:rgba(255,255,255,0.05);border-radius:2px;">VPN/TUN + enimul</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;padding:8px 0;">
              <span style="color:var(--color-white);width:80px;"></span>
              <span style="flex:1;border-top:1px dashed var(--color-border);"></span>
              <span class="badge-geek">GFWlist 命中</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;padding:8px 0;">
              <span style="color:var(--color-white);width:80px;">目标网站</span>
              <span style="flex:1;border-top:1px dashed var(--color-border);"></span>
              <span class="badge-geek" style="border-color:rgba(120,220,160,0.2);color:var(--color-green);">代理</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="changelog" class="snip-section mb-60">
      <h2 class="section-title-term">// changelog</h2>
      <div style="max-width:700px;">
        <div v-for="(cl, i) in changelogs" :key="i" class="snip-cl-item" :class="{ 'snip-cl-latest': i === 0 }">
          <div class="snip-cl-dot"></div>
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
              <span class="badge-geek" :class="{ 'badge-geek-latest': i === 0 }">v{{ cl.version }}</span>
              <span v-if="cl.tag === 'latest'" style="font-size:11px;color:var(--color-white);">最新发行版</span>
              <span v-else-if="cl.tag === 'master'" style="font-size:11px;color:var(--color-green);">master 分支 · 未发布</span>
            </div>
            <h3 style="font-size:var(--font-size-base);font-weight:400;color:var(--color-white);margin-bottom:8px;">{{ cl.title }}</h3>
            <ul style="list-style:none;padding:0;font-size:var(--font-size-sm);color:var(--color-white);">
              <li v-for="(item, j) in cl.items" :key="j" style="display:flex;align-items:flex-start;gap:8px;padding:3px 0;">
                <span style="color:var(--color-white);">-</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="text-dim" style="font-size:var(--font-size-xs);text-align:center;margin-top:24px;">更多版本见 <a href="https://github.com/SniShaper/lumine-for-android/releases" target="_blank" style="color:var(--color-white);">GitHub Releases</a></div>
      </div>
    </section>

    <section id="download" class="snip-section mb-60" style="text-align:center;">
      <div class="card-geek" style="max-width:600px;margin:0 auto;">
        <h2 style="font-size:var(--font-size-xl);font-weight:400;margin-bottom:16px;">把代理装进口袋</h2>
        <p class="text-dim" style="margin-bottom:24px;">获取 Lumine-For-Android。AGPLv3 开源，完全免费。</p>
        <button class="btn-geek" style="font-size:var(--font-size-base);padding:12px 32px;" @click="toggleModal">
          <Icon icon="mdi:download" width="18" /> 下载 Android APK (v0.1.8)
        </button>
        <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-top:16px;font-size:var(--font-size-xs);color:var(--color-white);">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:6px;height:6px;border-radius:50%;background:var(--color-green);"></span>Android 7.0+</span>
          <span>|</span>
          <span>F-Droid</span>
          <span>|</span>
          <span>开源项目</span>
        </div>
      </div>
    </section>

    <div v-if="showModal" class="snip-modal-overlay" @click.self="toggleModal">
      <div class="card-geek snip-modal-content">
        <div class="snip-modal-head">
          <h3 style="font-size:var(--font-size-lg);font-weight:400;">选择获取方式</h3>
          <button class="btn-geek" style="padding:4px 12px;" @click="toggleModal"><Icon icon="mdi:close" width="16" /></button>
        </div>
        <div class="snip-modal-scroll">
          <div class="card-geek" style="padding:20px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
              <Icon icon="mdi:cellphone-android" width="24" style="color:var(--color-white);" />
              <span style="font-size:var(--font-size-base);font-weight:500;">F-Droid 应用商店</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;font-size:var(--font-size-sm);">
              <a href="https://f-droid.org/packages/com.moi.lumine" target="_blank" class="btn-geek" style="justify-content:center;">
                <Icon icon="mdi:shield-check" width="16" /> F-Droid 页面下载
              </a>
              <div style="font-size:var(--font-size-xs);color:var(--color-text-dim);">0.1.8 · 2026-07-10 上架 · 四架构齐备</div>
            </div>
          </div>
          <div class="card-geek" style="padding:20px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
              <Icon icon="mdi:cellphone" width="24" style="color:var(--color-white);" />
              <span style="font-size:var(--font-size-base);font-weight:500;">arm64-v8a APK（主流设备）</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;font-size:var(--font-size-sm);">
              <a href="https://github.com/SniShaper/lumine-for-android/releases/download/v0.1.8/lumine-v0.1.8-app-arm64-v8a-release.apk" target="_blank" class="btn-geek" style="justify-content:center;">
                <Icon icon="mdi:github" width="16" /> GitHub 原链下载
              </a>
              <a href="https://v6.gh-proxy.org/https://github.com/SniShaper/lumine-for-android/releases/download/v0.1.8/lumine-v0.1.8-app-arm64-v8a-release.apk" target="_blank" class="btn-geek" style="justify-content:center;">
                <Icon icon="mdi:flash" width="16" /> 加速站下载
              </a>
            </div>
          </div>
          <div class="card-geek" style="padding:20px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
              <Icon icon="mdi:cellphone-android" width="24" style="color:var(--color-white);" />
              <span style="font-size:var(--font-size-base);font-weight:500;">x86_64 APK（模拟器）</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;font-size:var(--font-size-sm);">
              <a href="https://github.com/SniShaper/lumine-for-android/releases/download/v0.1.8/lumine-v0.1.8-app-x86_64-release.apk" target="_blank" class="btn-geek" style="justify-content:center;">
                <Icon icon="mdi:github" width="16" /> GitHub 原链下载
              </a>
              <a href="https://v6.gh-proxy.org/https://github.com/SniShaper/lumine-for-android/releases/download/v0.1.8/lumine-v0.1.8-app-x86_64-release.apk" target="_blank" class="btn-geek" style="justify-content:center;">
                <Icon icon="mdi:flash" width="16" /> 加速站下载
              </a>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:var(--font-size-sm);">
            <a href="https://github.com/SniShaper/lumine-for-android/releases" target="_blank" class="btn-geek" style="justify-content:center;">
              <Icon icon="mdi:github" width="16" /> 全部 ABI 与历史版本
            </a>
            <a href="https://github.com/SniShaper/lumine-for-android" target="_blank" class="btn-geek" style="justify-content:center;">
              <Icon icon="mdi:code-tags" width="16" /> 查看源码
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lumine-page,
.lumine-page * {
  color: var(--color-white) !important;
  font-family: 'Microsoft YaHei', '微软雅黑', sans-serif !important;
}

.lumine-gradient {
  color: var(--color-white);
}

.snip-section {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s var(--ease-out-expo), transform 0.6s var(--ease-out-expo);
}
.snip-section-visible {
  opacity: 1;
  transform: translateY(0);
}

.snip-subnav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.snip-carousel {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.snip-carousel::-webkit-scrollbar { height: 3px; }
.snip-carousel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

.snip-faq-details[open] .snip-faq-chevron {
  transform: rotate(180deg);
}

.snip-cl-item {
  position: relative;
  padding-left: 28px;
  padding-bottom: 28px;
  border-left: 2px solid var(--color-border);
}
.snip-cl-dot {
  position: absolute;
  left: -6px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);
}
.badge-geek-latest {
  border-color: rgba(255,255,255,0.25) !important;
  color: var(--color-white) !important;
}

.snip-step-card {
  display: flex;
  flex-direction: column;
}
.snip-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border-hover);
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
}

.snip-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.snip-modal-content {
  max-width: 480px;
  width: 100%;
  padding: 32px;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}
.snip-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-shrink: 0;
}
.snip-modal-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 4px;
}
.snip-modal-scroll > * {
  flex-shrink: 0;
}
.snip-modal-scroll::-webkit-scrollbar { width: 3px; }
.snip-modal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

@media (max-width: 768px) {
  .snip-subnav { gap: 4px; }
  .snip-modal-content { padding: 24px; max-height: calc(100vh - 24px); }
}
</style>
