<script setup lang="ts">
import ComponentTitle from '../components/ComponentTitle.vue'
import { computed } from 'vue'
import { useBuildTaskAPI } from '../stores/buildTaskAPI'


// Get the store instance
const buildTaskStore = useBuildTaskAPI()

// Computed property to check if task output is empty
const isTaskOutputEmpty = computed(() => {
  const taskOutputRes = buildTaskStore.getTaskOutputRes
  return taskOutputRes === null
})

// Example of chart with primevue: https://stackblitz.com/edit/vue3-primevue-chart-labels?file=src%2FApp.vue
</script>

<template>
  <div>
    <ComponentTitle title="Blown Up Chart"/>
    <output v-if="!isTaskOutputEmpty">
      <img
        v-if="buildTaskStore.plotURL"
        :src="buildTaskStore.plotURL"
        alt="Plot Image"
        style="max-width: 100%; padding: 0; margin: 0; border-radius: 0;"
      />
    </output>
    <output v-else>No results available.</output>
  </div>
</template>

<style></style>
