// API 기본 설정
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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
          data: null,
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