import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export interface Message {
  id: number
  content: string
  sender: 'user' | 'agent'
}

export interface ConversationSession {
  id: string
  date: string
  messages: Message[]
  preview: string
  title: string
}

export const useMessageStore = defineStore('messages', {
  state: () => ({
    conversations: {} as Record<string, ConversationSession[]>
  }),

  actions: {
    initializeChat(agentId: string) {
      if (!this.conversations[agentId]) {
        this.conversations[agentId] = []
      }
    },

    clearMessages(agentId: string) {
      if (this.conversations[agentId]) {
        this.conversations[agentId] = []
      }
    },

    async addMessage(agentId: string, message: Omit<Message, 'id'>, sessionId?: string) {
      const targetConversation = sessionId 
        ? this.conversations[agentId]?.find(c => c.id === sessionId)
        : this.conversations[agentId]?.[0]

      if (!targetConversation) return

      const newMessage: Message = {
        ...message,
        id: targetConversation.messages.length + 1
      }
      
      targetConversation.messages.push(newMessage)
      targetConversation.preview = message.content.substring(0, 50) + '...'

      if (message.sender === 'user') {
        try {
          const authStore = useAuthStore()
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: message.content,
              agentId,
              userId: authStore.user?.id,
              sessionId: targetConversation.id
            })
          });
          
          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          // Update title if it was generated
          if (data.updatedTitle) {
            // Force reactivity by creating a new array
            this.conversations[agentId] = this.conversations[agentId].map(conv => {
              if (conv.id === sessionId) {
                return {
                  ...conv,
                  title: data.updatedTitle
                };
              }
              return conv;
            });
          }
          
          if (data.content) {
            targetConversation.messages.push({
              id: targetConversation.messages.length + 1,
              content: data.content,
              sender: 'agent'
            });
          }
        } catch (error) {
          console.error('Error getting AI response:', error)
          targetConversation.messages.push({
            id: targetConversation.messages.length + 1,
            content: 'Sorry, I encountered an error. Please try again.',
            sender: 'agent'
          })
        }
      }
    },

    async loadConversation(agentId: string, sessionId: string) {
      try {
        const authStore = useAuthStore()
        const currentUserId = authStore.user?.id
        
        // Verify the session belongs to the current user
        if (!sessionId.startsWith(`${currentUserId}-${agentId}-`)) {
          console.error('Invalid session ID for current user')
          return
        }

        const response = await fetch(
          `/api/chat/messages/${sessionId}?userId=${currentUserId}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to load conversation')
        }
        
        const data = await response.json()
        
        if (!this.conversations[agentId]) {
          this.conversations[agentId] = []
        }

        // Remove any existing duplicates
        this.conversations[agentId] = this.conversations[agentId].filter(
          conv => conv.id !== sessionId
        )

        // Add the updated conversation
        this.conversations[agentId].unshift({
          id: sessionId,
          date: data.date,
          messages: data.messages,
          preview: data.preview || 'Loaded conversation',
          title: data.title
        })
      } catch (error) {
        console.error('Error loading conversation:', error)
      }
    }
  },

  getters: {
    getMessagesByAgentId: (state) => (agentId: string) => {
      const currentConversation = state.conversations[agentId]?.[0]
      return currentConversation?.messages || []
    },

    getConversationsByAgentId: (state) => (agentId: string) => 
      state.conversations[agentId] || [],
      
    getCurrentConversation: (state) => (agentId: string, conversationId?: string) => {
      const conversations = state.conversations[agentId] || []
      return conversationId 
        ? conversations.find(c => c.id === conversationId)
        : conversations[0]
    }
  }
})