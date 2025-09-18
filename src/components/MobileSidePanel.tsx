import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Calendar, Archive } from 'lucide-react'
import styles from '../styles/components/MobileSidePanel.module.css'

interface MobileSidePanelProps {
  isOpen: boolean
  onClose: () => void
  activeTab: 'chat' | 'planner' | 'storage'
  onTabChange: (tab: 'chat' | 'planner' | 'storage') => void
  children?: React.ReactNode
}

const MobileSidePanel: React.FC<MobileSidePanelProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  children
}) => {
  const navigationItems = [
    { id: 'chat', icon: <MessageSquare className="w-5 h-5" />, label: '채팅' },
    { id: 'planner', icon: <Calendar className="w-5 h-5" />, label: '도구' },
    { id: 'storage', icon: <Archive className="w-5 h-5" />, label: '해택' },
    { id: 'bookmarks', icon: <Archive className="w-5 h-5" />, label: '저장됨' },
  ]

  const handleTabClick = (tab: 'chat' | 'planner' | 'storage') => {
    onTabChange(tab)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Side Panel */}
          <motion.div
            className={styles.panel}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className={styles.header}>
              {/* Logo and Title */}
              <div className={styles.logoSection}>
                <div className={styles.logo}>
                  {/* <span className={styles.logoIcon}>AI</span> */}
                  <span className={styles.logoText}>붐비지</span>
                </div>
              </div>

              {/* Close Button */}
              <button onClick={onClose} className={styles.closeButton}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className={styles.navigation}>
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id as 'chat' | 'planner' | 'storage')}
                  className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ''}`}
                >
                  {item.icon}
                  <span className={styles.navLabel}>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className={styles.content}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileSidePanel