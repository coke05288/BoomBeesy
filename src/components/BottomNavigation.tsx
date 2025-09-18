import React from 'react'
import FloatingChatButton from './FloatingChatButton'
import styles from '../styles/components/BottomNavigation.module.css'

interface BottomNavigationProps {
    onCreateChat: (title: string) => void
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
    onCreateChat
}) => {

    return (
        <div className={styles.container}>
            <FloatingChatButton
                onCreateChat={onCreateChat}
            />
        </div>
    )
}

export default BottomNavigation