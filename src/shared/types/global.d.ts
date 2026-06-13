/// <reference types="vite/client" />

interface Window {
  Kakao: {
    init: (key: string) => void
    isInitialized: () => boolean
    cleanup: () => void
    Auth: {
      login: (settings: {
        scope: string
        success: (authObj: { access_token: string }) => void
        fail: (error: unknown) => void
      }) => void
    }
  }
}
