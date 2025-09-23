/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_HUGGINGFACE_API_KEY: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VERCEL_URL: string
  readonly VERCEL_ENV: string
  readonly AI_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}