<template>
  <div class="md-editor">
    <div class="toolbar">
      <div class="group">
        <button type="button" title="一级标题" @click="linePrefix('# ')">H1</button>
        <button type="button" title="二级标题" @click="linePrefix('## ')">H2</button>
        <button type="button" title="三级标题" @click="linePrefix('### ')">H3</button>
      </div>
      <div class="group">
        <button type="button" title="粗体 (Ctrl+B)" @click="wrap('**', '**', '粗体')"><Icon icon="mdi:format-bold" width="16" /></button>
        <button type="button" title="斜体 (Ctrl+I)" @click="wrap('*', '*', '斜体')"><Icon icon="mdi:format-italic" width="16" /></button>
        <button type="button" title="删除线" @click="wrap('~~', '~~', '删除线')"><Icon icon="mdi:format-strikethrough" width="16" /></button>
      </div>
      <div class="group">
        <button type="button" title="引用" @click="linePrefix('> ')"><Icon icon="mdi:format-quote-close" width="16" /></button>
        <button type="button" title="无序列表" @click="linePrefix('- ')"><Icon icon="mdi:format-list-bulleted" width="16" /></button>
        <button type="button" title="有序列表" @click="linePrefix('1. ')"><Icon icon="mdi:format-list-numbered" width="16" /></button>
        <button type="button" title="任务项" @click="linePrefix('- [ ] ')"><Icon icon="mdi:checkbox-blank-outline" width="16" /></button>
      </div>
      <div class="group">
        <button type="button" title="链接 (Ctrl+K)" @click="link"><Icon icon="mdi:link-variant" width="16" /></button>
        <button type="button" title="行内代码" @click="wrap('`', '`', 'code')"><Icon icon="mdi:code-tags" width="16" /></button>
        <button type="button" title="代码块" @click="wrap('\n```\n', '\n```\n', '代码')"><Icon icon="mdi:code-braces" width="16" /></button>
        <button type="button" title="分割线" @click="insert('\n---\n')"><Icon icon="mdi:minus" width="16" /></button>
      </div>
      <div class="group">
        <button type="button" :disabled="uploading" title="插入图片" @click="pickImage">
          <Icon :icon="uploading ? 'mdi:loading' : 'mdi:image-outline'" width="16" :class="{ spin: uploading }" />
          {{ uploading ? '上传中' : '图片' }}
        </button>
        <input ref="fileInput" class="hidden-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" @change="onFile" />
      </div>
      <span class="spacer"></span>
      <div class="group views">
        <button type="button" :class="{ on: view === 'edit' }" @click="view = 'edit'">编辑</button>
        <button type="button" :class="{ on: view === 'split' }" @click="view = 'split'">分栏</button>
        <button type="button" :class="{ on: view === 'preview' }" @click="view = 'preview'">预览</button>
      </div>
    </div>

    <div class="body" :class="view">
      <textarea
        v-if="view !== 'preview'"
        ref="area"
        :value="modelValue"
        rows="18"
        spellcheck="false"
        placeholder="在这里写 Markdown..."
        @input="onInput"
        @keydown="onKeydown"
      ></textarea>
      <div v-if="view !== 'edit'" class="preview">
        <MarkdownRenderer :content="modelValue || '*暂无内容*'" />
      </div>
    </div>

    <div class="foot">
      <span>{{ modelValue.length }} 字符</span>
      <span v-if="error" class="err">{{ error }}</span>
      <span v-else>图片上限 3 MB · 支持拖拽到编辑区外选择文件</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { uploadImage } from '@/composables/useMedia'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const area = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const view = ref<'edit' | 'split' | 'preview'>('split')
const uploading = ref(false)
const error = ref('')

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

function setValue(next: string, start: number, end: number) {
  emit('update:modelValue', next)
  requestAnimationFrame(() => {
    area.value?.focus()
    area.value?.setSelectionRange(start, end)
  })
}

function insert(text: string) {
  const el = area.value
  const value = props.modelValue
  const start = el?.selectionStart ?? value.length
  const end = el?.selectionEnd ?? value.length
  setValue(value.slice(0, start) + text + value.slice(end), start + text.length, start + text.length)
}

function wrap(before: string, after: string, placeholder: string) {
  const el = area.value
  const value = props.modelValue
  const start = el?.selectionStart ?? value.length
  const end = el?.selectionEnd ?? value.length
  const selected = value.slice(start, end) || placeholder
  const next = value.slice(0, start) + before + selected + after + value.slice(end)
  setValue(next, start + before.length, start + before.length + selected.length)
}

function linePrefix(prefix: string) {
  const el = area.value
  const value = props.modelValue
  const start = el?.selectionStart ?? value.length
  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
  setValue(next, start + prefix.length, start + prefix.length)
}

function link() {
  const el = area.value
  const value = props.modelValue
  const start = el?.selectionStart ?? value.length
  const end = el?.selectionEnd ?? value.length
  const selected = value.slice(start, end) || '链接文字'
  const text = `[${selected}](https://)`
  setValue(value.slice(0, start) + text + value.slice(end), start + 1, start + 1 + selected.length)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
    if (continueList(event)) return
  }
  if (!(event.ctrlKey || event.metaKey)) return
  const key = event.key.toLowerCase()
  if (key === 'b') {
    event.preventDefault()
    wrap('**', '**', '粗体')
  } else if (key === 'i') {
    event.preventDefault()
    wrap('*', '*', '斜体')
  } else if (key === 'k') {
    event.preventDefault()
    link()
  }
}

function continueList(event: KeyboardEvent): boolean {
  const el = area.value
  if (!el || el.selectionStart !== el.selectionEnd) return false
  const value = props.modelValue
  const pos = el.selectionStart
  const lineStart = value.lastIndexOf('\n', pos - 1) + 1
  const line = value.slice(lineStart, pos)

  const patterns: { re: RegExp; next: (m: RegExpExecArray) => string }[] = [
    { re: /^(\s*)- \[[ xX]\]\s+(.*)$/, next: (m) => `${m[1]}- [ ] ` },
    { re: /^(\s*)(\d+)\.\s+(.*)$/, next: (m) => `${m[1]}${Number(m[2]) + 1}. ` },
    { re: /^(\s*)([-*+])\s+(.*)$/, next: (m) => `${m[1]}${m[2]} ` },
    { re: /^(\s*)>\s+(.*)$/, next: (m) => `${m[1]}> ` },
  ]

  for (const p of patterns) {
    const m = p.re.exec(line)
    if (!m) continue
    event.preventDefault()
    const content = m[m.length - 1]
    if (!content.trim()) {
      const next = value.slice(0, lineStart) + value.slice(pos)
      setValue(next, lineStart, lineStart)
      return true
    }
    const addition = '\n' + p.next(m)
    setValue(value.slice(0, pos) + addition + value.slice(pos), pos + addition.length, pos + addition.length)
    return true
  }
  return false
}

function pickImage() {
  error.value = ''
  fileInput.value?.click()
}

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  uploading.value = true
  error.value = ''
  try {
    const url = await uploadImage(file, 'post')
    insert(`\n![${file.name.replace(/[\[\]]/g, '')}](${url})\n`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '上传失败'
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.md-editor {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.015);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 8px 10px;
  border-bottom: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.03);
}

.group {
  display: flex;
  gap: 2px;
  padding-right: 10px;
  border-right: 1px solid var(--color-border);
}

.group button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 30px;
  height: 28px;
  padding: 0 7px;
  border: 1px solid transparent;
  border-radius: 3px;
  background: none;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: 12px;
  cursor: pointer;
}

.group button:hover:not(:disabled) {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.08);
}

.group button.on {
  color: var(--color-text);
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.06);
}

.group button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spacer {
  flex: 1;
}

.views {
  border-right: none;
  padding-right: 0;
}

.hidden-input {
  display: none;
}

.body {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 380px;
}

.body.split {
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 900px) {
  .body.split {
    grid-template-columns: 1fr;
  }
}

textarea {
  width: 100%;
  min-height: 380px;
  resize: vertical;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-white);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  line-height: 1.8;
  padding: 16px;
}

.body.split textarea {
  border-right: 1px solid var(--color-border);
}

.preview {
  padding: 16px 20px;
  overflow-y: auto;
  max-height: 620px;
  color: var(--color-text-dim);
}

.foot {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 12px;
  border-top: 1px solid var(--color-border);
  font-size: 11px;
  color: var(--color-text-faint);
  font-family: var(--font-mono);
}

.err {
  color: #ff7b72;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
