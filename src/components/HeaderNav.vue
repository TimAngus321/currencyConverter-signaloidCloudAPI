<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="sticky top-0 flex flex-row w-full border-b border-white-100 z-10 bg-black">
    <p class="w-full p-5 flex justify-start">Signaloid Currency Conversion Distribution</p>
    <nav class="w-full p-5 flex justify-end items-center gap-6">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/charts">Charts</RouterLink>
    </nav>
  </header>
</template>

<style scoped></style>
