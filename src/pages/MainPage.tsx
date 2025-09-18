import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MainContent from '../components/MainContent'
import styles from '../styles/pages/MainPage.module.css'

const MainPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'chat' | 'planner' | 'storage'>('chat')

  // URL 경로에 따라 활성 탭 설정
  useEffect(() => {
    const path = location.pathname
    if (path === '/planner') {
      setActiveTab('planner')
    } else if (path === '/archive') {
      setActiveTab('storage')
    } else {
      setActiveTab('chat')
    }
  }, [location.pathname])

  const handleCreateChat = (title: string) => {
    const newChatId = Date.now().toString()
    navigate(`/chat/${newChatId}`, { state: { title, isNew: true } })
  }

  return (
    <div className={styles.container}>
      <MainContent activeTab={activeTab} onCreateChat={handleCreateChat} />
    </div>
  )
}

export default MainPage