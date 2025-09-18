import React from 'react'
import { Archive, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import NavButton from './NavButton'
import styles from '../styles/components/NavigationBody.module.css'

interface NavigationBodyProps {
    activeTab?: 'storage' | 'chat' | 'events'
}

const NavigationBody: React.FC<NavigationBodyProps> = ({ activeTab = 'chat' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ 
                duration: 0.2,
                ease: "easeInOut"
            }}
            className={styles.container}
        >
            <div className={styles.buttonGroup}>
                <NavButton
                    icon={<Archive className="w-4 h-4" />}
                    isActive={activeTab === 'storage'}
                />
                <NavButton
                    icon={<Calendar className="w-4 h-4" />}
                    isActive={activeTab === 'events'}
                />
            </div>
        </motion.div>
    )
}

export default NavigationBody