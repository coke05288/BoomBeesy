export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatRequest {
  message: string
  chatId: string
  conversationHistory?: ChatMessage[]
}

export interface ChatResponse {
  id: string
  content: string
  role: 'assistant'
  timestamp: Date
}

export interface StreamingChatResponse {
  id: string
  content: string
  isComplete: boolean
}