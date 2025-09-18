import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import UserGroup from './components/UserGroup'
import MainPage from './pages/MainPage'
import ChatPage from './pages/ChatPage'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'chat' | 'planner' | 'storage'>('chat')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // 초기 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // URL 경로에 따라 활성 탭 설정
  useEffect(() => {
    const path = location.pathname
    if (path === '/planner') {
      setActiveTab('planner')
    } else if (path === '/archive') {
      setActiveTab('storage')
    } else if (path.startsWith('/chat/')) {
      setActiveTab('chat')
    } else {
      setActiveTab('chat')
    }
  }, [location.pathname])

  const handleTabChange = (tab: 'chat' | 'planner' | 'storage') => {
    setActiveTab(tab)

    // 실제 라우팅 수행
    if (tab === 'chat') {
      navigate('/')
    } else if (tab === 'planner') {
      navigate('/planner')
    } else if (tab === 'storage') {
      navigate('/archive')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-secondary-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 text-6xl"
          >
            🤖
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">BoomBeesy</h2>
          <p className="text-gray-600">AI 여행 추천 서비스를 준비 중입니다...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-primary-50 flex flex-col md:flex-row">
          {/* Header - 모바일에서는 상단, 데스크톱에서는 사이드 */}
          <Header activeTab={activeTab} onTabChange={handleTabChange} />

          {/* 데스크톱에서만 보이는 UserGroup */}
          <div className="hidden md:block">
            <UserGroup showAuthButtons={true} />
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 ml-0 mt-16 md:ml-20 md:mt-0">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/planner" element={<MainPage />} />
                <Route path="/archive" element={<MainPage />} />
                <Route path="/chat/:chatId?" element={<ChatPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </div>
      </ErrorBoundary>
    </AuthProvider>
  )
}

export default App