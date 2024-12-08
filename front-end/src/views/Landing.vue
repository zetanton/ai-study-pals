<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-gradient-to-b from-[#f7f9fc] to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-[#2e3856] mb-6">
            Meet Your AI Study Pals
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Personalized learning with subject-specific AI tutors that adapt to your child&apos;s needs.
            Making education fun, engaging, and effective.
          </p>
          <div class="flex justify-center space-x-4">
            <RouterLink 
              to="/register" 
              class="btn-primary text-lg px-8 py-3"
            >
              Get Started Free
            </RouterLink>
            <RouterLink 
              to="/pricing" 
              class="btn-secondary text-lg px-8 py-3"
            >
              View Plans
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-[#2e3856] mb-4">
            Why Choose AI Study Pals?
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with proven educational methods
            to create a unique learning experience.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 text-[#00a3ff]" v-html="feature.icon"></div>
            <h3 class="text-xl font-bold text-[#2e3856] mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Study Pals Preview -->
    <div class="py-20 bg-[#f7f9fc]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-[#2e3856] mb-4">
            Meet Your Learning Companions
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Each Study Pal is specially designed to make learning fun and effective
            in their specific subject area.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SubjectCard 
            v-for="agent in agents" 
            :key="agent.id"
            :agent="agent"
            class="cursor-default transform-none hover:transform-none"
          />
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-[#2e3856] text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of students already learning with AI Study Pals.
          Start your journey today!
        </p>
        <div class="flex justify-center space-x-4">
          <RouterLink 
            to="/register" 
            class="bg-white text-[#2e3856] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Try It Free
          </RouterLink>
          <RouterLink 
            to="/pricing" 
            class="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#2e3856] transition-colors"
          >
            See Pricing
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAgentStore } from '../stores/agents'
import SubjectCard from '../components/SubjectCard.vue'

const agentStore = useAgentStore()
const { agents } = storeToRefs(agentStore)

const features = [
  {
    title: 'Personalized Learning',
    description: "AI tutors adapt to each student's learning style and pace",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>'
  },
  {
    title: 'Progress Tracking',
    description: 'Real-time insights into learning progress and achievements',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
  },
  {
    title: 'Safe Learning Environment',
    description: 'Age-appropriate content and monitored interactions',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>'
  }
]
</script>