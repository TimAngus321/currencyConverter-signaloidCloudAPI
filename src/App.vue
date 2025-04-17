<script setup lang="ts">
import HeaderNav from './components/HeaderNav.vue'
</script>

<template>
  <HeaderNav />
  <main class="p-8 overflow-y-scroll">
    <RouterView />
  </main>
</template>

<style scoped></style>
