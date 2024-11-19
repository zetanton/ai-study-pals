<template>
  <div class="min-h-screen bg-[#f7f9fc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-[#2e3856]">Welcome Back!</h2>
        <p class="text-gray-600 mt-2">Sign in to continue your learning journey</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
          >
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
          >
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              class="h-4 w-4 text-[#00a3ff] focus:ring-[#00a3ff] border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <a href="#" class="text-sm text-[#00a3ff] hover:underline">
            Forgot password?
          </a>
        </div>

        <div>
          <button
            type="submit"
            class="w-full btn-primary py-3"
            :disabled="loading"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <RouterLink to="/register" class="text-[#00a3ff] hover:underline">
              Sign up
            </RouterLink>
          </p>
        </div>

        <!-- Test Account Info -->
        <div class="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Test Accounts:</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p>Student: student@test.com</p>
            <p>Parent: parent@test.com</p>
            <p>Educator: educator@test.com</p>
            <p class="text-xs text-gray-500 mt-2">Password for all: "password"</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    const role = authStore.user?.role
    router.push(`/${role}`)
  } catch (error) {
    alert('Invalid credentials')
  } finally {
    loading.value = false
  }
}
</script>