# BoomBeesy - AI 기반 관광지 추천 웹 서비스

혼잡도 기반 관광지 추천 AI 챗봇 서비스입니다. 실시간 데이터를 바탕으로 최적의 여행지와 방문 시간을 추천합니다.

## ✨ 주요 기능

- ** 실시간 혼잡도 분석**: AI가 관광지의 혼잡도를 실시간으로 분석하여 최적의 방문 시간 제안
- ** 개인 맞춤 추천**: 사용자의 여행 성향과 선호도에 기반한 맞춤형 여행지 추천
- ** 인터랙티브 챗봇**: 자연스러운 대화를 통한 여행 정보 제공
- ** 반응형 디자인**: 모든 기기에서 최적화된 사용자 경험
- ** 빠른 응답**: Vite 기반의 최적화된 웹 애플리케이션

## 🛠 기술 스택

### Frontend
- **React 18** - 모던 React 기능 활용
- **TypeScript** - 타입 안정성과 개발 생산성
- **Vite** - 빠른 개발 서버와 빌드 도구
- **Tailwind CSS** - 효율적인 스타일링
- **Framer Motion** - 부드러운 애니메이션
- **React Router** - 클라이언트 사이드 라우팅

### Tools & Libraries
- **Lucide React** - 아이콘 라이브러리
- **ESLint** - 코드 품질 관리
- **PostCSS** - CSS 후처리
- **Autoprefixer** - 브라우저 호환성

## 🚀 시작하기

### 필수 요구사항

- **Node.js** 18.0.0 이상
- **npm** 8.0.0 이상

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/yourusername/boombeesy-web.git
   cd boombeesy-web
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   
   브라우저에서 `http://localhost:3000`으로 접속

4. **빌드**
   ```bash
   npm run build
   ```

5. **프로덕션 미리보기**
   ```bash
   npm run preview
   ```

## 📁 프로젝트 구조

```
BoomBeesy/
├── src/
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── Header.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── FeatureCard.tsx
│   │   └── ErrorBoundary.tsx
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── HomePage.tsx
│   │   └── ChatPage.tsx
│   ├── types/            # TypeScript 타입 정의
│   │   └── chat.ts
│   ├── App.tsx           # 메인 애플리케이션 컴포넌트
│   ├── main.tsx          # 애플리케이션 진입점
│   └── index.css         # 전역 스타일
├── index.html            # HTML 템플릿
├── vite.config.ts        # Vite 설정
├── tailwind.config.js    # Tailwind CSS 설정
├── tsconfig.json         # TypeScript 설정
└── package.json          # 패키지 설정
```

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary (Violet)**: 주요 브랜드 색상
  - `violet-600`: #7c3aed (메인)
  - `violet-700`: #6d28d9 (hover)
  
- **Secondary (Yellow)**: 보조 색상  
  - `secondary-400`: #facc15
  - `secondary-500`: #eab308
  
- **Neutral**: 텍스트 및 배경
  - `gray-50`: #f8fafc (배경)
  - `gray-900`: #111827 (텍스트)

### 애니메이션

- **Framer Motion** 기반의 부드러운 전환 효과
- **Float 애니메이션**: 캐릭터 및 요소들의 자연스러운 움직임
- **Page Transitions**: 페이지 간 매끄러운 전환

## 🔧 개발 가이드

### 코드 스타일

```bash
# ESLint 실행
npm run lint

# ESLint 자동 수정
npm run lint:fix

# TypeScript 타입 체크
npm run type-check
```

### 환경 변수

`.env.local` 파일을 생성하여 환경별 설정을 관리:

```bash
VITE_API_URL=https://api.boombeesy.com
VITE_APP_TITLE=BoomBeesy
```

### 컴포넌트 작성 가이드

1. **TypeScript** 인터페이스로 props 타입 정의
2. **Tailwind CSS** 클래스를 활용한 스타일링
3. **Framer Motion**으로 애니메이션 추가
4. **React.FC** 타입 사용 권장

예시:
```tsx
import React from 'react'
import { motion } from 'framer-motion'

interface ComponentProps {
  title: string
  onClick: () => void
}

const Component: React.FC<ComponentProps> = ({ title, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      className="bg-violet-600 text-white px-4 py-2 rounded-lg"
      onClick={onClick}
    >
      {title}
    </motion.button>
  )
}

export default Component
```

## 📱 반응형 디자인

- **Mobile First**: 모바일 우선 설계
- **Breakpoints**: 
  - `sm`: 640px 이상
  - `md`: 768px 이상
  - `lg`: 1024px 이상
  - `xl`: 1280px 이상

## 🚀 배포

### Vercel (권장)

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 배포
vercel
```

### Netlify

```bash
# 빌드
npm run build

# dist 폴더를 Netlify에 업로드
```

## 🤝 기여하기

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

- **Email**: contact@boombeesy.com
- **GitHub**: [@boombeesy](https://github.com/boombeesy)
- **Website**: [https://boombeesy.com](https://boombeesy.com)

---

**BoomBeesy**로 더 스마트하고 즐거운 여행을 계획해보세요! 🌟