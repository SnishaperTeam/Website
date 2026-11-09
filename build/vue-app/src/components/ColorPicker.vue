<template>
  <div class="color-picker">
    <div class="row">
      <label class="swatch" :style="{ background: normalized }" title="打开选色器">
        <input type="color" :value="normalized" @input="onNative" />
      </label>
      <input
        v-model="text"
        class="value-input"
        type="text"
        spellcheck="false"
        placeholder="#FFB347 / rgb(255,179,71) / hsl(32,100%,64%)"
        @keyup.enter="commit"
        @blur="commit"
      />
      <button class="btn-geek small" type="button" @click="commit">应用</button>
    </div>
    <div class="presets">
      <button
        v-for="c in presets"
        :key="c"
        class="preset"
        :class="{ on: normalized.toLowerCase() === c.toLowerCase() }"
        :style="{ background: c }"
        :title="c"
        type="button"
        @click="apply(c)"
      ></button>
      <span class="hint">支持 HEX / RGB / HSL</span>
    </div>
    <p v-if="error" class="err">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const presets = [
  '#FFB347', '#FF6B6B', '#4ECDC4', '#78DCAA', '#F0C864',
  '#4C9BE8', '#E0E0E0', '#8A8A8A', '#1A1A1A', '#FFFFFF',
]

const text = ref(props.modelValue || '#FFB347')
const error = ref('')

const normalized = computed(() => {
  const parsed = parseColor(text.value)
  return parsed || parseColor(props.modelValue) || '#FFB347'
})

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function toHex(r: number, g: number, b: number) {
  const h = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase()
}

function parseColor(input: string): string | null {
  const value = input.trim().toLowerCase()
  if (!value) return null

  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(value)
  if (hex) {
    let v = hex[1]
    if (v.length === 3) v = v.split('').map((c) => c + c).join('')
    return `#${v.toUpperCase()}`
  }

  const rgb = /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/.exec(value)
  if (rgb) return toHex(Number(rgb[1]), Number(rgb[2]), Number(rgb[3]))

  const hsl = /^hsla?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%/.exec(value)
  if (hsl) {
    const h = ((Number(hsl[1]) % 360) + 360) % 360 / 360
    const s = clamp(Number(hsl[2]), 0, 100) / 100
    const l = clamp(Number(hsl[3]), 0, 100) / 100
    if (s === 0) return toHex(l * 255, l * 255, l * 255)
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    const hue = (t: number) => {
      let x = t
      if (x < 0) x += 1
      if (x > 1) x -= 1
      if (x < 1 / 6) return p + (q - p) * 6 * x
      if (x < 1 / 2) return q
      if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6
      return p
    }
    return toHex(hue(h + 1 / 3) * 255, hue(h) * 255, hue(h - 1 / 3) * 255)
  }

  return null
}

function apply(value: string) {
  error.value = ''
  text.value = value
  emit('update:modelValue', value)
}

function commit() {
  const parsed = parseColor(text.value)
  if (!parsed) {
    error.value = '无法识别颜色，请用 #RRGGBB、rgb(r,g,b) 或 hsl(h,s%,l%)'
    return
  }
  error.value = ''
  text.value = parsed
  emit('update:modelValue', parsed)
}

function onNative(event: Event) {
  const value = (event.target as HTMLInputElement).value.toUpperCase()
  apply(value)
}

watch(() => props.modelValue, (value) => {
  if (value && parseColor(value) && parseColor(text.value) !== parseColor(value)) {
    text.value = value
  }
})
</script>

<style scoped>
.color-picker {
  width: 100%;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.swatch {
  position: relative;
  width: 42px;
  height: 38px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  flex-shrink: 0;
  margin: 0;
  overflow: hidden;
}

.swatch input {
  position: absolute;
  inset: -8px;
  width: calc(100% + 16px);
  height: calc(100% + 16px);
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
  opacity: 0;
}

.value-input {
  flex: 1;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  outline: none;
}

.value-input:focus {
  border-color: rgba(255, 255, 255, 0.25);
}

.presets {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.preset {
  width: 22px;
  height: 22px;
  border: 1px solid var(--color-border);
  border-radius: 3px;
  cursor: pointer;
  padding: 0;
}

.preset.on {
  outline: 2px solid var(--color-text);
  outline-offset: 2px;
}

.hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
  margin-left: 6px;
}

.err {
  font-size: var(--font-size-xs);
  color: #ff7b72;
  margin-top: 8px;
}
</style>
