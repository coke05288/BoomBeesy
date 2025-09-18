import React from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/components/ChatListItem.module.css'

interface ChatListItemProps {
  id: string
  title: string
  isActive: boolean
  isCentered?: boolean
  onClick: () => void
}

const ChatListItem: React.FC<ChatListItemProps> = ({ 
  id, 
  title, 
  isActive, 
  isCentered = false,
  onClick 
}) => {
  return (
    <motion.div
      className={styles.container}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isCentered ? 1.4 : 1,
        y: isCentered ? -4 : 0
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <button
        onClick={onClick}
        className={`${styles.button} ${
           isActive
             ? styles.buttonActive
             : styles.buttonInactive
        }`}
      >
        <div className={`${styles.dot} ${
          isActive ? styles.dotActive : styles.dotInactive
        }`} />
      </button>
      
    </motion.div>
  )
}

export default ChatListItem