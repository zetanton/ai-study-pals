import { defineStore } from 'pinia'

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
    addMessage(agentId: string, message: Omit<Message, 'id'>) {
      const messages = this.messages[agentId] || []
      this.messages[agentId] = [...messages, {
        ...message,
        id: messages.length + 1
      }]
    }
  },
  getters: {
    getMessagesByAgentId: (state) => (agentId: string) => 
      state.messages[agentId] || []
  }
})