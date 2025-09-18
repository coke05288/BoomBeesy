import React from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/components/ChatCard.module.css'

interface ChatCardProps {
  title: string
  date: string
  onClick: () => void
}

const ChatCard: React.FC<ChatCardProps> = ({ title, date, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={styles.card}
      onClick={onClick}
    >
      <h3 className={styles.title}>
        {title}
      </h3>
      <div className={styles.footer}>
        <p className={styles.date}>
          {date}
        </p>
        <div className={styles.indicator} />
      </div>
    </motion.div>
  )
}

export default ChatCard