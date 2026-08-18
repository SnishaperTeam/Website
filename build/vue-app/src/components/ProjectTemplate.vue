<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import {
  useGithubReleases,
  officialReleases,
  versionNumber,
  findAsset,
  ghProxyUrl,
  formatDate,
} from '@/composables/useGithubRelease'
import type { SoftwareProjectConfig, DownloadButton } from '@/data/projects'

const props = defineProps<{ config: SoftwareProjectConfig }>()

const { releases, loading: releasesLoading, error: releasesError } = useGithubReleases(
  props.config.repo,
  props.config.workerBase,
  8,
)

const latest = computed(() => officialReleases(releases.value, 1)[0] || null)
const changelogReleases = computed(() => officialReleases(releases.value, 3))
const currentVersion = computed(() => versionNumber(latest.value?.tagName) || props.config.fallbackVersion)

const buttonUrl = (btn: DownloadButton): string => {
  if (btn.kind === 'static') return btn.url || ''
  const asset = findAsset(latest.value, btn.assetPattern || /./)
  const url = asset?.browserDownloadUrl || btn.fallbackUrl || ''
  return btn.proxy ? ghProxyUrl(url) : url
}

const versionInfoText = computed(() =>
  latest.value
    ? `${latest.value.tagName} · ${formatDate(latest.value.publishedAt)} 上架 · 四架构齐备`
    : `${props.config.fallbackVersion} · 2026-07-10 上架 · 四架构齐备`,
)

const showModal = ref(false)
const mobileMenuOpen = ref(false)
const carouselRef = ref<HTMLElement | null>(null)

let carouselRaf = 0

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  mobileMenuOpen.value = false
}

const toggleModal = () => {
  showModal.value = !showModal.value
  document.body.style.overflow = showModal.value ? 'hidden' : ''
}

const navItems = computed(() => Object.keys(props.config.navLabels))

const navLabel = (key: string) => props.config.navLabels[key] || key

const handleHeroClick = (btn: { action: 'modal' | 'scroll'; target?: string }) => {
  if (btn.action === 'modal') toggleModal()
  else if (btn.target) scrollTo(btn.target)
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('snip-section-visible')
      }
    })
  }, { threshold: 0.1 })
  document.querySelectorAll('.snip-section').forEach((el) => observer.observe(el))

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
  <div :class="config.rootClass">
    <section class="page-head snip-section">
      <div class="flex items-center gap-8 mb-20">
        <span class="pulse-dot"></span>
        <span class="text-faint" style="font-size:var(--font-size-xs);">v{{ currentVersion }} {{ config.versionTag }}</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:60px;flex-wrap:wrap;">
        <div style="flex:1;min-width:300px;">
          <h1 style="font-size:var(--font-size-2xl);line-height:1.15;margin-bottom:20px;">
            <span :class="config.gradientClass">{{ config.title }}</span>
            <br>{{ config.headline }}
          </h1>
          <p class="subtitle" style="font-size:var(--font-size-base);margin-bottom:32px;">
            {{ config.subtitle }}
          </p>
          <div class="flex gap-12 flex-wrap">
            <button
              v-for="btn in config.heroButtons" :key="btn.label"
              class="btn-geek"
              @click="handleHeroClick(btn)"
            >
              <Icon :icon="btn.icon" width="16" /> {{ btn.label }}
            </button>
          </div>
        </div>
        <div class="term-block" style="flex:1;min-width:280px;max-width:420px;">
          <div class="term-bar">
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span class="term-dot"></span>
            <span style="margin-left:8px;opacity:0.5;">{{ config.terminal.barTitle }}</span>
          </div>
          <div class="term-body" style="font-size:12px;">
            <div class="term-line">{{ config.terminal.command }}</div>
            <div class="term-line-out"><span class="pulse-dot"></span> {{ config.terminal.status }}</div>
            <div class="term-line-out" style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-top:8px;">
              <span v-for="stat in config.terminal.stats" :key="stat.label">
                {{ stat.label }}: <span style="color:var(--color-white);">{{ stat.version ? 'v' + currentVersion : stat.value }}</span>
              </span>
            </div>
            <div class="term-line" style="margin-top:8px;">exit 0</div>
            <span class="term-cursor-block"></span>
          </div>
        </div>
      </div>
    </section>

    <div class="divider-geek mb-60">
      <span>{{ config.divider }}</span>
    </div>

    <nav class="snip-subnav mb-60 snip-section">
      <span
        v-for="item in navItems" :key="item"
        class="tag-pill" style="cursor:pointer;text-transform:none;"
        @click="scrollTo(item)"
      >{{ navLabel(item) }}</span>
    </nav>

    <section id="features" class="snip-section mb-60">
      <h2 class="section-title-term">// advantages</h2>
      <div class="grid-3">
        <div v-for="f in config.features" :key="f.title" class="card-geek">
          <Icon :icon="f.icon" width="24" style="color:var(--color-white);margin-bottom:12px;" />
          <h3 style="font-size:var(--font-size-base);font-weight:400;color:var(--color-white);margin-bottom:8px;">{{ f.title }}</h3>
          <p class="text-dim">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <section id="tech" class="snip-section mb-60">
      <h2 class="section-title-term">// core technology</h2>
      <div class="grid-3 mb-40">
        <div v-for="card in config.techCards" :key="card.badge" class="card-geek">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span class="badge-geek">{{ card.badge }}</span>
            <span style="font-size:var(--font-size-xs);color:var(--color-white);">{{ card.tag }}</span>
          </div>
          <p class="text-dim" style="font-size:var(--font-size-sm);">{{ card.desc }}</p>
        </div>
      </div>
      <div class="card-geek" style="border-color:rgba(255,255,255,0.12);">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <Icon :icon="config.highlight.icon" width="20" style="color:var(--color-white);" />
          <span style="font-weight:500;">{{ config.highlight.title }}</span>
          <span class="text-dim" style="font-size:var(--font-size-xs);">{{ config.highlight.desc }}</span>
        </div>
      </div>
    </section>

    <section id="features-carousel" class="snip-section mb-60">
      <h2 class="section-title-term">// features</h2>
      <div ref="carouselRef" class="snip-carousel" style="display:flex;gap:16px;padding-bottom:8px;">
        <div v-for="(f, i) in config.features" :key="i" class="card-geek" style="min-width:260px;flex-shrink:0;">
          <Icon :icon="f.icon" width="20" style="color:var(--color-white);margin-bottom:12px;" />
          <h3 style="font-size:var(--font-size-base);font-weight:400;color:var(--color-white);margin-bottom:8px;">{{ f.title }}</h3>
          <p class="text-dim" style="font-size:var(--font-size-sm);">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <section id="faq" class="snip-section mb-60">
      <h2 class="section-title-term">// faq</h2>
      <div style="max-width:800px;">
        <div v-for="(faq, i) in config.faqs" :key="i" class="card-geek" style="margin-bottom:12px;padding:0;">
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
              <template v-else-if="faq.a1">
                <strong style="color:var(--color-white);">系统代理</strong>: {{ faq.a1 }}<br><br>
                <strong style="color:var(--color-white);">TUN</strong>: {{ faq.a2 }}
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
        <div v-for="step in config.steps" :key="step.num" class="card-geek snip-step-card">
          <div class="snip-step-num">{{ step.num }}</div>
          <h3 style="font-size:var(--font-size-base);font-weight:400;color:var(--color-white);margin-bottom:8px;">{{ step.title }}</h3>
          <p class="text-dim" style="font-size:var(--font-size-sm);margin-bottom:12px;">{{ step.desc }}</p>
          <div v-if="step.note" :style="step.note.type === 'mono' ? 'padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:2px;font-size:11px;color:var(--color-white);font-family:var(--font-mono);' : ''">
            <div v-if="step.note.type === 'dot'" style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--color-white);">
              <span style="width:6px;height:6px;border-radius:50%;background:var(--color-green);"></span>{{ step.note.text }}
            </div>
            <div v-else-if="step.note.type === 'badges'" style="display:flex;gap:6px;">
              <span v-for="b in step.note.badges" :key="b" class="badge-geek">{{ b }}</span>
            </div>
            <template v-else>{{ step.note.text }}</template>
          </div>
        </div>
      </div>
      <div class="card-geek">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
          <Icon icon="mdi:lightbulb-outline" width="18" style="color:var(--color-white);" />
          <span style="font-weight:500;">小贴士</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:var(--font-size-sm);color:var(--color-white);">
          <div v-for="(tip, i) in config.tips" :key="i" style="display:flex;align-items:flex-start;gap:8px;">
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
          <p class="text-dim" style="margin-bottom:24px;">{{ config.stackDesc }}</p>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div
              v-for="item in config.stackItems" :key="item.label"
              style="display:flex;align-items:center;gap:12px;"
            >
              <div style="width:32px;height:32px;background:rgba(255,255,255,0.06);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--color-white);">{{ item.label }}</div>
              <span style="font-size:var(--font-size-sm);">{{ item.text }}</span>
            </div>
          </div>
        </div>
        <div class="term-block">
          <div class="term-body" style="font-size:11px;">
            <div v-for="(row, i) in config.stackTermRows" :key="i" style="display:flex;align-items:center;gap:8px;padding:8px 0;">
              <span style="color:var(--color-white);width:80px;">{{ row.label }}</span>
              <span v-if="i !== config.stackTermRows.length - 1" style="flex:1;border-top:1px dashed var(--color-border);"></span>
              <span class="badge-geek" :style="row.badgeClass === 'ok' ? 'border-color:rgba(120,220,160,0.2);color:var(--color-green);' : (row.badgeClass === '' ? 'border-color:rgba(255,255,255,0.15);' : '')">{{ row.badge }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="changelog" class="snip-section mb-60">
      <h2 class="section-title-term">// changelog</h2>
      <div style="max-width:700px;">
        <div v-if="releasesLoading" class="text-dim" style="font-size:var(--font-size-sm);padding:12px 0;">正在从 GitHub 拉取更新日志...</div>
        <div v-else-if="releasesError" class="text-dim" style="font-size:var(--font-size-sm);padding:12px 0;">
          更新日志加载失败：{{ releasesError }} ·
          <a :href="config.releasesUrl" target="_blank" style="color:var(--color-white);">前往 GitHub Releases</a>
        </div>
        <template v-else>
          <div v-for="(r, i) in changelogReleases" :key="r.tagName" class="snip-cl-item" :class="{ 'snip-cl-latest': i === 0 }">
            <div class="snip-cl-dot"></div>
            <div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
                <span class="badge-geek" :class="{ 'badge-geek-latest': i === 0 }">{{ r.tagName }}</span>
                <span v-if="i === 0" style="font-size:11px;color:var(--color-white);">最新发行版 · {{ formatDate(r.publishedAt) }}</span>
                <span v-else style="font-size:11px;color:var(--color-text-dim);">{{ formatDate(r.publishedAt) }}</span>
                <a :href="r.htmlUrl" target="_blank" style="font-size:11px;color:var(--color-white);display:inline-flex;align-items:center;gap:4px;"><Icon icon="mdi:open-in-new" width="12" /> GitHub</a>
              </div>
              <div v-if="r.body" style="font-size:var(--font-size-sm);color:var(--color-white);">
                <MarkdownRenderer :content="r.body" />
              </div>
              <div v-else class="text-dim" style="font-size:var(--font-size-sm);">该版本没有附带更新说明。</div>
            </div>
          </div>
        </template>
        <div class="text-dim" style="font-size:var(--font-size-xs);text-align:center;margin-top:24px;">更多版本见 <a :href="config.releasesUrl" target="_blank" style="color:var(--color-white);">GitHub Releases</a></div>
      </div>
    </section>

    <section id="download" class="snip-section mb-60" style="text-align:center;">
      <div class="card-geek" style="max-width:600px;margin:0 auto;">
        <h2 style="font-size:var(--font-size-xl);font-weight:400;margin-bottom:16px;">{{ config.downloadTitle }}</h2>
        <p class="text-dim" style="margin-bottom:24px;">{{ config.downloadDesc }}</p>
        <button class="btn-geek" style="font-size:var(--font-size-base);padding:12px 32px;" @click="toggleModal">
          <Icon icon="mdi:download" width="18" /> {{ config.downloadCta }} (v{{ currentVersion }})
        </button>
        <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-top:16px;font-size:var(--font-size-xs);color:var(--color-white);">
          <template v-for="(f, i) in config.downloadFooter" :key="i">
            <span v-if="i > 0">|</span>
            <span style="display:flex;align-items:center;gap:6px;">
              <span v-if="i === 0" style="width:6px;height:6px;border-radius:50%;background:var(--color-green);"></span>{{ f }}
            </span>
          </template>
        </div>
      </div>
    </section>

    <div v-if="showModal" class="snip-modal-overlay" @click.self="toggleModal">
      <div class="card-geek snip-modal-content">
        <div class="snip-modal-head">
          <h3 style="font-size:var(--font-size-lg);font-weight:400;">{{ config.modalTitle }}</h3>
          <button class="btn-geek" style="padding:4px 12px;" @click="toggleModal"><Icon icon="mdi:close" width="16" /></button>
        </div>
        <div class="snip-modal-scroll">
          <div v-for="(card, ci) in config.downloadCards" :key="ci" class="card-geek" style="padding:20px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
              <Icon :icon="card.icon" width="24" style="color:var(--color-white);" />
              <span style="font-size:var(--font-size-base);font-weight:500;">{{ card.title }}</span>
            </div>
            <div v-if="card.buttons && card.buttons.length" style="display:flex;flex-direction:column;gap:8px;font-size:var(--font-size-sm);">
              <a
                v-for="(btn, bi) in card.buttons" :key="bi"
                :href="buttonUrl(btn)" target="_blank" class="btn-geek" style="justify-content:center;"
              >
                <Icon :icon="btn.icon" width="16" /> {{ btn.label }}
              </a>
            </div>
            <div
              v-if="card.versionInfo"
              style="font-size:var(--font-size-xs);color:var(--color-text-dim);"
            >{{ versionInfoText }}</div>
          </div>
          <div v-if="config.extraLinks && config.extraLinks.length" style="display:flex;flex-direction:column;gap:8px;font-size:var(--font-size-sm);">
            <a
              v-for="(link, li) in config.extraLinks" :key="li"
              :href="buttonUrl(link)" target="_blank" class="btn-geek" style="justify-content:center;"
            >
              <Icon :icon="link.icon" width="16" /> {{ link.label }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.snishaper-page,
.snishaper-page *,
.lumine-page,
.lumine-page * {
  color: var(--color-white) !important;
  font-family: 'Microsoft YaHei', '微软雅黑', sans-serif !important;
}

.snip-gradient,
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
