<script setup lang="ts">
import CurrencyConverter from '../components/CurrencyConverter.vue'
import RawDistResults from '../components/RawDistResults.vue'
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
    <div class="flex flex-col gap-2">
      <CurrencyConverter />
    </div>
    <div>
      <RawDistResults />
    </div>
  </div>
</template>
