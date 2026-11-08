<template>
  <div class="term-page">
    <ReadingProgress />

    <div class="term-window">
      <div class="term-bar">
        <span class="term-dot"></span>
        <span class="term-dot"></span>
        <span class="term-dot"></span>
        <span class="term-title">assessment: {{ testId }}</span>
      </div>

      <div class="term-body">
        <div class="term-cmd">
          <span class="prompt">$</span> <span class="cmd">cat assessments/{{ testId }}.yaml</span>
        </div>

        <header class="page-head">
          <h1 class="page-title">
            {{ title }}
            <button
              class="fav-btn"
              :class="{ 'fav-on': isFavorite(testId) }"
              @click="toggleFavorite({ id: testId, title: testTitle, description: subtitle, icon: 'mdi:clipboard-check-outline', color: '#FFB347', type: 'test' })"
              :title="isFavorite(testId) ? '取消收藏' : '收藏此测试'"
            >
              <Icon :icon="isFavorite(testId) ? 'mdi:heart' : 'mdi:heart-outline'" />
            </button>
          </h1>
          <p class="page-meta">{{ subtitle }}</p>
          <p class="page-desc" v-html="description"></p>
          <RouterLink to="/tests" class="back">
            <Icon icon="mdi:arrow-left" /> 返回评估列表
          </RouterLink>
        </header>

        <div v-if="showRestoreDialog" class="restore-line">
          <div class="restore-card">
            <Icon icon="mdi:history" class="restore-ico" />
            <div class="restore-body">
              <h4>检测到未完成的测试</h4>
              <p>{{ savedProgressInfo }}</p>
            </div>
            <div class="restore-acts">
              <button class="btn-geek" @click="restoreProgress">恢复</button>
              <button class="btn-geek" @click="discardProgress">重新开始</button>
            </div>
          </div>
        </div>

        <div v-if="!showResult" class="test-area">
          <div class="prog-bar">
            <div class="prog-fill" :style="{ width: progressPct + '%' }"></div>
            <span class="prog-label">{{ answeredCount }}/{{ questions.length }}</span>
          </div>

          <p class="instr">{{ instruction }}</p>

          <div
            v-for="(q, index) in questions"
            :key="q.id"
            class="q-block"
            :class="{ 'q-done': answers[q.id] !== undefined }"
          >
            <div class="q-head">
              <span class="q-num">{{ index + 1 }}</span>
              <span class="q-text">{{ q.text }}</span>
              <span v-if="q.dimension" class="q-tag">{{ dimensionLabel(q) }}</span>
            </div>
            <div class="q-opts">
              <button
                v-for="opt in q.options ?? options"
                :key="opt.value"
                type="button"
                class="opt"
                :class="{ 'opt-on': answers[q.id] === opt.value, 'opt-plain': !!q.options }"
                @click="selectAnswer(q.id, opt.value)"
              >
                <span v-if="!q.options" class="opt-score">{{ opt.value }}</span>
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="submit-line">
            <button
              class="btn-geek"
              :disabled="answeredCount < questions.length"
              @click="calculateResult"
            >
              查看结果
            </button>
            <span v-if="answeredCount < questions.length" class="submit-remind">
              还有 {{ questions.length - answeredCount }} 题未答
            </span>
          </div>
        </div>

        <div v-if="showResult" class="result-area">
          <div class="term-cmd">
            <span class="prompt">$</span>
            <span class="cmd">./score --id {{ testId }} --result {{ result?.level }}</span>
          </div>

          <div class="r-card">
            <div class="r-score-wrap">
              <div v-if="badge" class="r-badge">{{ badge }}</div>
              <template v-else>
                <div class="r-score">{{ totalScore }}</div>
                <div class="r-max">/ {{ maxScore }}</div>
              </template>
            </div>
            <div class="r-body">
              <div class="r-level">{{ result?.level }}</div>
              <p class="r-desc">{{ result?.description }}</p>
            </div>
          </div>

          <div v-if="bars.length" class="bars-section">
            <div class="sec-head">维度倾向</div>
            <div class="bar-list">
              <div v-for="bar in bars" :key="bar.key" class="bar-row">
                <div class="bar-head">
                  <span class="bar-pole" :class="{ 'bar-on': bar.leftDominant }">{{ bar.left }}</span>
                  <span class="bar-name">{{ bar.label }}</span>
                  <span class="bar-pole" :class="{ 'bar-on': !bar.leftDominant }">{{ bar.right }}</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" :style="{ width: bar.leftPercent + '%' }"></div>
                  <div class="bar-mid"></div>
                </div>
                <div class="bar-pct">
                  {{ bar.leftPercent }}% · {{ 100 - bar.leftPercent }}%
                </div>
              </div>
            </div>
          </div>

          <div v-if="showAnswerReview" class="review-section">
            <div class="sec-head">各项得分详情</div>
            <div class="review-grid">
              <div v-for="(q, index) in questions" :key="q.id" class="review-item">
                <span class="rev-q">Q{{ index + 1 }}</span>
                <span class="rev-text">{{ q.text }}</span>
                <span class="rev-s">+{{ answers[q.id] }}</span>
              </div>
            </div>
          </div>

          <div v-if="dimensions && dimensions.length" class="dims-section">
            <div class="sec-head">症状维度分析</div>
            <div class="dims-grid">
              <div v-for="dim in dimensions" :key="dim.name" class="dim-item">
                <div class="dim-head">
                  <Icon :icon="dim.icon" class="dim-ico" />
                  <span class="dim-name">{{ dim.name }}</span>
                  <span class="dim-val">{{ dim.score }}/{{ dim.maxScore }}</span>
                </div>
                <p class="dim-desc">{{ dim.description }}</p>
              </div>
            </div>
          </div>

          <div v-if="result?.analysis || (result?.suggestions && result.suggestions.length)" class="detail-section">
            <div class="sec-head">详细分析</div>
            <div class="detail-cols">
              <div v-if="result?.analysis" class="detail-block">
                <div class="detail-block-title">{{ analysisTitle }}</div>
                <p class="detail-text">{{ result.analysis }}</p>
              </div>
              <div v-if="result?.suggestions && result.suggestions.length" class="detail-block">
                <div class="detail-block-title">建议行动</div>
                <ul class="detail-list">
                  <li v-for="s in result.suggestions" :key="s">{{ s }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div v-if="sections.length" class="detail-section">
            <div class="sec-head">深度解读</div>
            <div class="sections-grid">
              <div v-for="sec in sections" :key="sec.title" class="detail-block">
                <div class="detail-block-title">{{ sec.title }}</div>
                <p v-if="sec.text" class="detail-text">{{ sec.text }}</p>
                <ul v-if="sec.items && sec.items.length" class="detail-list">
                  <li v-for="item in sec.items" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="notice">
            <Icon icon="mdi:alert" class="notice-ico" />
            <div>
              <strong>{{ disclaimerTitle }}</strong>
              <p>{{ disclaimer }}</p>
            </div>
          </div>

          <div class="r-actions">
            <button class="btn-geek" @click="resetTest">重新测试</button>
            <RouterLink to="/tests" class="btn-geek">查看其他测试</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type PropType } from 'vue'
import { RouterLink } from 'vue-router'
import ReadingProgress from '@/components/ReadingProgress.vue'
import { Icon } from '@iconify/vue'
import type { ResultBar, ResultSection } from '@/data/tests'
import { useFavorites, useHistory, useTestProgress } from '@/composables/useStore'

interface Question {
  id: number
  text: string
  dimension?: string
}

interface Option {
  value: number
  label: string
}

interface Dimension {
  name: string
  icon: string
  description: string
  score: number
  maxScore: number
}

interface Result {
  level: string
  description: string
  analysis: string
  suggestions: string[]
}

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  instruction: { type: String, required: true },
  testId: { type: String, required: true },
  testTitle: { type: String, required: true },
  questions: { type: Array as PropType<Question[]>, required: true },
  options: { type: Array as PropType<Option[]>, required: true },
  calculateResultFn: {
    type: Function as PropType<(answers: Record<number, number>) => Result>,
    required: true,
  },
  disclaimerTitle: { type: String, default: '重要说明' },
  disclaimer: { type: String, required: true },
  dimensions: { type: Array as PropType<Dimension[]>, default: () => [] },
  showAnswerReview: { type: Boolean, default: false },
  analysisTitle: { type: String, default: '测试说明' },
  dimensionLabels: { type: Object as PropType<Record<string, string>>, default: () => ({}) },
  getBadge: {
    type: Function as PropType<(answers: Record<number, number>) => string>,
    default: undefined,
  },
  getBars: {
    type: Function as PropType<(answers: Record<number, number>) => ResultBar[]>,
    default: undefined,
  },
  getSections: {
    type: Function as PropType<(answers: Record<number, number>) => ResultSection[]>,
    default: undefined,
  },
})

const answers = ref<Record<number, number>>({})
const showResult = ref(false)
const result = ref<Result | null>(null)
const showRestoreDialog = ref(false)
const savedProgressInfo = ref<string>('')

const { isFavorite, toggleFavorite, loadFavorites } = useFavorites()
const { addToHistory } = useHistory()
const { getProgress, saveProgress, clearProgress } = useTestProgress()

const answeredCount = computed(
  () => props.questions.filter((q) => answers.value[q.id] !== undefined).length,
)

const progressPct = computed(
  () => Math.round((answeredCount.value / props.questions.length) * 100),
)

const totalScore = computed(() =>
  props.questions.reduce((sum, q) => sum + (answers.value[q.id] ?? 0), 0),
)

const maxScore = computed(() =>
  props.questions.reduce((sum, q) => {
    const opts = q.options?.length ? q.options : props.options
    return sum + Math.max(...opts.map((o) => o.value), 0)
  }, 0),
)

const badge = computed(() => (props.getBadge ? props.getBadge(answers.value) : ''))
const bars = computed(() => (props.getBars ? props.getBars(answers.value) : []))
const sections = computed(() => (props.getSections ? props.getSections(answers.value) : []))

const dimensionLabel = (q: { dimension?: string }) => {
  if (!q.dimension) return ''
  return props.dimensionLabels[q.dimension] ?? q.dimension
}

const selectAnswer = (questionId: number, value: number) => {
  answers.value[questionId] = value
  answers.value = { ...answers.value }
  saveProgress(props.testId, answers.value, questionId)
}

const calculateResult = () => {
  result.value = props.calculateResultFn(answers.value)
  showResult.value = true
  clearProgress(props.testId)
  addToHistory({
    testId: props.testId,
    testTitle: props.testTitle,
    score: totalScore.value,
    maxScore: maxScore.value,
    level: result.value.level,
    completedAt: new Date().toISOString(),
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const restoreProgress = () => {
  const saved = getProgress(props.testId)
  if (saved) {
    answers.value = saved.answers
    showRestoreDialog.value = false
  }
}

const discardProgress = () => {
  clearProgress(props.testId)
  showRestoreDialog.value = false
}

onMounted(() => {
  loadFavorites()
  const saved = getProgress(props.testId)
  if (saved && Object.keys(saved.answers).length > 0) {
    const time = new Date(saved.savedAt).toLocaleString('zh-CN')
    savedProgressInfo.value = `${time}，已答 ${Object.keys(saved.answers).length} 题`
    showRestoreDialog.value = true
  }
})

defineExpose({ totalScore, answers })
</script>

<style scoped>
.term-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.term-window {
  width: 100%;
  max-width: 720px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.term-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid var(--color-border);
}

.term-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.2);
}

.term-title {
  margin-left: auto;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.term-body {
  padding: 2rem 1.5rem;
}

.term-cmd {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255,255,255,0.03);
  border-radius: var(--radius-sm);
}

.prompt {
  color: var(--color-text);
  margin-right: 0.5rem;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.page-meta {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.page-desc {
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 1.25rem;
  opacity: 0.8;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-decoration: none;
}
.back:hover {
  color: var(--color-text);
}

.fav-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  color: rgba(255,255,255,0.4);
  vertical-align: middle;
  margin-left: 0.5rem;
  padding: 0;
  line-height: 1;
  transition: color 0.2s, transform 0.2s;
}
.fav-btn:hover, .fav-on {
  color: var(--color-text);
  transform: scale(1.15);
}

.restore-line {
  margin-bottom: 1.5rem;
}

.restore-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.03);
}

.restore-ico {
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.restore-body {
  flex: 1;
}

.restore-body h4 {
  font-size: 0.95rem;
  font-weight: 400;
  margin-bottom: 0.2rem;
}

.restore-body p {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.restore-acts {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.prog-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 24px;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 0.75rem;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.prog-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: rgba(255,255,255,0.12);
  transition: width 0.4s ease;
}

.prog-label {
  position: relative;
  z-index: 1;
  font-size: 0.8rem;
  font-family: var(--font-mono);
  color: var(--color-text);
  margin-left: auto;
}

.instr {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.25rem;
  line-height: 1.6;
}

.q-block {
  margin-bottom: 1.25rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: border-color 0.2s;
}

.q-block.q-done {
  border-color: rgba(255,255,255,0.25);
}

.q-head {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.q-num {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  min-width: 1.5rem;
}

.q-text {
  flex: 1;
  font-size: 0.95rem;
}

.q-tag {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.q-opts {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.opt {
  flex: 1;
  min-width: 70px;
  padding: 0.6rem 0.5rem;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-sm);
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.85rem;
}

.opt:hover {
  border-color: rgba(255,255,255,0.35);
}

.opt-on {
  border-color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.1);
}

.opt-score {
  font-weight: 700;
  font-size: 1.1rem;
}

.opt-plain {
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.4rem;
  padding: 0.7rem 0.9rem;
  min-width: 160px;
  line-height: 1.5;
  text-align: left;
}

.submit-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-remind {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.sec-head {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  font-family: var(--font-mono);
}

.r-card {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
}

.r-score-wrap {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  flex-shrink: 0;
}

.r-score {
  font-size: 3rem;
  font-family: var(--font-mono);
  line-height: 1;
}

.r-max {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
}

.r-badge {
  font-size: 2.6rem;
  font-family: var(--font-mono);
  letter-spacing: 0.12em;
  line-height: 1;
}

.bars-section {
  margin-bottom: 1.5rem;
}

.bar-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.bar-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.25rem 0.75rem;
  align-items: center;
}

.bar-head {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  grid-column: 1 / -1;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.bar-pole {
  color: var(--color-text-faint);
  transition: color 0.2s;
}

.bar-pole.bar-on {
  color: var(--color-text);
}

.bar-name {
  font-family: inherit;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 0 auto;
}

.bar-track {
  position: relative;
  height: 6px;
  border: 1px solid var(--color-border);
  border-radius: 3px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  grid-column: 1;
}

.bar-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  transition: width 0.5s var(--ease-out-expo);
}

.bar-mid {
  position: absolute;
  left: 50%;
  top: 0;
  width: 1px;
  height: 100%;
  background: var(--color-border);
}

.bar-pct {
  grid-column: 2;
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--color-text-muted);
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.r-body {
  flex: 1;
}

.r-level {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.r-desc {
  font-size: 0.9rem;
  line-height: 1.7;
}

.review-grid {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.review-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.rev-q {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  min-width: 2.5rem;
}

.rev-text {
  flex: 1;
  font-size: 0.85rem;
}

.rev-s {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.dims-grid {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.dim-item {
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.dim-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.dim-ico {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
}

.dim-name {
  flex: 1;
  font-size: 0.95rem;
}

.dim-val {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: var(--color-text-secondary);
}

.dim-desc {
  font-size: 0.85rem;
  line-height: 1.5;
  opacity: 0.7;
  margin: 0;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-cols {
  display: grid;
  gap: 1.5rem;
}

.detail-block-title {
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}

.detail-text {
  font-size: 0.9rem;
  line-height: 1.8;
}

.detail-list {
  list-style: none;
  padding: 0;
}

.detail-list li {
  padding: 0.35rem 0;
  padding-left: 1.25rem;
  position: relative;
  font-size: 0.9rem;
}

.detail-list li::before {
  content: '>';
  position: absolute;
  left: 0;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.notice {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.02);
  margin-bottom: 2rem;
}

.notice-ico {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.notice strong {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.notice p {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.r-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}
</style>
