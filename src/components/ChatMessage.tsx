import React from 'react'
import { motion } from 'framer-motion'
import { Message } from '../types/chat'
import BoomBusyCharacter from './BoomBusyCharacter'
import styles from '../styles/components/ChatMessage.module.css'

interface ChatMessageProps {
  message: Message
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${styles.container} ${
        message.isUser ? styles.containerUser : styles.containerBot
      }`}
    >
      <div className={styles.messageWrapper}>
        {!message.isUser && (
          <div className={styles.botHeader}>
            <div className={styles.botAvatar}>
              <BoomBusyCharacter size="sm" animate={false} />
            </div>
            <span className={styles.botName}>
              붐비지
            </span>
          </div>
        )}

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`${styles.messageContent} ${
            message.isUser
              ? styles.messageUser
              : styles.messageBot
          }`}
        >
          <p className={styles.messageText}>
            {message.text}
          </p>
        </motion.div>

        <div className={`${styles.timestamp} ${
          message.isUser ? styles.timestampUser : styles.timestampBot
        }`}>
          {message.timestamp.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage