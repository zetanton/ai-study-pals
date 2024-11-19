<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-[#2e3856] mb-8">{{ currentAgent?.subject }} with {{ currentAgent?.name }}</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-[#2e3856]">Chat with {{ currentAgent?.name }}</h3>
            <button class="text-sm text-[#00a3ff] hover:underline" @click="clearChat">Clear Chat</button>
          </div>
          
          <div class="space-y-4 h-[400px] overflow-y-auto mb-4 p-4">
            <ChatMessage
              v-for="message in messages"
              :key="message.id"
              :message="message"
              :agent-avatar="currentAgent?.avatar"
            />
          </div>

          <ChatInput 
            @send="handleSendMessage" 
            @toggle-voice="toggleVoiceInput"
            :is-listening="isListening"
          />
          <VoiceInput 
            :is-listening="isListening"
            @transcript="handleVoiceInput"
            @update-listening="updateListeningStatus"
          />
        </div> 
      </div>

      <div class="lg:col-span-1">
        <AssignmentUpload :default-subject="getSubjectValue(currentAgent?.subject)" />
        <PreviousAssignments class="mt-8" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAgentStore } from '../../stores/agents'
import { useMessageStore } from '../../stores/messages'
import ChatMessage from '../../components/ChatMessage.vue'
import ChatInput from '../../components/ChatInput.vue'
import VoiceInput from '../../components/VoiceInput.vue'
import AssignmentUpload from '../../components/AssignmentUpload.vue'
import PreviousAssignments from '../../components/PreviousAssignments.vue'

const route = useRoute()
const agentStore = useAgentStore()
const messageStore = useMessageStore()

const currentAgent = computed(() => 
  agentStore.getAgentById(route.params.id as string)
)

const messages = computed(() => 
  messageStore.getMessagesByAgentId(route.params.id as string)
)

const isListening = ref(false)

const handleSendMessage = (content: string) => {
  messageStore.addMessage(route.params.id as string, {
    content,
    sender: 'user'
  })
}

const handleVoiceInput = (transcript: string) => {
  handleSendMessage(transcript)
}

const toggleVoiceInput = () => {
  isListening.value = !isListening.value
}

const updateListeningStatus = (status: boolean) => {
  isListening.value = status
}

const clearChat = () => {
  messageStore.clearMessages(route.params.id as string)
}

const getSubjectValue = (subject?: string) => {
  const subjectMap: Record<string, string> = {
    'Mathematics': 'math',
    'Science': 'science',
    'English Language Arts': 'english',
    'History': 'history',
    'Social Studies': 'social'
  }
  return subject ? subjectMap[subject] : ''
}
</script>
