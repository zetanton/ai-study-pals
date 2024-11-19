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
          'rounded-2xl p-4 markdown-body',
          message.sender === 'user' 
            ? 'bg-[#00a3ff] text-white' 
            : 'bg-[#f0f3f9] text-[#2e3856]'
        ]"
        v-html="renderedContent"
      >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '../stores/messages'
import { marked } from 'marked'
import { computed } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps<{
  message: Message
  agentAvatar?: string
}>()

const renderedContent = computed(() => {
  if (props.message.sender === 'user') {
    return props.message.content
  }
  const markedContent = marked(props.message.content).toString()
  return DOMPurify.sanitize(markedContent)
})
</script>

<style lang="postcss">
.markdown-body {
  @apply prose prose-sm max-w-none;
}

.markdown-body[class*="text-white"] {
  @apply prose-invert;
}

.markdown-body h3 {
  @apply mt-0 first:mt-0;
}

.markdown-body p {
  @apply my-2;
}

.markdown-body ul {
  @apply my-2 list-disc list-inside;
}

.markdown-body blockquote {
  @apply border-l-4 pl-4 my-2 italic;
}

.markdown-body code {
  @apply px-1.5 py-0.5 rounded bg-gray-100 text-gray-800;
}

.markdown-body[class*="text-white"] code {
  @apply bg-[#0082cc] text-white;
}
</style>