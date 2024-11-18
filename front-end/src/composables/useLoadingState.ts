import { ref } from 'vue'

export function useLoadingState<T>(asyncFunction: () => Promise<T>) {
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const data = ref<T | null>(null)

  const execute = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      data.value = await asyncFunction()
      return data.value
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    data,
    execute
  }
} 