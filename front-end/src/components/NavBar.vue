<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b-4 border-[#00a3ff]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <RouterLink :to="homeLink" class="text-2xl font-bold text-[#2e3856]">AI Study Pals</RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <template v-if="isAuthenticated">
            <RouterLink :to="`/${userRole}`" class="text-gray-600 hover:text-[#00a3ff]">Dashboard</RouterLink>
            <button @click="logout" class="text-gray-600 hover:text-[#00a3ff]">Logout</button>
          </template>
          <template v-else>
            <RouterLink to="/pricing" class="text-gray-600 hover:text-[#00a3ff]">Pricing</RouterLink>
            <RouterLink to="/about" class="text-gray-600 hover:text-[#00a3ff]">About</RouterLink>
            <RouterLink to="/contact" class="text-gray-600 hover:text-[#00a3ff]">Contact</RouterLink>
            <div class="flex items-center space-x-4">
              <RouterLink to="/login" class="btn-secondary px-4 py-2">Log In</RouterLink>
              <RouterLink to="/register" class="btn-primary px-4 py-2">Sign Up</RouterLink>
            </div>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button
            @click="isOpen = !isOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#00a3ff] hover:bg-gray-100"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              :class="{'hidden': isOpen, 'block': !isOpen}"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              class="h-6 w-6"
              :class="{'block': isOpen, 'hidden': !isOpen}"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="md:hidden absolute w-full bg-white" :class="{'block': isOpen, 'hidden': !isOpen}">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg">
        <template v-if="isAuthenticated">
          <RouterLink
            :to="`/${userRole}`"
            class="block px-3 py-2 rounded-md text-gray-600 hover:text-[#00a3ff] hover:bg-gray-100"
          >
            Dashboard
          </RouterLink>
          <button
            @click="logout"
            class="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-[#00a3ff] hover:bg-gray-100"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <RouterLink
            to="/pricing"
            class="block px-3 py-2 rounded-md text-gray-600 hover:text-[#00a3ff] hover:bg-gray-100"
          >
            Pricing
          </RouterLink>
          <RouterLink
            to="/about"
            class="block px-3 py-2 rounded-md text-gray-600 hover:text-[#00a3ff] hover:bg-gray-100"
          >
            About
          </RouterLink>
          <RouterLink
            to="/contact"
            class="block px-3 py-2 rounded-md text-gray-600 hover:text-[#00a3ff] hover:bg-gray-100"
          >
            Contact
          </RouterLink>
          <div class="mt-4 space-y-2">
            <RouterLink
              to="/login"
              class="block w-full text-center btn-secondary py-2"
            >
              Log In
            </RouterLink>
            <RouterLink
              to="/register"
              class="block w-full text-center btn-primary py-2"
            >
              Sign Up
            </RouterLink>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const isOpen = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userRole = computed(() => authStore.user?.role)

const logout = () => {
  authStore.logout()
  router.push('/')
}

const homeLink = computed(() => {
  if (!authStore.isAuthenticated) {
    return '/'
  }
  switch (authStore.user?.role) {
    case 'student':
      return '/student'
    case 'parent':
      return '/parent'
    case 'educator':
      return '/educator'
    default:
      return '/'
  }
})
</script>
