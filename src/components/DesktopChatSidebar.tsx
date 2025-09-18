import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import SimpleChatList from './SimpleChatList'
import styles from '../styles/components/DesktopChatSidebar.module.css'

interface ChatItem {
  id: string
  title: string
  lastMessage?: string
  timestamp?: string
  isActive?: boolean
}

interface DesktopChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  chats: ChatItem[]
  onChatClick?: (chatId: string) => void
}

const DesktopChatSidebar: React.FC<DesktopChatSidebarProps> = ({
  isOpen,
  onClose,
  chats,
  onChatClick
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Side Panel */}
          <motion.div
            className={styles.sidebar}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 40 }}
          >
            <div className={styles.header}>
              <h3 className={styles.title}>채팅 목록</h3>
              <button onClick={onClose} className={styles.closeButton}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={styles.content}>
              <SimpleChatList
                chats={chats}
                isMobile={false}
                onChatClick={(chatId) => {
                  onChatClick?.(chatId)
                  onClose()
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default DesktopChatSidebar