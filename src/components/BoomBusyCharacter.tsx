import React from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/components/BoomBusyCharacter.module.css'

interface BoomBusyCharacterProps {
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

const BoomBusyCharacter: React.FC<BoomBusyCharacterProps> = ({ 
  size = 'md',
  animate = true 
}) => {
  const sizeClasses = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg
  }

  const CharacterSVG = () => (
    <svg
      viewBox="0 0 100 100"
      className={styles.svg}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 캐릭터 몸체 (보라색) */}
      <motion.circle
        cx="50"
        cy="55"
        r="25"
        fill="#7C3AED"
        animate={animate ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* 안테나 (노랑) */}
      <motion.line
        x1="45"
        y1="30"
        x2="45"
        y2="20"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
        animate={animate ? { rotate: [-5, 5, -5] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '45px 30px' }}
      />
      <motion.circle
        cx="45"
        cy="18"
        r="3"
        fill="#FACC15"
        animate={animate ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />

      <motion.line
        x1="55"
        y1="30"
        x2="55"
        y2="20"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
        animate={animate ? { rotate: [5, -5, 5] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '55px 30px' }}
      />
      <motion.circle
        cx="55"
        cy="18"
        r="3"
        fill="#FACC15"
        animate={animate ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
      
      {/* 눈 */}
      <circle cx="43" cy="50" r="3" fill="white" />
      <circle cx="57" cy="50" r="3" fill="white" />
      <circle cx="43" cy="49" r="1.5" fill="black" />
      <circle cx="57" cy="49" r="1.5" fill="black" />
      
      {/* 입 (노랑) */}
      <motion.path
        d="M 45 60 Q 50 65 55 60"
        stroke="#FACC15"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        animate={animate ? { d: ["M 45 60 Q 50 65 55 60", "M 45 62 Q 50 58 55 62", "M 45 60 Q 50 65 55 60"] } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* 날개 (민트) */}
      <motion.ellipse
        cx="25"
        cy="45"
        rx="8"
        ry="15"
        fill="#34D399"
        opacity="0.8"
        animate={animate ? { 
          rotate: [0, 10, 0],
          scaleY: [1, 1.1, 1]
        } : {}}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ transformOrigin: '30px 45px' }}
      />
      <motion.ellipse
        cx="75"
        cy="45"
        rx="8"
        ry="15"
        fill="#34D399"
        opacity="0.8"
        animate={animate ? { 
          rotate: [0, -10, 0],
          scaleY: [1, 1.1, 1]
        } : {}}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ transformOrigin: '70px 45px' }}
      />
      
      {/* 작은 장식 점들 */}
      <circle cx="40" cy="40" r="1" fill="#FACC15" opacity="0.6" />
      <circle cx="60" cy="42" r="1" fill="#34D399" opacity="0.6" />
      <circle cx="45" cy="70" r="1" fill="#FACC15" opacity="0.6" />
      <circle cx="55" cy="72" r="1" fill="#34D399" opacity="0.6" />
    </svg>
  )

  return (
    <motion.div
      className={`${sizeClasses[size]} ${styles.container}`}
      animate={animate ? { y: [0, -5, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <CharacterSVG />
    </motion.div>
  )
}

export default BoomBusyCharacter