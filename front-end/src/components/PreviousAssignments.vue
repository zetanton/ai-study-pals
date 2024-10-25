<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <h3 class="text-xl font-bold text-[#2e3856] mb-4">Previous Assignments</h3>
    <div v-if="assignments.length > 0" class="space-y-4">
      <div v-for="assignment in assignments" :key="assignment.id" class="bg-[#f7f9fc] rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Assignment {
  id: number
  name: string
  grade: string
  submittedDate: string
}

const assignments = ref<Assignment[]>([])

onMounted(async () => {
  try {
    const response = await fetch('/api/previous-assignments')
    assignments.value = await response.json()
  } catch (error) {
    console.error('Error fetching previous assignments:', error)
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const getGradeColor = (grade: string) => {
  const numericGrade = parseFloat(grade)
  if (numericGrade >= 90) return 'bg-green-100 text-green-800'
  if (numericGrade >= 80) return 'bg-blue-100 text-blue-800'
  if (numericGrade >= 70) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}
</script>
