<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-[#2e3856]">Profile Settings</h1>
        <button 
          @click="saveChanges" 
          class="btn-primary"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>

      <!-- Basic Information -->
      <div class="space-y-6 mb-8">
        <h2 class="text-xl font-semibold text-[#2e3856]">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="profile.name"
              type="text"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="profile.email"
              type="email"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
            >
          </div>
        </div>
      </div>

      <!-- Role Specific Settings -->
      <div v-if="user?.role === 'student'" class="space-y-6 mb-8">
        <h2 class="text-xl font-semibold text-[#2e3856]">Student Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Grade Level</label>
            <select
              v-model="profile.gradeLevel"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
            >
              <option value="">Select Grade</option>
              <option v-for="grade in grades" :key="grade" :value="grade">
                Grade {{ grade }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="user?.role === 'parent'" class="space-y-6 mb-8">
        <h2 class="text-xl font-semibold text-[#2e3856]">Children</h2>
        <div class="space-y-4">
          <div v-for="(child, index) in profile.children" :key="index" class="flex items-center space-x-4">
            <input
              v-model="child.code"
              type="text"
              placeholder="Enter student code"
              class="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
            >
            <button @click="removeChild(index)" class="text-red-500 hover:text-red-700">
              Remove
            </button>
          </div>
          <button @click="addChild" class="text-[#00a3ff] hover:text-[#0082cc]">
            + Add Child
          </button>
        </div>
      </div>

      <div v-if="user?.role === 'educator'" class="space-y-6 mb-8">
        <h2 class="text-xl font-semibold text-[#2e3856]">Class Information</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">School Name</label>
            <input
              v-model="profile.schoolName"
              type="text"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Subjects Taught</label>
            <div class="mt-2 space-y-2">
              <label v-for="subject in subjects" :key="subject.value" class="flex items-center">
                <input
                  type="checkbox"
                  :value="subject.value"
                  v-model="profile.subjects"
                  class="rounded border-gray-300 text-[#00a3ff] focus:ring-[#00a3ff]"
                >
                <span class="ml-2">{{ subject.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Information -->
      <div class="space-y-6">
        <h2 class="text-xl font-semibold text-[#2e3856]">Subscription</h2>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900">Current Plan: {{ user?.subscription }}</p>
              <p class="text-sm text-gray-500">Manage your subscription settings</p>
            </div>
            <RouterLink to="/pricing" class="text-[#00a3ff] hover:underline">
              Upgrade Plan
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const loading = ref(false)

const grades = Array.from({ length: 6 }, (_, i) => i + 1)
const subjects = [
  { label: 'Mathematics', value: 'math' },
  { label: 'Science', value: 'science' },
  { label: 'English', value: 'english' },
  { label: 'History', value: 'history' },
  { label: 'Social Studies', value: 'social' }
]

const profile = ref({
  name: '',
  email: '',
  gradeLevel: '',
  children: [] as { code: string }[],
  schoolName: '',
  subjects: [],
})

const addChild = () => {
  profile.value.children.push({ code: '' })
}

const removeChild = (index: number) => {
  profile.value.children.splice(index, 1)
}

const saveChanges = async () => {
  loading.value = true
  try {
    // API call to save profile changes
    await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile.value)
    })
    // Show success message
  } catch (error) {
    console.error('Failed to save profile:', error)
    // Show error message
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const response = await fetch('/api/profile')
    const data = await response.json()
    profile.value = {
      ...profile.value,
      ...data
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }
})
</script> 