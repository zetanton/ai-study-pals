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
        <div class="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-[#2e3856]">Conversations</h3>
            <button 
              @click="startNewConversation"
              class="text-sm text-[#00a3ff] hover:underline"
            >
              New Chat
            </button>
          </div>
          <div class="space-y-2">
            <button
              v-for="session in conversationSessions"
              :key="session.id"
              @click="loadConversation(session.id)"
              class="w-full text-left p-3 rounded hover:bg-gray-100 transition-colors"
              :class="{ 'bg-blue-50': currentSessionId === session.id }"
            >
              <div class="font-medium text-[#2e3856]">{{ session.title }}</div>
              <div class="text-sm text-gray-500">{{ formatDate(session.createdAt) }}</div>
              <div class="text-sm text-gray-600 truncate mt-1">{{ session.preview }}</div>
            </button>
          </div>
        </div>

        <AssignmentUpload 
          :default-subject="getSubjectValue(currentAgent?.subject)"
          @upload-complete="handleUploadComplete"
        />
        <PreviousAssignments 
          ref="previousAssignmentsRef"
          :subject-filter="getSubjectValue(currentAgent?.subject)"
          class="mt-8"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAgentStore } from '../../stores/agents'
import { useMessageStore } from '../../stores/messages'
import { useAuthStore } from '../../stores/auth'
import ChatMessage from '../../components/ChatMessage.vue'
import ChatInput from '../../components/ChatInput.vue'
import VoiceInput from '../../components/VoiceInput.vue'
import AssignmentUpload from '../../components/AssignmentUpload.vue'
import PreviousAssignments from '../../components/PreviousAssignments.vue'

const route = useRoute()
const agentStore = useAgentStore()
const messageStore = useMessageStore()
const authStore = useAuthStore()

const currentAgent = computed(() => 
  agentStore.getAgentById(route.params.id as string)
)

const messages = computed(() => 
  messageStore.getCurrentConversation(
    route.params.id as string, 
    currentSessionId.value
  )?.messages || []
)

const isListening = ref(false)

const currentSessionId = ref<string>('')
const conversationSessions = ref<Array<{
  id: string;
  createdAt: string;
  preview: string;
  title: string;
}>>([])

onMounted(async () => {
  messageStore.initializeChat(route.params.id as string)
  
  try {
    const response = await fetch(
      `/api/chat/sessions/${route.params.id}?userId=${authStore.user?.id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    const data = await response.json()
    conversationSessions.value = data.sessions || []
    
    if (data.sessions?.length > 0) {
      currentSessionId.value = data.sessions[0].id
      await messageStore.loadConversation(route.params.id as string, data.sessions[0].id)
    }
  } catch (error) {
    console.error('Error fetching conversation sessions:', error)
    conversationSessions.value = []
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const loadConversation = async (sessionId: string) => {
  currentSessionId.value = sessionId
  // Load conversation messages for this session
  await messageStore.loadConversation(route.params.id as string, sessionId)
}

const startNewConversation = async () => {
  messageStore.clearMessages(route.params.id as string)
  
  try {
    const response = await fetch('/api/chat/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: route.params.id,
        userId: authStore.user?.id
      })
    })
    const data = await response.json()
    currentSessionId.value = data.session.id
    
    // Replace any existing conversation with the same ID
    conversationSessions.value = conversationSessions.value.filter(
      session => session.id !== data.session.id
    )
    
    // Add the new session at the beginning
    conversationSessions.value.unshift(data.session)
    
    await messageStore.loadConversation(route.params.id as string, data.session.id)
  } catch (error) {
    console.error('Error creating new conversation:', error)
  }
}

const handleSendMessage = async (content: string) => {
  if (!currentSessionId.value) {
    await startNewConversation();
  }
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: content,
        agentId: route.params.id,
        userId: authStore.user?.id,
        sessionId: currentSessionId.value
      })
    });
    
    const data = await response.json();
    
    if (data.updatedTitle) {
      // Update the title in the conversation list
      conversationSessions.value = conversationSessions.value.map(session => {
        if (session.id === currentSessionId.value) {
          return { ...session, title: data.updatedTitle };
        }
        return session;
      });
    }
    
    messageStore.addMessage(
      route.params.id as string,
      { content, sender: 'user' },
      currentSessionId.value
    );
  } catch (error) {
    console.error('Error sending message:', error);
  }
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

const previousAssignmentsRef = ref()

const handleUploadComplete = (newAssignment: any) => {
  if (previousAssignmentsRef.value) {
    previousAssignmentsRef.value.addNewAssignment(newAssignment)
  }
}
</script>
