<template>
  <div class="flex space-x-3" :class="message.sender === 'user' ? 'justify-end' : ''">
    <div class="flex space-x-3 max-w-[80%]" :class="message.sender === 'user' ? 'flex-row-reverse' : ''">
      <div class="flex-shrink-0">
        <img 
          v-if="message.sender === 'agent'"
          :src="agentAvatar" 
          class="w-8 h-8 rounded-full"
        >
        <div v-else class="w-8 h-8 rounded-full bg-[#00a3ff] flex items-center justify-center text-white font-bold">
          U
        </div>
      </div>
      <div 
        :class="[
          'rounded-2xl p-4',
          message.sender === 'user' 
            ? 'bg-[#00a3ff] text-white' 
            : 'bg-[#f0f3f9] text-[#2e3856]'
        ]"
      >
        {{ message.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '../stores/messages'

defineProps<{
  message: Message
  agentAvatar?: string
}>()
</script>