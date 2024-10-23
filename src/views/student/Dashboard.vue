<template>
  <div class="space-y-8">
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-[#2e3856]">Welcome back, {{ user?.name }}!</h1>
          <p class="text-gray-600">Ready to continue learning?</p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500">{{ user?.subscription }} Plan</span>
          <RouterLink to="/pricing" class="text-[#00a3ff] text-sm hover:underline">Upgrade</RouterLink>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">15</div>
          <div class="text-gray-600">Lessons Completed</div>
        </div>
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">8</div>
          <div class="text-gray-600">Medals Earned</div>
        </div>
        <div class="bg-[#f7f9fc] rounded-xl p-6">
          <div class="text-3xl font-bold text-[#00a3ff]">92%</div>
          <div class="text-gray-600">Average Score</div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-[#2e3856]">Your Study Pals</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <SubjectCard 
          v-for="agent in agents" 
          :key="agent.id"
          :agent="agent"
          @click="navigateToSubject(agent.id)"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-[#2e3856] mb-4">Recent Activity</h2>
          <div class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-4 p-4 bg-[#f7f9fc] rounded-xl">
              <div class="w-10 h-10 rounded-full bg-[#00a3ff] flex items-center justify-center text-white">
                {{ activity.icon }}
              </div>
              <div>
                <div class="font-semibold text-[#2e3856]">{{ activity.title }}</div>
                <div class="text-sm text-gray-600">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-xl font-bold text-[#2e3856] mb-4">Your Medals</h2>
        <div class="space-y-4">
          <div v-for="medal in recentMedals" :key="medal.id" class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span class="text-yellow-600">{{ medal.icon }}</span>
            </div>
            <div>
              <div class="font-semibold text-[#2e3856]">{{ medal.name }}</div>
              <div class="text-sm text-gray-500">{{ medal.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../stores/auth'
import { useAgentStore } from '../../stores/agents'
import SubjectCard from '../../components/SubjectCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const agentStore = useAgentStore()

const { user } = storeToRefs(authStore)
const { agents } = storeToRefs(agentStore)

const navigateToSubject = (id: string) => {
  router.push(`/student/subject/${id}`)
}

const recentActivity = [
  {
    id: 1,
    icon: '📚',
    title: 'Completed Math Quiz: Fractions',
    time: '2 hours ago'
  },
  {
    id: 2,
    icon: '🏅',
    title: 'Earned "Science Explorer" Medal',
    time: '5 hours ago'
  },
  {
    id: 3,
    icon: '✍️',
    title: 'Submitted English Essay',
    time: 'Yesterday'
  }
]

const recentMedals = [
  {
    id: 1,
    icon: '🏅',
    name: 'Math Master',
    description: 'Completed 10 math lessons'
  },
  {
    id: 2,
    icon: '🏅',
    name: 'Science Explorer',
    description: 'Perfect score on science quiz'
  },
  {
    id: 3,
    icon: '🏅',
    name: 'Reading Champion',
    description: 'Read 5 books this month'
  }
]
</script>