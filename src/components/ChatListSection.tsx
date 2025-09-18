import React from 'react'
import ChatCarousel from './ChatCarousel'
import ChatCard from './ChatCard'
import styles from '../styles/components/ChatListSection.module.css'

interface ChatListSectionProps {
  chatList: Array<{ id: string; title: string }>
  activeChat: string
  onChatSelect: (chatId: string) => void
  onChatClick: (chatId: string) => void
}

const ChatListSection: React.FC<ChatListSectionProps> = ({
  chatList,
  activeChat,
  onChatSelect,
  onChatClick
}) => {
  const currentChat = chatList.find(chat => chat.id === activeChat)

  return (
    <div className={styles.container}>
      {/* 현재 선택된 채팅 카드 */}
      {currentChat ? (
        <div className={styles.currentChatWrapper}>
          <ChatCard
            title={currentChat.title}
            date="2025.08.31"
            onClick={() => onChatClick(currentChat.id)}
          />
        </div>
      ) : (
        <div className={styles.currentChatWrapper}>
          <div className={styles.noSelection}>선택된 채팅이 없습니다</div>
        </div>
      )}
      
      {/* 채팅 캐러셀 */}
      <ChatCarousel
        chats={chatList}
        activeChat={activeChat}
        onChatSelect={onChatSelect}
        onChatClick={onChatClick}
      />
    </div>
  )
}

export default ChatListSection