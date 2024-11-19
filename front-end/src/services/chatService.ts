import { useAuthStore } from '../stores/auth'
import axios from 'axios'

export interface ChatMessage {
  role: 'user' | 'agent'
  content: string
}

export async function sendChatMessage(message: string, agentId: string): Promise<string> {
  try {
    const authStore = useAuthStore()
    const userId = authStore.user?.id

    if (!userId) {
      throw new Error('User must be logged in to send messages');
    }

    console.log('Sending chat message:', {
      messageLength: message.length,
      agentId,
      userId
    });

    const response = await axios.post('/api/chat', {
      message,
      agentId,
      userId
    })

    if (!response.data || !response.data.content) {
      throw new Error('Invalid response format from server');
    }

    return response.data.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.error || 
                          'Failed to communicate with the chat service';
      console.error('Chat service error:', errorMessage);
      throw new Error(errorMessage);
    }
    throw error;
  }
} 