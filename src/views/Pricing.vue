<template>
  <div class="bg-[#f7f9fc] py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-[#2e3856] mb-4">Choose Your Plan</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Find the perfect plan for your learning journey
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="plan in plans" 
          :key="plan.name"
          class="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          :class="{ 'ring-4 ring-[#00a3ff] transform scale-105': selectedPlan === plan.id }"
          @click="selectPlan(plan.id)"
        >
          <div class="p-8">
            <h3 class="text-2xl font-bold text-[#2e3856] mb-2">{{ plan.name }}</h3>
            <div class="flex items-baseline mb-4">
              <span class="text-4xl font-bold text-[#2e3856]">${{ plan.price }}</span>
              <span class="text-gray-500 ml-2">/month</span>
            </div>
            <p class="text-gray-600 mb-6">{{ plan.description }}</p>
            
            <ul class="space-y-4 mb-8">
              <li 
                v-for="feature in plan.features" 
                :key="feature"
                class="flex items-center text-gray-600"
              >
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ feature }}
              </li>
            </ul>

            <RouterLink 
              :to="{ name: 'register', query: { plan: plan.id }}"
              class="block w-full text-center py-3 rounded-full font-semibold"
              :class="plan.popular ? 'bg-[#00a3ff] text-white hover:bg-[#0082cc]' : 'bg-gray-100 text-[#2e3856] hover:bg-gray-200'"
            >
              Get Started
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    description: 'Perfect for trying out AI Study Pals',
    features: [
      'Access to one AI Study Pal',
      'Basic progress tracking',
      'Limited chat interactions',
      'Community support'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '19.99',
    popular: true,
    description: 'Most popular choice for individual students',
    features: [
      'Access to all AI Study Pals',
      'Detailed progress tracking',
      'Unlimited chat interactions',
      'Assignment feedback',
      'Priority support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '29.99',
    description: 'Best value for families and educators',
    features: [
      'Everything in Basic',
      'Multiple student accounts',
      'Parent/Teacher dashboard',
      'Advanced analytics',
      'Customized learning paths',
      '24/7 premium support'
    ]
  }
]

const selectedPlan = ref('basic') // Default to 'basic' plan

const selectPlan = (planId: string) => {
  selectedPlan.value = planId
}
</script>
