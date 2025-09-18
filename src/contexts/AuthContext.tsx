import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  username: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (username: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 페이지 로드 시 localStorage에서 로그인 상태 확인
  useEffect(() => {
    const savedUser = localStorage.getItem('boombeesy_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('boombeesy_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (username: string) => {
    const user: User = {
      id: Date.now().toString(),
      username
    }
    setUser(user)
    localStorage.setItem('boombeesy_user', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('boombeesy_user')
  }

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}