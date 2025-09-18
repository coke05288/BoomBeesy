import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Menu } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import { chatService } from '../services/ai/chatService'
import type { ChatMessage as ChatMessageType } from '../services/ai/types'
import styles from '../styles/pages/ChatPage.module.css'

const ChatPage: React.FC = () => {
  const navigate = useNavigate()
  const { chatId } = useParams<{ chatId: string }>()
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 페이지 로드 시 pending message 확인하고 AI 요청 보내기
  useEffect(() => {
    const pendingMessage = sessionStorage.getItem('pendingMessage')
    if (pendingMessage && chatId) {
      sessionStorage.removeItem('pendingMessage')
      handleSendMessage(pendingMessage)
    }
  }, [chatId])

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim()
    if (!text || !chatId) return

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await chatService.sendMessage({
        message: text,
        chatId: chatId,
        conversationHistory: messages
      })

      if (response) {
        const aiMessage: ChatMessageType = {
          id: response.id,
          role: 'assistant',
          content: response.content,
          timestamp: response.timestamp
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        // 실패 시 기본 응답
        const fallbackMessage: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '죄송합니다. 현재 응답을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, fallbackMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // 에러 시 기본 응답
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={styles.container}>
      {/* 채팅 헤더 */}
      <header className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className={styles.backButton}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </div>
        <div className={styles.headerCenter}>
          <h1 className={styles.title}>유명한 관광지 소개해줘</h1>
          <p className={styles.subtitle}>2025년 09월 13일</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.menuButton}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className={styles.messagesContainer}>
        <div className={styles.messagesContent}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={styles.messageWrapper}
              >
                <ChatMessage
                  message={{
                    id: message.id,
                    text: message.content,
                    isUser: message.role === 'user',
                    timestamp: message.timestamp
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={styles.typingIndicator}
            >
              <div className={styles.typingBubble}>
                <div className={styles.typingDots}>
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                  <div className={styles.typingDot} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className={styles.inputSection}>
        <ChatInput
          onCreateChat={(message) => handleSendMessage(message)}
          placeholder="무엇이든 물어보세요"
          autoFocus={false}
          disableRouting={true}
          className={styles.chatInputWrapper}
        />
        <p className={styles.disclaimer}>
          AI로부터 부정확한 답변을 얻을 수 있으니 주의하세요
        </p>
      </div>
      </div>
  )
}

export default ChatPage