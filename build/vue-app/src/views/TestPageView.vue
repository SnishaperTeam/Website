<template>
  <TestTemplate
    v-if="config"
    :title="config.title"
    :subtitle="config.subtitle"
    :description="config.description"
    :instruction="config.instruction"
    :test-id="config.testId"
    :test-title="config.testTitle"
    :questions="config.questions"
    :options="config.options"
    :calculate-result-fn="calculateResult"
    :show-answer-review="config.showAnswerReview ?? false"
    :disclaimer-title="config.disclaimerTitle ?? '重要说明'"
    :disclaimer="config.disclaimer"
    :analysis-title="config.analysisTitle ?? '测试说明'"
    :dimension-labels="config.dimensionLabels"
    :get-badge="config.getBadge"
    :get-bars="config.getBars"
    :get-sections="config.getSections"
    :dimensions="dimensions"
  />
  <div v-else class="page-head">
    <h2>未找到该测试</h2>
    <RouterLink to="/tests" class="btn-geek mt-20">返回测试列表</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import TestTemplate from '@/components/TestTemplate.vue'
import { testConfigs, type Dimension } from '@/data/tests'

const route = useRoute()
const config = computed(() => testConfigs[route.params.testId as string])

const dimensions = computed<Dimension[]>(() => {
  if (!config.value?.getDimensions) return []
  return config.value.getDimensions({} as Record<number, number>)
})

const calculateResult = (answers: Record<number, number>) => {
  const result = config.value!.calculateResult(answers)
  if (config.value?.getDimensions) {
    dimensions.value = config.value.getDimensions(answers)
  }
  return result
}
</script>
