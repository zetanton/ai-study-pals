<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div class="flex items-center space-x-6">
        <div class="w-24 h-24 rounded-full overflow-hidden bg-[#f0f3f9] p-2">
          <img 
            :src="currentAgent?.avatar" 
            :alt="currentAgent?.name"
            class="w-full h-full object-contain"
          >
        </div>
        <div>
          <h2 class="text-3xl font-bold text-[#2e3856]">{{ currentAgent?.name }}</h2>
          <p class="text-[#00a3ff] font-semibold">{{ currentAgent?.subject }}</p>
        </div>
        <div class="ml-auto flex space-x-4">
          <button class="btn-secondary">View Progress</button>
          <button class="btn-primary">Start New Lesson</button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-[#2e3856]">Chat with {{ currentAgent?.name }}</h3>
            <button class="text-sm text-[#00a3ff] hover:underline">Clear Chat</button>
          </div>
          
          <div class="space-y-4 h-[400px] overflow-y-auto mb-4">
            <ChatMessage
              v-for="message in messages"
              :key="message.id"
              :message="message"
              :agent-avatar="currentAgent?.avatar"
            />
          </div>

          <ChatInput 
            :is-listening="isListening"
            :transcribed-message="transcribedMessage"
            @send="handleSendMessage"
            @toggle-voice="toggleVoiceInput" 
          />
          <VoiceInput
            :is-listening="isListening"
            @transcript="handleTranscript"
            @update-listening="updateListeningStatus"
          />
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold text-[#2e3856] mb-4">Your Progress</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Lessons Completed</span>
              <span class="font-semibold text-[#2e3856]">8/12</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-[#00a3ff] h-2 rounded-full" style="width: 66%"></div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold text-[#2e3856] mb-4">Recent Medals</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span class="text-yellow-600">🏅</span>
              </div>
              <div>
                <div class="font-semibold text-[#2e3856]">Quick Learner</div>
                <div class="text-sm text-gray-500">Completed 5 lessons in a row</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAgentStore } from '../stores/agents'
import { useMessageStore } from '../stores/messages'
import ChatMessage from '../components/ChatMessage.vue'
import ChatInput from '../components/ChatInput.vue'
import VoiceInput from '../components/VoiceInput.vue'

// Store and route setup
const route = useRoute()
const agentStore = useAgentStore()
const messageStore = useMessageStore()

// Computed properties for current context
const currentAgent = computed(() => 
  agentStore.getAgentById(route.params.id as string)
)

const messages = computed(() => 
  messageStore.getMessagesByAgentId(route.params.id as string)
)

// Voice input state management
const isListening = ref(false)
const transcribedMessage = ref('')

// Initialize chat on component mount
onMounted(() => {
  messageStore.initializeChat(route.params.id as string)
})

// Message handling
const handleSendMessage = (content: string) => {
  if (!content.trim()) return
  
  messageStore.addMessage(route.params.id as string, {
    content,
    sender: 'user'
  })
  transcribedMessage.value = ''
}

// Voice input controls
const toggleVoiceInput = () => {
  isListening.value = !isListening.value
  if (!isListening.value) {
    transcribedMessage.value = ''
  }
}

const updateListeningStatus = (status: boolean) => {
  isListening.value = status
}

const handleTranscript = (text: string) => {
  if (text.trim()) {
    transcribedMessage.value = text
    isListening.value = false
  }
}
</script>