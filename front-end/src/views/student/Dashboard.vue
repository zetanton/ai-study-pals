<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-[#2e3856]">Student Dashboard</h1>
      <RouterLink 
        to="/student/agents" 
        class="btn-primary flex items-center space-x-2"
      >
        <span>Study with AI Pals</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="(stat, index) in [
        { value: completedLessons, label: 'Lessons Completed' },
        { value: earnedMedals, label: 'Medals Earned' },
        { value: averageScore, label: 'Average Score', suffix: '%' }
      ]" :key="index"
        class="bg-[#f7f9fc] rounded-xl p-6 transition-all duration-300 hover:shadow-md"
      >
        <div v-if="isLoading" class="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
        <div v-else-if="error" class="text-red-500">Failed to load stats</div>
        <template v-else>
          <div class="text-3xl font-bold text-[#00a3ff]">
            {{ stat.value }}{{ stat.suffix || '' }}
          </div>
          <div class="text-gray-600">{{ stat.label }}</div>
        </template>
      </div>
    </div>

    <div class="space-y-8">
      <div>
        <h2 class="text-2xl font-bold text-[#2e3856] mb-4">Recent Activity</h2>
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div v-if="!recentActivities?.length" class="text-center text-gray-500 py-8">
            <p>No recent activities yet</p>
            <RouterLink 
              to="/student/agents" 
              class="text-[#00a3ff] hover:underline mt-2 inline-block"
            >
              Start learning with AI Pals
            </RouterLink>
          </div>
          <!-- Add v-else with activity list here -->
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold text-[#2e3856] mb-4">Assignment Management</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AssignmentUpload @upload-complete="handleUploadComplete" />
          <PreviousAssignments ref="previousAssignmentsRef" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AssignmentUpload from '../../components/AssignmentUpload.vue'
import PreviousAssignments from '../../components/PreviousAssignments.vue'
import { useLoadingState } from '../../composables/useLoadingState'

// Add missing refs
const completedLessons = ref(0)
const earnedMedals = ref(0)
const averageScore = ref(0)
const recentActivities = ref<any[]>([])
const previousAssignmentsRef = ref()

// Create interface for student stats
interface StudentStats {
  completedLessons: number
  earnedMedals: number
  averageScore: number
}

// Mock fetchStudentStats function since the module is missing
const fetchStudentStats = async (): Promise<StudentStats> => {
  // This would normally call an API endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        completedLessons: 12,
        earnedMedals: 5,
        averageScore: 85
      })
    }, 1000)
  })
}

const { isLoading, error, execute: fetchDashboardStats } = useLoadingState(async () => {
  try {
    const stats = await fetchStudentStats()
    completedLessons.value = stats.completedLessons
    earnedMedals.value = stats.earnedMedals
    averageScore.value = stats.averageScore
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err)
    throw err
  }
})

onMounted(() => {
  fetchDashboardStats()
})

const handleUploadComplete = (newAssignment: any) => {
  if (previousAssignmentsRef.value) {
    previousAssignmentsRef.value.addNewAssignment(newAssignment)
  }
}
</script>
