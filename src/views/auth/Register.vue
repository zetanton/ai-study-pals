<template>
  <div class="min-h-screen bg-[#f7f9fc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-[#2e3856]">Create Account</h2>
        <p class="text-gray-600 mt-2">Join AI Study Pals today</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
          >
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
          >
        </div>

        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">I am a...</label>
          <select
            id="role"
            v-model="form.role"
            required
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
          >
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="educator">Educator</option>
          </select>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
          >
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            type="checkbox"
            required
            class="h-4 w-4 text-[#00a3ff] focus:ring-[#00a3ff] border-gray-300 rounded"
          >
          <label for="terms" class="ml-2 block text-sm text-gray-700">
            I agree to the
            <a href="#" class="text-[#00a3ff] hover:underline">Terms</a>
            and
            <a href="#" class="text-[#00a3ff] hover:underline">Privacy Policy</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            class="w-full btn-primary py-3"
            :disabled="loading"
          >
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <RouterLink to="/login" class="text-[#00a3ff] hover:underline">
              Sign in
            </RouterLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  role: route.query.role || 'student',
  password: ''
})

const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    await authStore.register(form.value)
    router.push(`/${form.value.role}`)
  } catch (error) {
    alert('Registration failed')
  } finally {
    loading.value = false
  }
}
</script>