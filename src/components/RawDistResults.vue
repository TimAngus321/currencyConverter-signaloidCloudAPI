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

</script>

<template>
  <ComponentTitle title="Distribution Result Here" />
  <output v-if="!isTaskOutputEmpty" class="flex justify-start">
    <img
      v-if="buildTaskStore.plotURL"
      :src="buildTaskStore.plotURL"
      alt="Plot Image"
      style="max-width: 80%; padding: 0; margin: 0; border-radius: 0;"
    />
  </output>
  <output v-else>No results available.</output>
</template>

