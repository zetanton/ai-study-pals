<template>
  <div 
    class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl duration-300 cursor-pointer transform hover:-translate-y-1 transition-transform"
    @click="$emit('click')"
  >
    <div class="relative">
      <div class="w-full pt-[100%] relative overflow-hidden bg-[#f0f3f9]">
        <img 
          :src="agent.avatar" 
          :alt="agent.name" 
          class="absolute inset-0 w-full h-full object-contain p-4"
        >
      </div>
      <div class="absolute top-4 right-4">
        <div class="bg-white rounded-full p-2 shadow-md">
          <div class="w-6 h-6" v-html="getSubjectIcon(agent.id)"></div>
        </div>
      </div>
    </div>
    <div class="p-6">
      <h3 class="text-xl font-bold text-[#2e3856] mb-1">{{ agent.name }}</h3>
      <p class="text-sm text-[#00a3ff] font-semibold mb-3">{{ agent.subject }}</p>
      <p class="text-gray-600 text-sm">{{ agent.description }}</p>
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="inline-block w-3 h-3 rounded-full" :class="getDifficultyColor(agent.id)"></span>
          <span class="text-sm text-gray-500">{{ getDifficultyLabel(agent.id) }}</span>
        </div>
        <button class="text-[#00a3ff] font-semibold text-sm hover:underline">
          Start Learning →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Agent {
  id: string
  name: string
  subject: string
  avatar: string
  description: string
}

defineProps<{
  agent: Agent
}>()

const getSubjectIcon = (id: string) => {
  const icons = {
    science: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>',
    math: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
    ela: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
    history: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    social: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>'
  }
  return icons[id as keyof typeof icons]
}

const getDifficultyColor = (id: string) => {
  const colors = {
    science: 'bg-purple-500',
    math: 'bg-blue-500',
    ela: 'bg-green-500',
    history: 'bg-yellow-500',
    social: 'bg-red-500'
  }
  return colors[id as keyof typeof colors]
}

const getDifficultyLabel = (id: string) => {
  const labels = {
    science: 'Intermediate',
    math: 'Progressive',
    ela: 'Adaptive',
    history: 'Exploratory',
    social: 'Interactive'
  }
  return labels[id as keyof typeof labels]
}
</script>