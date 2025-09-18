import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/components/SimpleChatList.module.css'

interface ChatItem {
  id: string
  title: string
  lastMessage?: string
  timestamp?: string
  isActive?: boolean
}

interface SimpleChatListProps {
  isMobile?: boolean
  chats: ChatItem[]
  onChatClick?: (chatId: string) => void
}

const SimpleChatList: React.FC<SimpleChatListProps> = ({ chats, onChatClick, isMobile = false }) => {
  const navigate = useNavigate()

  const handleChatClick = (chatId: string) => {
    if (onChatClick) {
      onChatClick(chatId)
    } else {
      navigate(`/chat/${chatId}`)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {isMobile && <h3 className={styles.title}>채팅 목록</h3>}
      </div>

      <div className={styles.chatList}>
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`${styles.chatItem} ${chat.isActive ? styles.chatItemActive : ''}`}
            onClick={() => handleChatClick(chat.id)}
          >
            <div className={styles.chatIcon}>
              <MessageSquare className="w-4 h-4" />
            </div>

            <div className={styles.chatContent}>
              <h4 className={styles.chatTitle}>{chat.title}</h4>
              {chat.lastMessage && (
                <p className={styles.lastMessage}>{chat.lastMessage}</p>
              )}
            </div>

            <div className={styles.chatActions}>
              {chat.timestamp && (
                <span className={styles.timestamp}>{chat.timestamp}</span>
              )}
              <button className={styles.moreButton}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}

        {chats.length === 0 && (
          <div className={styles.emptyState}>
            <MessageSquare className="w-12 h-12 text-primary-400 mb-2" />
            <p className={styles.emptyText}>아직 채팅이 없습니다</p>
            <p className={styles.emptySubtext}>새로운 대화를 시작해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SimpleChatList