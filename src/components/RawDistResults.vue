<script setup lang="ts">
import { computed } from 'vue'
import ComponentTitle from './ComponentTitle.vue'
import { useSignaloidAPIStore } from '../stores/signaloidAPI'


// Get the store instance
const sigAPIStore = useSignaloidAPIStore()

// Computed property to check if task output is empty
const isTaskOutputEmpty = computed(() => {
  const taskOutputRes = sigAPIStore.getTaskOutputRes
  return taskOutputRes === null
})
</script>

<template>
  <ComponentTitle title="Raw Distribution Results Here" />
  <output v-if="!isTaskOutputEmpty">
    <img
      v-if="sigAPIStore.plotURL"
      :src="sigAPIStore.plotURL"
      alt="Plot Image"
      style="max-width: 512px; padding: 0; margin: 0; border-radius: 0;"
    />
  </output>
  <output v-else>No results available.</output>
</template>

