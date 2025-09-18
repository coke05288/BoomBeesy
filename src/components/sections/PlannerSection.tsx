import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Plus } from 'lucide-react'
import styles from '../../styles/components/sections/PlannerSection.module.css'

const PlannerSection: React.FC = () => {
  const upcomingPlans = [
    {
      id: '1',
      title: '제주도 3박 4일 여행',
      date: '2024.12.25 - 12.28',
      location: '제주도',
      status: '예정'
    },
    {
      id: '2',
      title: '서울 데이트 코스',
      date: '2024.12.30',
      location: '서울',
      status: '계획중'
    },
    {
      id: '3',
      title: '부산 맛집 투어',
      date: '2025.01.15',
      location: '부산',
      status: '예정'
    }
  ]

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <div
        className={styles.header}
      >
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <Calendar className="w-6 h-6" />
            플래너
          </h1>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.content}>
        {/* 다가오는 계획들 */}
        <div
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>다가오는 여행</h2>
          <div className={styles.planList}>
            {upcomingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={styles.planCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className={styles.planHeader}>
                  <h3 className={styles.planTitle}>{plan.title}</h3>
                  <span className={styles.planStatus}>{plan.status}</span>
                </div>
                <div className={styles.planInfo}>
                  <div className={styles.planDetail}>
                    <Clock className="w-4 h-4" />
                    <span>{plan.date}</span>
                  </div>
                  <div className={styles.planDetail}>
                    <MapPin className="w-4 h-4" />
                    <span>{plan.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 빈 상태일 때 표시할 내용 */}
        <motion.div
          className={styles.emptyState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Calendar className="w-16 h-16 text-gray-300" />
          <h3 className={styles.emptyTitle}>새로운 여행을 계획해보세요!</h3>
          <p className={styles.emptyDescription}>
            AI가 도와드릴게요. 어디로 가고 싶으신가요?
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default PlannerSection