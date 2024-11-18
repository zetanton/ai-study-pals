<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-[#2e3856] mb-8">Choose Your Study Pal</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <SubjectCard 
        v-for="agent in agents" 
        :key="agent.id"
        :agent="agent"
        @click="navigateToSubject(agent.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import SubjectCard from '../../components/SubjectCard.vue'
import { useAgentStore } from '../../stores/agents'

const router = useRouter()
const agentStore = useAgentStore()
const { agents } = storeToRefs(agentStore)

const navigateToSubject = (id: string) => {
  router.push(`/student/subject/${id}`)
}
</script>
