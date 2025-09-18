import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Lock } from 'lucide-react'
import styles from '../styles/components/LoginModal.module.css'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (success: boolean) => void
}

export const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // 더미 인증 로직
    await new Promise(resolve => setTimeout(resolve, 800)) // 로딩 시뮬레이션

    if (username === 'tourapi' && password === 'tourapi') {
      onLogin(true)
      onClose()
      setUsername('')
      setPassword('')
    } else {
      setError('아이디 또는 비밀번호가 잘못되었습니다.')
      onLogin(false)
    }

    setIsLoading(false)
  }

  const handleClose = () => {
    setUsername('')
    setPassword('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.overlay}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={styles.modal}
        >
          {/* 헤더 */}
          <div className={styles.header}>
            <h2 className={styles.title}>로그인</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className={styles.closeButton}
            >
              <X className={styles.closeIcon} />
            </motion.button>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* 아이디 입력 */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                아이디
              </label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.input}
                  placeholder="아이디를 입력해주세요."
                  required
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                비밀번호
              </label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="비밀번호를 입력해주세요."
                  required
                />
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.error}
              >
                {error}
              </motion.div>
            )}

            {/* 로그인 버튼 */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className={`${styles.loginButton} ${
                isLoading ? styles.loginButtonDisabled : styles.loginButtonEnabled
              }`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </motion.button>
          </form>

          {/* 더미 계정 안내 */}
          {/* <div className={styles.testAccountInfo}>
            <p className={styles.testAccountText}>
              테스트 계정: tourapi / tourapi
            </p>
          </div> */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}