import React from 'react'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import styles from '../styles/components/HamburgerMenu.module.css'

interface HamburgerMenuProps {
  onClick: () => void
  isOpen: boolean
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onClick, isOpen }) => {
  return (
    <motion.button
      onClick={onClick}
      className={styles.button}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Menu className="w-6 h-6" />
    </motion.button>
  )
}

export default HamburgerMenu