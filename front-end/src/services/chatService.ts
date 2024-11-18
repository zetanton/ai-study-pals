import axios from 'axios'

export interface ChatMessage {
  role: 'user' | 'agent'
  content: string
}

export async function sendChatMessage(message: string, agentId: string): Promise<string> {
  try {
    const response = await axios.post('/api/chat', {
      message,
      agentId
    })
    return response.data.content
  } catch (error) {
    console.error('Error sending chat message:', error)
    throw error
  }
} 