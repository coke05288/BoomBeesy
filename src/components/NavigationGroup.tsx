import React from 'react'
import { MessageSquare, Wrench, Gift, Archive, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import NavButton from './NavButton'
import styles from '../styles/components/NavigationGroup.module.css'

interface NavigationGroupProps {
    activeTab?: 'chat' | 'planner' | 'storage'
    onTabChange?: (tab: 'chat' | 'planner' | 'storage') => void
}

const NavigationGroup: React.FC<NavigationGroupProps> = ({ activeTab = 'chat', onTabChange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.2,
                ease: "easeInOut"
            }}
            className={styles.container}
        >
            <div className={styles.buttonGroup}>
                <div className={styles.navItem} onClick={() => onTabChange?.('chat')}>
                    <NavButton
                        icon={<MessageSquare className="w-5 h-5" />}
                        isActive={activeTab === 'chat'}
                    />
                    <span className={styles.navLabel}>채팅</span>
                </div>
                <div className={styles.navItem} onClick={() => onTabChange?.('planner')}>
                    <NavButton
                        icon={<Calendar className="w-5 h-5" />}
                        isActive={activeTab === 'planner'}
                    />
                    <span className={styles.navLabel}>플래너</span>
                </div>
                <div className={styles.navItem} onClick={() => onTabChange?.('storage')}>
                    <NavButton
                        icon={<Archive className="w-5 h-5" />}
                        isActive={activeTab === 'storage'}
                    />
                    <span className={styles.navLabel}>보관함</span>
                </div>
            </div>
        </motion.div>
    )
}

export default NavigationGroup