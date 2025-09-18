import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import TitleSection from '../TitleSection'
import ChatInput from '../ChatInput'
import ChatListSection from '../ChatListSection'
import BottomNavigation from '../BottomNavigation'
import styles from '../../styles/components/sections/ChatSection.module.css'

interface ChatSectionProps {
  onCreateChat: (title: string) => void
}

const ChatSection: React.FC<ChatSectionProps> = ({ onCreateChat }) => {

  return (
    <div className={styles.container}>
      {/* 타이틀 섹션 */}
      <div className={styles.titleSection}>
        <TitleSection />
      </div>

      {/* 채팅 입력창 */}
      <motion.div
        className={styles.chatInputSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ChatInput onCreateChat={onCreateChat} />
      </motion.div>

      {/* 플로팅 버튼 - 추후 추가 예정 */}
      {/* <BottomNavigation onCreateChat={onCreateChat} /> */}
    </div>
  )
}

export default ChatSection