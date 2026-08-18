<script setup lang="ts">
import ProjectTemplate from '@/components/ProjectTemplate.vue'
import { snishaperConfig } from '@/data/projects'
</script>

<template>
  <ProjectTemplate :config="snishaperConfig" />
</template>
