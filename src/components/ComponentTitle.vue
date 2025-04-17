<script setup lang="ts">
defineProps({ title: String, text: String })
</script>

<template>
  <div clas="flex flex-col">
    <h1 class="text-5xl py-2">
      {{ title }}
    </h1>
    <p class="py-2">{{ text }}</p>
  </div>
</template>

<style scoped></style>
