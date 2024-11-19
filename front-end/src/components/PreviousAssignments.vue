<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <h3 class="text-xl font-bold text-[#2e3856] mb-4">Previous Assignments</h3>
    <div v-if="loading" class="text-center text-gray-500 py-8">
      <div class="animate-spin h-8 w-8 mx-auto mb-4 border-4 border-[#00a3ff] border-t-transparent rounded-full"></div>
      <p>Loading assignments...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-8">
      <p>{{ error }}</p>
      <button @click="fetchAssignments" class="text-[#00a3ff] hover:underline mt-2">
        Try again
      </button>
    </div>
    <div v-else-if="assignments.length > 0" class="space-y-4">
      <div v-for="assignment in filteredAssignments" :key="assignment.id" class="bg-[#f7f9fc] rounded-xl p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer" @click="showDetails(assignment.id)">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="font-semibold text-[#2e3856] text-lg">{{ assignment.name }}</h4>
            <p class="text-sm text-gray-500 mt-1">Submitted on: {{ formatDate(assignment.submittedDate) }}</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold px-3 py-1 rounded-full" :class="getGradeColor(assignment.grade)">
              {{ assignment.grade }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by uploading your first assignment.</p>
    </div>

    <AssignmentDetails 
      v-if="selectedAssignmentId"
      :show="!!selectedAssignmentId"
      :assignment-id="selectedAssignmentId"
      @close="selectedAssignmentId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AssignmentDetails from './AssignmentDetails.vue'

interface LearningInsight {
  category: string;
  strength: string;
  improvement: string;
  confidence: number;
}

interface Assignment {
  id: number;
  name: string;
  fileName?: string;
  subject: string;
  grade: string;
  submittedDate: string;
  insights: LearningInsight[];
  createdAt?: string;
}

const props = defineProps<{
  subjectFilter?: string
}>()

const assignments = ref<Assignment[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const selectedAssignmentId = ref<number | null>(null)

const filteredAssignments = computed(() => {
  if (!props.subjectFilter) return assignments.value
  return assignments.value.filter(a => 
    a.subject.toLowerCase() === (props.subjectFilter ?? '').toLowerCase()
  )
})

const fetchAssignments = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch('/api/previous-assignments')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    assignments.value = await response.json()
  } catch (err) {
    console.error('Error fetching previous assignments:', err)
    error.value = 'Failed to load assignments. Please try again later.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAssignments()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const getGradeColor = (grade: string) => {
  const colors = {
    'A': 'bg-green-100 text-green-800',
    'B': 'bg-blue-100 text-blue-800',
    'C': 'bg-yellow-100 text-yellow-800',
    'D': 'bg-orange-100 text-orange-800',
    'F': 'bg-red-100 text-red-800'
  };
  return colors[grade as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

const showDetails = (id: number) => {
  selectedAssignmentId.value = id
}

const addNewAssignment = (newAssignment: Assignment) => {
  const formattedAssignment = {
    id: newAssignment.id,
    name: newAssignment.fileName || 'Untitled Assignment',
    subject: newAssignment.subject,
    grade: newAssignment.grade,
    submittedDate: newAssignment.submittedDate ?? newAssignment.createdAt ?? new Date().toISOString(),
    insights: newAssignment.insights
  }
  
  assignments.value.unshift(formattedAssignment)
}

defineExpose({
  addNewAssignment,
  fetchAssignments
})
</script>
