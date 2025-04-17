<script setup lang="ts">
import { useConversion } from '../composables/useConversion'

const {
  model,
  amount,
  minValue,
  maxValue,
  currency,
  minMaxValue,
  isAmountValid,
  isMinValueValid,
  isMaxValueValid,
  isMinMaxValid,
  handleSubmit
} = useConversion()

// If I have time move logic to useConversion so it's more reusable and cleaner here
</script>
<template>
  <div class="flex w-full">
    <form
      class="flex flex-col gap-2 justify-center justify-items-center w-full text-white"
      @submit.prevent="handleSubmit"
    >
      <div class="flex w-full gap-4 justify-items-center">
        <ToggleSwitch class="w-40" v-model="model" />
        <span v-if="!model">GBP to EUR conversion</span>
        <span v-else>EUR to GBP conversion</span>
      </div>
      <label for="Amount">Amount</label>
      <InputNumber
        v-model="amount"
        :invalid="amount === null"
        inputId="Amount"
        mode="currency"
        :currency="currency"
      />
      <Message v-if="!isAmountValid" class="text-xs" severity="error"
        >You must enter an amount</Message
      >
      <label for="Min Rate">Min Conversion Rate</label>
      <InputNumber
        inputId="Min Rate"
        v-model="minValue"
        :invalid="minValue === null"
        mode="currency"
        :currency="minMaxValue"
      />
      <Message v-if="!isMinValueValid" class="text-xs" severity="error"
        >You must enter a minimum conversion rate</Message
      >
      <label for="Max Rate">Max Conversion Rate</label>
      <InputNumber
        inputId="Max Rate"
        v-model="maxValue"
        :invalid="maxValue === null"
        mode="currency"
        :currency="minMaxValue"
      />
      <Message v-if="!isMaxValueValid" class="text-xs" severity="error"
        >You must enter a maximum conversion rate</Message
      >
      <Message v-if="!isMinMaxValid" class="text-xs" severity="error">
        The maximum conversion value must be greater than the minimum conversion value
      </Message>
      <Button class="w-40 flex justify-center" type="submit">Submit</Button>
    </form>
  </div>
</template>

<style scoped></style>
