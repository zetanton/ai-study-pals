import { defineStore } from 'pinia'
import { sendChatMessage } from '../services/chatService'

export interface Message {
  id: number
  content: string
  sender: 'user' | 'agent'
}

export const useMessageStore = defineStore('messages', {
  state: () => ({
    messages: {} as Record<string, Message[]>
  }),
  actions: {
    initializeChat(agentId: string) {
      if (!this.messages[agentId]) {
        this.messages[agentId] = [
          { 
            id: 1, 
            content: 'Hello! How can I help you today?', 
            sender: 'agent' 
          }
        ]
      }
    },
    async addMessage(agentId: string, message: Omit<Message, 'id'>) {
      const messages = this.messages[agentId] || []
      const newMessage = {
        ...message,
        id: messages.length + 1
      }
      
      this.messages[agentId] = [...messages, newMessage]

      if (message.sender === 'user') {
        try {
          const response = await sendChatMessage(message.content, agentId)
          this.messages[agentId] = [...this.messages[agentId], {
            id: this.messages[agentId].length + 1,
            content: response,
            sender: 'agent'
          }]
        } catch (error) {
          console.error('Error getting AI response:', error)
          this.messages[agentId] = [...this.messages[agentId], {
            id: this.messages[agentId].length + 1,
            content: 'Sorry, I encountered an error. Please try again.',
            sender: 'agent'
          }]
        }
      }
    },
    clearMessages(agentId: string) {
      this.messages[agentId] = [
        { 
          id: 1, 
          content: 'Hello! How can I help you today?', 
          sender: 'agent' 
        }
      ]
    }
  },
  getters: {
    getMessagesByAgentId: (state) => (agentId: string) => 
      state.messages[agentId] || []
  }
})