import React from 'react'
import ChatSection from './sections/ChatSection'
import PlannerSection from './sections/PlannerSection'
import StorageSection from './sections/StorageSection'
import styles from '../styles/components/MainContent.module.css'

interface MainContentProps {
  activeTab: 'chat' | 'planner' | 'storage'
  onCreateChat: (title: string) => void
}

const MainContent: React.FC<MainContentProps> = ({ activeTab, onCreateChat }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatSection onCreateChat={onCreateChat} />
      case 'planner':
        return <PlannerSection />
      case 'storage':
        return <StorageSection />
      default:
        return <ChatSection onCreateChat={onCreateChat} />
    }
  }

  return (
    <div className={styles.container}>
      {renderContent()}
    </div>
  )
}

export default MainContent