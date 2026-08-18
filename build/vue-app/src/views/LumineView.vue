<script setup lang="ts">
import ProjectTemplate from '@/components/ProjectTemplate.vue'
import { lumineConfig } from '@/data/projects'
</script>

<template>
  <ProjectTemplate :config="lumineConfig" />
</template>
