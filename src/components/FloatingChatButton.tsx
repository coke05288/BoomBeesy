import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, ArrowUp } from 'lucide-react'
import styles from '../styles/components/FloatingChatButton.module.css'

interface FloatingChatButtonProps {
  onCreateChat: (title: string) => void
  className?: string
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  onCreateChat,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [hasError, setHasError] = useState(false)

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault()
    if (inputValue.trim()) {
      onCreateChat(inputValue.trim())
      setInputValue('')
      setHasError(false)
      handleClose()
    } else {
      setHasError(true)
      setTimeout(() => setHasError(false), 2000)
    }
  }

  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleClose = () => {
    setIsClosing(true)
    setHasError(false)
    setTimeout(() => {
      setIsExpanded(false)
      setIsClosing(false)
      setInputValue('')
    }, 100)
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="plus-button"
            initial={{ scale: 0 }}
            animate={{ scale: 0.95 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExpand}
            className={styles.plusButton}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        ) : (
          <motion.div
            key="input-form"
            initial={{
              width: 48,
              height: 48,
              borderRadius: '50%'
            }}
            animate={{
              width: 320,
              height: 48,
              borderRadius: '24px'
            }}
            exit={isClosing ? {
              width: 48,
              height: 48,
              borderRadius: '50%'
            } : {
              width: 280,
              height: 48,
              borderRadius: '24px'
            }}
            transition={isClosing ? {
              width: { type: "spring", stiffness: 300, damping: 30, delay: 0.2 },
              height: { type: "spring", stiffness: 300, damping: 30, delay: 0.2 },
              borderRadius: { delay: 0.3, duration: 0.2 }
            } : {
              width: { type: "spring", stiffness: 300, damping: 30 },
              height: { type: "spring", stiffness: 300, damping: 30 },
              borderRadius: { delay: 0.1, duration: 0.3 }
            }}
            className={styles.inputFormContainer}
            style={{
              transformOrigin: 'center center'
            }}
          >
            <motion.form
              onSubmit={handleSubmit}
              className={styles.form}
              initial={{ opacity: 1 }}
              animate={{ opacity: isClosing ? 0 : 1 }}
              transition={{ duration: isClosing ? 0.2 : 0.15 }}
            >
              <div className={styles.inputWrapper}>
                <motion.input
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isClosing ? 0 : 1 }}
                  transition={{
                    opacity: isClosing ? { duration: 0.15 } : { delay: 0.2, duration: 0.2 }
                  }}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    if (hasError) setHasError(false)
                  }}
                  placeholder={"채팅 제목을 입력해주세요"}
                  autoFocus
                  className={`${styles.input} ${
                    hasError ? styles.inputError : styles.inputNormal
                  }`}
                />

                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isClosing ? 0 : 1, scale: isClosing ? 0 : 1 }}
                  transition={{
                    delay: isClosing ? 0 : 0.3,
                    duration: isClosing ? 0.15 : 0.2
                  }}
                  type="button"
                  onClick={handleSubmit}
                  className={styles.submitButton}
                >
                  <ArrowUp className="w-3 h-3" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isClosing ? 0 : 1, scale: isClosing ? 0 : 1 }}
                  transition={{
                    delay: isClosing ? 0 : 0.25,
                    duration: isClosing ? 0.15 : 0.2
                  }}
                  type="button"
                  onClick={handleClose}
                  className={styles.closeButton}
                >
                  <X className="w-3 h-3" />
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FloatingChatButton