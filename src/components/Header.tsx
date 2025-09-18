import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import NavigationGroup from './NavigationGroup'
import UserGroup from './UserGroup'
import MobileSidePanel from './MobileSidePanel'
import SimpleChatList from './SimpleChatList'
import DesktopChatSidebar from './DesktopChatSidebar'
import styles from '../styles/components/Header.module.css'

interface HeaderProps {
  activeTab?: 'chat' | 'planner' | 'storage'
  onTabChange?: (tab: 'chat' | 'planner' | 'storage') => void
}

const Header: React.FC<HeaderProps> = ({
  activeTab = 'chat',
  onTabChange
}) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [isDesktopChatOpen, setIsDesktopChatOpen] = useState(false)

  // 샘플 채팅 데이터
  const sampleChats = [
    { id: '1', title: '제주도 여행 계획', lastMessage: '숙소 추천 부탁드려요', timestamp: '오전 10:30' },
    { id: '2', title: '서울 맛집 탐방', lastMessage: '홍대 근처 맛집 알려주세요', timestamp: '어제' },
    { id: '3', title: '부산 여행 코스', lastMessage: '해운대 말고 다른 곳도...', timestamp: '3일 전' },
    { id: '4', title: '경주 역사 여행', lastMessage: '불국사 관람 시간은?', timestamp: '1주 전' },
  ]
  return (
    <>
      <aside className={styles.header}>
        <div className={styles.container}>
          {/* 모바일 햄버거 버튼 */}
          <div className={styles.mobileHamburger}>
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className={styles.hamburgerButton}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* 서비스 제목 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.titleSection}
          >
            <h1 className={styles.title} onClick={() => onTabChange?.('chat')}>
              <span className={styles.titleMain}>붐비지</span>
            </h1>
          </motion.div>

          {/* 데스크톱 네비게이션 그룹 */}
          <div className={styles.navigationSection}>
            <NavigationGroup activeTab={activeTab} onTabChange={onTabChange} />
          </div>

          {/* 데스크톱 햄버거 버튼 */}
          <div className={styles.desktopHamburger}>
            <button
              onClick={() => setIsDesktopChatOpen(!isDesktopChatOpen)}
              className={styles.hamburgerButton}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* 모바일에서만 보이는 UserGroup */}
          <div className={styles.mobileUserGroup}>
            <UserGroup showAuthButtons={true} />
          </div>
        </div>
      </aside>

      {/* 모바일 사이드 패널 */}
      <MobileSidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        activeTab={activeTab}
        onTabChange={onTabChange || (() => {})}
      >
        <SimpleChatList chats={sampleChats} isMobile={true} />
      </MobileSidePanel>

      {/* 데스크톱 채팅 사이드바 - Header 오른쪽에서 시작 */}
      <DesktopChatSidebar
        isOpen={isDesktopChatOpen}
        onClose={() => setIsDesktopChatOpen(false)}
        chats={sampleChats}
      />
    </>
  )
}

export default Header