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
      <button
        @click="sendMessage"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#00a3ff] text-white rounded-full font-semibold hover:bg-[#0082cc] transition-colors"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const messageText = ref('')

const sendMessage = () => {
  if (!messageText.value.trim()) return
  emit('send', messageText.value)
  messageText.value = ''
}
</script>