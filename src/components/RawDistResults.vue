<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import ComponentTitle from './ComponentTitle.vue'
import { useBuildTaskAPI } from '../stores/buildTaskAPI'

defineProps({ chartSize: String })

// Get the store instance
const buildTaskStore = useBuildTaskAPI()

// Extract reactive properties using storeToRefs
const { buildTaskStatus, plotURL, taskOutputRes } = storeToRefs(buildTaskStore)

// Computed property to check if task output is empty
const isTaskOutputEmpty = computed(() => {
  return taskOutputRes.value === null
})

</script>

<template>
  <ComponentTitle title="Distribution Results:" />
  <output v-if="!isTaskOutputEmpty && buildTaskStatus === 'Completed'" class="flex justify-start">
    <img
      v-if="plotURL"
      :src="plotURL"
      alt="Plot Image"
      :style="{ maxWidth: chartSize, padding: 0, margin: 0, borderRadius: 0 }"
    />
  </output>
   <output v-else-if="buildTaskStatus === 'Waiting'">
    Please complete the form and press the submit button. 
  </output>
  <output v-else-if="buildTaskStatus === 'Loading'">
    <Skeleton
    width="80%"
    height="18rem" />
  </output>
  <output v-else-if="buildTaskStatus === 'Error'">There was an error. Please try again.</output>
</template>

