<template>
  <div class="space-y-8">
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-[#2e3856]">Parent Dashboard</h1>
          <p class="text-gray-600">Monitor your child's progress</p>
        </div>
        <div class="flex items-center space-x-4">
          <RouterLink 
            to="/profile" 
            class="btn-secondary flex items-center space-x-2"
          >
            <span>Profile Settings</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
          </RouterLink>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">85%</div>
          <div class="text-gray-600">Overall Progress</div>
        </div>
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">12</div>
          <div class="text-gray-600">Hours Studied</div>
        </div>
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">15</div>
          <div class="text-gray-600">Medals Earned</div>
        </div>
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">92%</div>
          <div class="text-gray-600">Assignment Score</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-[#2e3856] mb-4">Subject Performance</h2>
          <div class="space-y-4">
            <div v-for="subject in subjects" :key="subject.name" class="p-4 bg-[#f7f9fc] rounded-xl">
              <div class="flex items-center justify-between mb-2">
                <span class="font-semibold text-[#2e3856]">{{ subject.name }}</span>
                <span class="text-[#00a3ff]">{{ subject.score }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-[#00a3ff] h-2 rounded-full" 
                  :style="{ width: `${subject.score}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-[#2e3856] mb-4">Recent Activity</h2>
          <div class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-[#f7f9fc] rounded-full flex items-center justify-center">
                {{ activity.icon }}
              </div>
              <div>
                <div class="font-semibold text-[#2e3856]">{{ activity.title }}</div>
                <div class="text-sm text-gray-500">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-[#2e3856] mb-4">Recommendations</h2>
          <div class="space-y-4">
            <div v-for="rec in recommendations" :key="rec.id" class="p-4 bg-[#f7f9fc] rounded-xl">
              <div class="font-semibold text-[#2e3856] mb-1">{{ rec.title }}</div>
              <p class="text-sm text-gray-600">{{ rec.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../stores/auth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const router = useRouter()

// Add authorization check
onMounted(() => {
  if (user.value?.role !== 'parent') {
    router.push('/unauthorized')
  }
})

const subjects = [
  { name: 'Mathematics', score: 85 },
  { name: 'Science', score: 92 },
  { name: 'English', score: 78 },
  { name: 'History', score: 88 },
  { name: 'Social Studies', score: 90 }
]

const recentActivity = [
  {
    id: 1,
    icon: '📚',
    title: 'Completed Math Assignment',
    time: '2 hours ago'
  },
  {
    id: 2,
    icon: '🏅',
    title: 'Earned New Medal',
    time: '5 hours ago'
  },
  {
    id: 3,
    icon: '📝',
    title: 'Started Science Quiz',
    time: 'Yesterday'
  }
]

const recommendations = [
  {
    id: 1,
    title: 'Focus on English',
    description: 'Schedule more reading sessions to improve comprehension.'
  },
  {
    id: 2,
    title: 'Math Practice',
    description: 'Review fractions and decimals for upcoming test.'
  }
]
</script>