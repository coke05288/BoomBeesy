import React from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/components/TitleSection.module.css'

const TitleSection: React.FC = () => {
  return (
    <div  className={styles.container}>
      {/* <div className={styles.logoContainer}>
        <div className={styles.logo}>AI</div>
      </div> */}
      <h1 className={styles.title}>붐비지</h1>
      <p className={styles.subtitle}>Today's HangOut</p>
      <p className={styles.description}>대전광역시의 핫플레이스, 어디로 놀러갈래?</p>
    </div>
  )
}

export default TitleSection