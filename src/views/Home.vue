<template>
  <div class="space-y-8">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-[#2e3856] mb-4">Choose Your Study Pal</h2>
      <p class="text-gray-600 max-w-2xl mx-auto">Each AI Study Pal is specially designed to help you learn and excel in their subject. Pick your favorite to start learning!</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <SubjectCard 
        v-for="agent in agents" 
        :key="agent.id"
        :agent="agent"
        @click="navigateToSubject(agent.id)"
      />
    </div>

    <div class="mt-16 bg-white rounded-2xl shadow-lg p-8">
      <h3 class="text-2xl font-bold text-[#2e3856] mb-6">Your Learning Journey</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="stat-card">
          <div class="text-3xl font-bold text-[#00a3ff]">12</div>
          <div class="text-gray-600">Lessons Completed</div>
        </div>
        <div class="stat-card">
          <div class="text-3xl font-bold text-[#00a3ff]">5</div>
          <div class="text-gray-600">Medals Earned</div>
        </div>
        <div class="stat-card">
          <div class="text-3xl font-bold text-[#00a3ff]">85%</div>
          <div class="text-gray-600">Average Score</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import SubjectCard from '../components/SubjectCard.vue'
import { useAgentStore } from '../stores/agents'

const router = useRouter()
const agentStore = useAgentStore()
const { agents } = storeToRefs(agentStore)

const navigateToSubject = (id: string) => {
  router.push(`/subject/${id}`)
}
</script>

<style scoped>
.stat-card {
  @apply bg-[#f7f9fc] rounded-xl p-6 text-center;
}
</style>