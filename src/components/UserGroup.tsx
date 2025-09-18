import React from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/components/UserGroup.module.css'

interface UserGroupProps {
  showAuthButtons?: boolean
}

const UserGroup: React.FC<UserGroupProps> = ({
  showAuthButtons = true
}) => {
  if (!showAuthButtons) return null

  return (
    <div className={styles.container}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={styles.loginButton}
      >
        로그인
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={styles.signupButton}
      >
        회원가입
      </motion.button>
    </div>
  )
}

export default UserGroup