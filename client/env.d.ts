/// <reference types="vite/client" />

// TypeScript를 위한 인텔리센스
interface ImportMetaEnv {
  readonly VITE_APP_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
