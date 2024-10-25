<template>
  <div class="mt-4">
    <div class="relative">
      <input
        v-model="messageText"
        type="text"
        placeholder="Ask your question..."
        class="w-full rounded-full pl-6 pr-24 py-3 border-2 border-gray-200 focus:border-[#00a3ff] focus:ring focus:ring-[#00a3ff] focus:ring-opacity-50"
        @keyup.enter="sendMessage"
      >
      <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
        <button
          @click="$emit('toggleVoice')"
          class="mr-2 p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00a3ff]"
          :class="{ 'bg-red-500 text-white hover:bg-red-600': isListening }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
          </svg>
        </button>
        <button
          @click="sendMessage"
          class="px-4 py-1.5 bg-[#00a3ff] text-white rounded-full font-semibold hover:bg-[#0082cc] transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'send', message: string): void
  (e: 'toggleVoice'): void
}>()

const props = defineProps<{
  isListening: boolean
}>()

const messageText = ref('')

const sendMessage = () => {
  if (!messageText.value.trim()) return
  emit('send', messageText.value)
  messageText.value = ''
}
</script>
