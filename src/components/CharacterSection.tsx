import React from 'react'
import { motion } from 'framer-motion'
import BoomBusyCharacter from './BoomBusyCharacter'
import styles from '../styles/components/CharacterSection.module.css'

interface CharacterSectionProps {}

const CharacterSection: React.FC<CharacterSectionProps> = () => {
  return (
    <div className={styles.container}>
      {/* 캐릭터 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.characterWrapper}
      >
        <BoomBusyCharacter size="lg" />
      </motion.div>
    </div>
  )
}

export default CharacterSection