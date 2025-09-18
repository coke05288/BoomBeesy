import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, ArrowUp, Globe, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoginModal } from './LoginModal'
import styles from '../styles/components/ChatInput.module.css'

interface ChatInputProps {
  onCreateChat?: (title: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
  disableRouting?: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({
  onCreateChat,
  placeholder = "무엇이든 물어보세요",
  className = '',
  autoFocus = true,
  disableRouting = false
}) => {
  const [inputValue, setInputValue] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const navigate = useNavigate()
  const { isLoggedIn, login } = useAuth()

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  // textarea 높이 자동 조절
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleLogin = (success: boolean) => {
    if (success) {
      login('tourapi')
      // 로그인 성공 후 원래 하려던 작업 수행
      proceedWithSubmit()
    }
  }

  const proceedWithSubmit = () => {
    if (inputValue.trim()) {
      console.log('Message:', inputValue.trim())

      if (onCreateChat) {
        onCreateChat(inputValue.trim())
      }

      if (!disableRouting) {
        const chatId = Date.now().toString()
        console.log('Creating chat with ID:', chatId)

        // 채팅 내용을 세션 스토리지에 저장
        sessionStorage.setItem('pendingMessage', inputValue.trim())

        // 채팅 페이지로 라우팅
        console.log('Navigating to:', `/chat/${chatId}`)
        navigate(`/chat/${chatId}`)
      }

      setInputValue('')
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    // 로그인 체크
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    proceedWithSubmit()
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          {/* <button type="button" className={styles.actionButton}>
            <Plus className="w-4 h-4" />
          </button> */}

          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={styles.input}
            rows={1}
            style={{ resize: 'none', minHeight: '20px', maxHeight: '120px', overflow: 'hidden' }}
          />

          <div className={styles.rightActions}>
            {/* <button type="button" className={styles.actionButton}>
              <Globe className="w-4 h-4" />
            </button>
            <button type="button" className={styles.actionButton}>
              <User className="w-4 h-4" />
            </button> */}
            <motion.button
              type="button"
              onClick={handleSubmit}
              className={styles.submitButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </form>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}

export default ChatInput