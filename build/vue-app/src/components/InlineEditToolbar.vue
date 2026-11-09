<template>
  <div v-if="active" class="inline-edit-toolbar">
    <div class="iet-head">
      <Icon icon="mdi:pencil-outline" width="14" /> 页面内联编辑
    </div>
    <div class="iet-tip">鼠标移到文字上直接修改，保存后对所有人生效</div>
    <div class="iet-actions">
      <button class="btn-geek primary" :disabled="saving" @click="$emit('save')">
        {{ saving ? '保存中...' : '保存' }}
      </button>
      <button class="btn-geek" :disabled="saving" @click="$emit('cancel')">取消</button>
    </div>
    <div v-if="message" class="iet-msg" :class="{ err: isError }">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  active: boolean
  saving: boolean
  message: string
  isError: boolean
}>()

defineEmits<{ save: []; cancel: [] }>()
</script>

<style scoped>
.inline-edit-toolbar {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 3000;
  width: 280px;
  padding: 16px 18px;
  border: 1px solid rgba(255, 179, 71, 0.35);
  border-radius: var(--radius-md);
  background: rgba(12, 12, 12, 0.96);
  box-shadow: 0 20px 60px -20px #000;
}

.iet-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-sm);
  color: #ffb347;
  font-family: var(--font-mono);
}

.iet-tip {
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  line-height: 1.6;
  margin-top: 8px;
}

.iet-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.iet-msg {
  font-size: var(--font-size-xs);
  color: var(--color-green);
  margin-top: 10px;
}

.iet-msg.err {
  color: #ff7b72;
}
</style>
