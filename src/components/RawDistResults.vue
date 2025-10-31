<script setup lang="ts">
import { computed } from 'vue'
import ComponentTitle from './ComponentTitle.vue'
import { useBuildTaskAPI } from '../stores/buildTaskAPI'


// Get the store instance
const buildTaskStore = useBuildTaskAPI()

// Computed property to check if task output is empty
const isTaskOutputEmpty = computed(() => {
  const taskOutputRes = buildTaskStore.getTaskOutputRes
  return taskOutputRes === null
})

console.log(`plot url: ${buildTaskStore.plotURL}`)
</script>

<template>
  <ComponentTitle title="Raw Distribution Results Here" />
  <output v-if="!isTaskOutputEmpty">
    <img
      v-if="buildTaskStore.plotURL"
      :src="buildTaskStore.plotURL"
      alt="Plot Image"
      style="max-width: 512px; padding: 0; margin: 0; border-radius: 0;"
    />
  </output>
  <output v-else>No results available.</output>
</template>

