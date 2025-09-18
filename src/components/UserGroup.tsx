import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { LoginModal } from './LoginModal'
import styles from '../styles/components/UserGroup.module.css'

interface UserGroupProps {
  showAuthButtons?: boolean
}

const UserGroup: React.FC<UserGroupProps> = ({
  showAuthButtons = true
}) => {
  const { user, isLoggedIn, login, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (!showAuthButtons) return null

  const handleLogin = (success: boolean) => {
    if (success) {
      login('tourapi')
    }
  }

  if (isLoggedIn && user) {
    return (
      <div className={styles.container}>
        <div className="text-sm text-gray-600  mr-2">
          안녕하세요, {user.username}님!
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className={styles.logoutButton}
        >
          로그아웃
        </motion.button>
      </div>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLoginModal(true)}
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

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </>
  )
}

export default UserGroup