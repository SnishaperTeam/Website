<template>
  <TestTemplate
    :title="config.title"
    :subtitle="config.subtitle"
    :description="config.description"
    :instruction="config.instruction"
    :test-id="config.testId"
    :test-title="config.testTitle"
    :questions="config.questions"
    :options="config.options"
    :calculate-result-fn="config.calculateResult"
    :disclaimer-title="config.disclaimerTitle"
    :disclaimer="config.disclaimer"
    :analysis-title="config.analysisTitle"
    :dimension-labels="config.dimensionLabels"
    :get-badge="config.getBadge"
    :get-bars="config.getBars"
    :get-sections="config.getSections"
  />
</template>

<script setup lang="ts">
import TestTemplate from '@/components/TestTemplate.vue'
import { mbtiConfig } from '@/data/mbti'

const config = mbtiConfig
</script>
