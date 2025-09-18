// API 기본 설정
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// OpenAI 호환 채팅 타입 정의
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionRequest {
  model: string
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: ChatMessage
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    total_tokens: number
    completion_tokens: number
  }
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// HTTP 클라이언트 기본 설정
export const createApiClient = () => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  return {
    async request<T = any>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
      const url = `${API_BASE_URL}${endpoint}`

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
      } catch (error) {
        console.error('API request failed:', error)
        return {
          success: false,
          data: null as T,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },

    async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, { method: 'GET' })
    },

    async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      })
    },

    async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      })
    },

    async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, { method: 'DELETE' })
    },
  }
}

export const apiClient = createApiClient()

// 채팅 완료 API 호출
export const chatCompletions = async (
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> => {
  const response = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

// 한국어 AI 모델을 사용한 채팅 함수
export const sendChatMessage = async (
  userMessage: string,
  systemPrompt: string = '너는 친절한 한국어 도우미야.'
): Promise<string> => {
  try {
    const request: ChatCompletionRequest = {
      model: 'MLP-KTLim/llama-3-Korean-Bllossom-8B',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 256
    }

    const response = await chatCompletions(request)
    return response.choices[0]?.message?.content || '응답을 받을 수 없습니다.'
  } catch (error) {
    console.error('Chat API error:', error)
    throw new Error('AI 서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
  }
}