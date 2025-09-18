/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fafaf9',  // stone-50 - 메인 배경
          100: '#f5f5f4', // stone-100 - 카드 배경  
          200: '#e7e5e4', // stone-200 - 구분선
          400: '#a29a94ff', // stone-400 - 활성 텍스트
          500: '#78716c', // stone-500 - 비활성 텍스트
          600: '#57534e', // stone-600 - 보조 텍스트
          800: '#292524', // stone-800 - 주요 텍스트
        },
        accent: {
          yellow: '#facc15', // yellow-400 - 주요 버튼
          'yellow-hover': '#eab308', // yellow-500
          'yellow-light': '#fef3c7', // yellow-100
        },
        success: {
          DEFAULT: '#16a34a', // green-600 - 완료 체크
          light: '#dcfce7',   // green-100 - 완료 배경
        },
        // 미니멀한 보조 색상
        violet: {
          300: '#a785f7ff',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['sans-serif'],
      },
      fontSize: {
        // 더 작고 미니멀한 타이포그래피
        'xs': ['0.75rem', { lineHeight: '1rem' }],    // 12px
        'sm': ['0.8125rem', { lineHeight: '1.25rem' }], // 13px  
        'base': ['0.875rem', { lineHeight: '1.375rem' }], // 14px
        'lg': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'xl': ['1.125rem', { lineHeight: '1.625rem' }], // 18px
        '2xl': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
      },
      spacing: {
        // 더 컴팩트한 간격
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

