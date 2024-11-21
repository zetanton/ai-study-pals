<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-semibold mb-4">Previous Conversations</h3>
    <div class="space-y-2">
      <button
        v-for="conversation in conversations"
        :key="conversation.id"
        @click="selectConversation(conversation.id)"
        class="w-full text-left p-3 rounded hover:bg-gray-100 transition-colors"
        :class="{ 'bg-blue-50': selectedId === conversation.id }"
      >
        <div class="font-medium">{{ formatDate(conversation.date) }}</div>
        <div class="text-sm text-gray-600 truncate">{{ conversation.preview }}</div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessageStore } from '../stores/messages'

const props = defineProps<{
  agentId: string
}>()

const emit = defineEmits<{
  (e: 'select', conversationId: string): void
}>()

const messageStore = useMessageStore()
const selectedId = ref<string>('')

const conversations = computed(() => 
  messageStore.getConversationsByAgentId(props.agentId)
)

function selectConversation(id: string) {
  selectedId.value = id
  emit('select', id)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}
</script> 