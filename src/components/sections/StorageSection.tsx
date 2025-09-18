import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Archive, Search, Filter, Star, MapPin, Calendar, MoreVertical } from 'lucide-react'
import styles from '../../styles/components/sections/StorageSection.module.css'

const StorageSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'place' | 'plan' | 'favorite'>('all')

  const savedItems = [
    {
      id: '1',
      type: 'place',
      title: '제주 숨은 카페 베스트 5',
      description: '현지인만 아는 제주도 숨은 카페들',
      location: '제주도',
      savedDate: '2024.12.20',
      tags: ['카페', '제주도', '힐링']
    },
    {
      id: '2',
      type: 'plan',
      title: '서울 2박 3일 완벽 코스',
      description: '경복궁부터 홍대까지 서울 핵심 코스',
      location: '서울',
      savedDate: '2024.12.18',
      tags: ['서울', '관광', '2박3일']
    },
    {
      id: '3',
      type: 'place',
      title: '부산 해변 맛집 리스트',
      description: '바다뷰와 함께하는 부산 맛집들',
      location: '부산',
      savedDate: '2024.12.15',
      tags: ['부산', '맛집', '해변']
    },
    {
      id: '4',
      type: 'favorite',
      title: '전국 벚꽃 명소 10곳',
      description: '봄에 꼭 가봐야 할 벚꽃 스팟들',
      location: '전국',
      savedDate: '2024.12.10',
      tags: ['벚꽃', '봄', '포토스팟']
    }
  ]

  const filteredItems = savedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesFilter
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'place':
        return <MapPin className="w-4 h-4" />
      case 'plan':
        return <Calendar className="w-4 h-4" />
      case 'favorite':
        return <Star className="w-4 h-4" />
      default:
        return <Archive className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'place':
        return 'bg-green-100 text-green-600'
      case 'plan':
        return 'bg-blue-100 text-blue-600'
      case 'favorite':
        return 'bg-yellow-100 text-yellow-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <div
        className={styles.header}
      >
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <Archive className="w-6 h-6" />
            보관함
          </h1>
        </div>

        {/* 검색 및 필터 */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="저장된 항목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterTabs}>
            <button
              className={`${styles.filterTab} ${filterType === 'all' ? styles.filterTabActive : ''}`}
              onClick={() => setFilterType('all')}
            >
              전체
            </button>
            <button
              className={`${styles.filterTab} ${filterType === 'place' ? styles.filterTabActive : ''}`}
              onClick={() => setFilterType('place')}
            >
              장소
            </button>
            <button
              className={`${styles.filterTab} ${filterType === 'plan' ? styles.filterTabActive : ''}`}
              onClick={() => setFilterType('plan')}
            >
              계획
            </button>
            <button
              className={`${styles.filterTab} ${filterType === 'favorite' ? styles.filterTabActive : ''}`}
              onClick={() => setFilterType('favorite')}
            >
              즐겨찾기
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.content}>
        {filteredItems.length > 0 ? (
          <div
            className={styles.itemGrid}
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className={styles.itemCard}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -2, scale: 1.02 }}
              >
                <div className={styles.itemHeader}>
                  <div className={`${styles.itemType} ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <button className={styles.itemMenu}>
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className={styles.itemContent}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemDescription}>{item.description}</p>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemLocation}>{item.location}</span>
                    <span className={styles.itemDate}>{item.savedDate}</span>
                  </div>
                  <div className={styles.itemTags}>
                    {item.tags.map(tag => (
                      <span key={tag} className={styles.itemTag}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className={styles.emptyState}
          >
            <Archive className="w-16 h-16 text-gray-300" />
            <h3 className={styles.emptyTitle}>저장된 항목이 없습니다</h3>
            <p className={styles.emptyDescription}>
              채팅하면서 마음에 드는 장소나 계획을 저장해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StorageSection