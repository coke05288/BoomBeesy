import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ChatListItem from './ChatListItem'
import styles from '../styles/components/ChatCarousel.module.css'

interface ChatCarouselProps {
  chats: Array<{ id: string; title: string }>
  activeChat: string
  onChatSelect: (chatId: string) => void
  onChatClick: (chatId: string) => void
}

const ChatCarousel: React.FC<ChatCarouselProps> = ({
  chats,
  activeChat,
  onChatSelect,
  onChatClick
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [centerIndex, setCenterIndex] = useState(0)

  // activeChat이 변경될 때마다 centerIndex 업데이트
  useEffect(() => {
    const newIndex = chats.findIndex(chat => chat.id === activeChat)
    if (newIndex !== -1 && newIndex !== centerIndex) {
      setCenterIndex(newIndex)
    }
  }, [activeChat, chats, centerIndex])

  // 초기 스크롤 위치 설정
  useEffect(() => {
    if (scrollRef.current && chats.length > 0) {
      const initialIndex = chats.findIndex(chat => chat.id === activeChat)
      if (initialIndex !== -1) {
        setCenterIndex(initialIndex)
        scrollToIndex(initialIndex)
      }
    }
  }, [chats.length])

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return
      
      const container = scrollRef.current
      const scrollLeft = container.scrollLeft
      const containerWidth = container.offsetWidth
      const containerCenterX = scrollLeft + containerWidth / 2
      
      // 모든 아이템을 확인해서 화면 중앙에 가장 가까운 것 찾기
      const items = container.children
      let closestIndex = 0
      let minDistance = Infinity
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLElement
        const itemRect = item.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const itemCenterX = itemRect.left - containerRect.left + scrollLeft + itemRect.width / 2
        const distance = Math.abs(containerCenterX - itemCenterX)
        
        if (distance < minDistance) {
          minDistance = distance
          closestIndex = i
        }
      }
      
      if (closestIndex !== centerIndex && chats[closestIndex]) {
        setCenterIndex(closestIndex)
        onChatSelect(chats[closestIndex].id)
      }
    }

    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      // 초기 중앙 아이템도 감지
      handleScroll()
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [centerIndex, chats, onChatSelect])

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current || index >= chats.length) return
    
    const container = scrollRef.current
    const items = container.children
    const targetItem = items[index] as HTMLElement
    
    if (targetItem) {
      const containerWidth = container.offsetWidth
      const itemRect = targetItem.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const itemCenterX = targetItem.offsetLeft + targetItem.offsetWidth / 2
      const containerCenterX = containerWidth / 2
      const targetScroll = itemCenterX - containerCenterX
      
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className={styles.container}>
      {/* 그라디언트 페이드 효과 */}
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />

      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollRef}
        className={styles.scrollContainer}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: '50vw',
          paddingRight: '50vw'
        }}
      >
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            className={styles.itemWrapper}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <ChatListItem
              id={chat.id}
              title={chat.title}
              isActive={index === centerIndex}
              isCentered={index === centerIndex}
              onClick={() => {
                scrollToIndex(index)
                setTimeout(() => onChatClick(chat.id), 300)
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ChatCarousel