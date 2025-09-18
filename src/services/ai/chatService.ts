import { apiClient } from '../api'
import type {
  ChatRequest,
  ChatResponse,
  ChatMessage,
  StreamingChatResponse
} from './types'

export class ChatService {
  private static instance: ChatService

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService()
    }
    return ChatService.instance
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse | null> {
    try {
      const response = await apiClient.post<ChatResponse>('/api/chat/message', {
        message: request.message,
        chatId: request.chatId,
        conversationHistory: request.conversationHistory || []
      })

      if (response.success) {
        return response.data
      } else {
        console.error('Chat request failed:', response.error)
        return null
      }
    } catch (error) {
      console.error('Error sending chat message:', error)
      return null
    }
  }

  async *sendMessageStream(request: ChatRequest): AsyncGenerator<StreamingChatResponse> {
    try {
      const response = await fetch(`${apiClient}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: request.message,
          chatId: request.chatId,
          conversationHistory: request.conversationHistory || []
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Response body is not readable')
      }

      let buffer = ''
      const messageId = Date.now().toString()

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              yield {
                id: messageId,
                content: data.content || '',
                isComplete: data.isComplete || false
              }
            } catch (error) {
              console.warn('Failed to parse streaming data:', line)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in streaming chat:', error)
      yield {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error while processing your request.',
        isComplete: true
      }
    }
  }

  // 대화 기록 관리
  async getChatHistory(chatId: string): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get<ChatMessage[]>(`/api/chat/${chatId}/history`)

      if (response.success) {
        return response.data || []
      } else {
        console.error('Failed to fetch chat history:', response.error)
        return []
      }
    } catch (error) {
      console.error('Error fetching chat history:', error)
      return []
    }
  }

  async saveChatMessage(chatId: string, message: ChatMessage): Promise<boolean> {
    try {
      const response = await apiClient.post(`/api/chat/${chatId}/save`, message)
      return response.success
    } catch (error) {
      console.error('Error saving chat message:', error)
      return false
    }
  }
}

export const chatService = ChatService.getInstance()