import { ref, computed } from 'vue'
import { useSigAPIComposable } from '@/composables/useSignaloidAPICalls'
import { useBuildTaskAPI } from '../stores/buildTaskAPI'
import { useCreateBuild } from './useCreateBuild'

export function useConversion() {
  const { prepCreateTask } = useSigAPIComposable()
  const { buildTask } = useCreateBuild()

  const model = ref<boolean>(false)
  const amount = ref<number | null>(null)
  const minValue = ref<number | null>(null)
  const maxValue = ref<number | null>(null)
  const currency = computed<string>(() => (model.value ? 'EUR' : 'GBP'))
  const minMaxValue = computed<string>(() => (model.value ? 'GBP' : 'EUR'))

  // Validation for the values
  // Removed rule that conversion rate needs to be larger than amount.

  const isAmountValid = computed<boolean>(() => {
    return amount.value !== null
  })

  const isMinValueValid = computed<boolean>(() => {
    return minValue.value !== null
  })

  const isMaxValueValid = computed<boolean>(() => {
    return maxValue.value !== null
  })

  const isMinMaxValid = computed<boolean>(() => {
    return minValue.value !== null && maxValue.value !== null && maxValue.value > minValue.value
  })

  const isFormValid = computed<boolean>(() => {
    return (
      isAmountValid.value && isMinValueValid.value && isMaxValueValid.value && isMinMaxValid.value
    )
  })

  // Update this to use buildTaskAPI
  const handleSubmit = () => {
    if (isFormValid.value) {
      console.log('Form is valid:', {
        amount: amount.value,
        minValue: minValue.value,
        maxValue: maxValue.value
      })
      buildTask(amount.value, minValue.value, maxValue.value)
    } else {
      console.log('Form is invalid.')
      alert('Please provide the amount, minValue and maxValue as described')
      return
    }
  }

  return {
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
    isFormValid,
    handleSubmit
  }
}
