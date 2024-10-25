<template>
  <div class="bg-[#f7f9fc] py-20">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-[#2e3856] mb-4">Contact Us</h1>
        <p class="text-xl text-gray-600">
          Have questions or feedback? We'd love to hear from you!
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl shadow-lg p-8">
        <div class="mb-6">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a3ff]"
          >
        </div>

        <div class="mb-6">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a3ff]"
          >
        </div>

        <div class="mb-6">
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="4"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a3ff]"
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            class="w-full btn-primary py-3"
            :disabled="loading"
          >
            {{ loading ? 'Sending...' : 'Send Message' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: ''
})

const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', form.value)
    alert('Message sent successfully!')
    form.value = { name: '', email: '', message: '' }
  } catch (error) {
    console.error('Error sending message:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

