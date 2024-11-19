<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-[#2e3856]">Assignment Details</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin h-8 w-8 mx-auto mb-4 border-4 border-[#00a3ff] border-t-transparent rounded-full"></div>
        <p class="text-gray-500">Loading assignment details...</p>
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>

      <div v-else class="space-y-4">
        <div>
          <h3 class="font-semibold text-[#2e3856]">Subject</h3>
          <p class="text-gray-600">{{ assignment.subject }}</p>
        </div>

        <div>
          <h3 class="font-semibold text-[#2e3856]">Grade</h3>
          <p class="text-gray-600">{{ assignment.grade }}</p>
        </div>

        <div v-if="assignment.summary">
          <h3 class="font-semibold text-[#2e3856]">Summary</h3>
          <p class="text-gray-600">{{ assignment.summary }}</p>
        </div>

        <div v-if="assignment.LearningInsights?.length" class="space-y-2">
          <h3 class="font-semibold text-[#2e3856]">Learning Insights</h3>
          <div class="space-y-2">
            <div v-for="insight in assignment.LearningInsights" 
                 :key="insight.id" 
                 class="bg-[#f7f9fc] p-4 rounded-lg">
              <h4 class="font-medium text-[#2e3856]">{{ insight.category }}</h4>
              <p class="text-green-600 text-sm">Strength: {{ insight.strength }}</p>
              <p class="text-orange-600 text-sm">Area for Improvement: {{ insight.improvement }}</p>
              <p class="text-gray-500 text-xs mt-1">Confidence: {{ Math.round(insight.confidence * 100) }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  show: boolean
  assignmentId: number
}>()

defineEmits(['close'])

interface LearningInsight {
  id: number
  category: string
  strength: string
  improvement: string
  confidence: number
}

interface Assignment {
  id: number
  subject: string
  grade: string
  fileName: string
  summary: string
  createdAt: string
  LearningInsights?: LearningInsight[]
}

const assignment = ref<Assignment>({} as Assignment)
const loading = ref(false)
const error = ref('')

const fetchAssignmentDetails = async () => {
  loading.value = true
  error.value = ''
  try {
    console.log('Fetching assignment details for ID:', props.assignmentId)
    const response = await fetch(`/api/assignment/${props.assignmentId}`)
    if (!response.ok) throw new Error('Failed to fetch assignment details')
    const data = await response.json()
    console.log('Assignment details received:', data)
    assignment.value = data
    // Debug insights specifically
    console.log('Learning Insights:', data.LearningInsights)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    console.error('Error fetching assignment details:', err)
  } finally {
    loading.value = false
  }
}

watch(() => props.assignmentId, (newId) => {
  if (newId && props.show) {
    fetchAssignmentDetails()
  }
})

onMounted(() => {
  if (props.assignmentId && props.show) {
    fetchAssignmentDetails()
  }
})
</script> 