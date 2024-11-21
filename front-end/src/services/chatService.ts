import { useAuthStore } from '../stores/auth'

export interface ChatMessage {
  role: 'user' | 'agent'
  content: string
}

export async function sendChatMessage(
  message: string, 
  agentId: string, 
  sessionId?: string
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      agentId,
      userId: useAuthStore().user?.id,
      sessionId: sessionId || `${useAuthStore().user?.id}-${agentId}`
    })
  })

  if (!response.ok) {
    throw new Error('Failed to send message')
  }

  const data = await response.json()
  return data.content
} 