import React, { Component, ReactNode } from 'react'
import styles from '../styles/components/ErrorBoundary.module.css'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <h1 className={styles.title}>
              앗, 문제가 발생했어요!
            </h1>
            <div className={styles.emoji}>😵</div>
            <p className={styles.message}>
              <span>예상치 못한 오류가 발생했습니다.</span>
              <span>페이지를 새로고침해주세요.</span>
            </p>
            <button
              onClick={() => window.location.reload()}
              className={styles.reloadButton}
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary