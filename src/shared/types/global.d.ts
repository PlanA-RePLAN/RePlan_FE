/// <reference types="vite/client" />

interface Window {
  google: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string
          callback: (response: { credential: string }) => void
        }) => void
        renderButton: (
          element: HTMLElement,
          options: {
            theme?: 'outline' | 'filled_blue' | 'filled_black'
            size?: 'large' | 'medium' | 'small'
            width?: number
            type?: 'standard' | 'icon'
          },
        ) => void
      }
    }
  }

  naver: {
    LoginWithNaverId: new (config: {
      clientId: string
      callbackUrl: string
      isPopup: boolean
      loginButton: { color: string; type: number; height: number }
    }) => { init: () => void }
  }

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
