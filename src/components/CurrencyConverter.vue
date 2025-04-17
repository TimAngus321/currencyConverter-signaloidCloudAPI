<script setup lang="ts">
import ComponentTitle from './ComponentTitle.vue'
import FormComponent from './FormComponent.vue'
</script>
<template>
  <ComponentTitle
    title="Currency Converter"
    text="Fill in the form below to get the conversion rate as a distribution between the min and max values. 
    You can choose between GBP to EUR or vice versa."
  />
  <FormComponent />
</template>

<style scoped></style>
