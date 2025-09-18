import React from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/components/NavButton.module.css'

interface NavButtonProps {
  icon: React.ReactNode
  isActive: boolean
  onClick?: () => void
}

const NavButton: React.FC<NavButtonProps> = ({ 
  icon, 
  isActive, 
  onClick 
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${styles.button} ${
        isActive
          ? styles.buttonActive
          : styles.buttonInactive
      }`}
    >
      <div className={styles.iconWrapper}>
        {icon}
      </div>
    </motion.button>
  )
}

export default NavButton