<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-[#2e3856] mb-8">Student Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-[#f7f9fc] rounded-xl p-6">
        <div class="text-3xl font-bold text-[#00a3ff]">{{ completedLessons }}</div>
        <div class="text-gray-600">Lessons Completed</div>
      </div>
      <div class="bg-[#f7f9fc] rounded-xl p-6">
        <div class="text-3xl font-bold text-[#00a3ff]">{{ earnedMedals }}</div>
        <div class="text-gray-600">Medals Earned</div>
      </div>
      <div class="bg-[#f7f9fc] rounded-xl p-6">
        <div class="text-3xl font-bold text-[#00a3ff]">{{ averageScore }}%</div>
        <div class="text-gray-600">Average Score</div>
      </div>
    </div>

    <div class="space-y-8">
      <div>
        <h2 class="text-2xl font-bold text-[#2e3856] mb-4">Your Study Pals</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SubjectCard 
            v-for="agent in agents" 
            :key="agent.id"
            :agent="agent"
            @click="navigateToSubject(agent.id)"
          />
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold text-[#2e3856] mb-4">Assignment Management</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AssignmentUpload />
          <PreviousAssignments />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SubjectCard from '../../components/SubjectCard.vue'
import AssignmentUpload from '../../components/AssignmentUpload.vue'
import PreviousAssignments from '../../components/PreviousAssignments.vue'
import { useAgentStore } from '../../stores/agents'
import { useRouter } from 'vue-router'

const router = useRouter()
const agentStore = useAgentStore()

const agents = agentStore.agents
const completedLessons = ref(15)
const earnedMedals = ref(8)
const averageScore = ref(92)

const navigateToSubject = (agentId: string) => {
  router.push({ name: 'subject', params: { id: agentId } })
}
</script>
