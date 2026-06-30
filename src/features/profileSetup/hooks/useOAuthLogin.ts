import { useEffect, useRef, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { kakaoOAuthLogin, googleOAuthLogin, naverOAuthLogin } from '@/shared/api/auth'
import type { ApiResponse, OAuthLoginData } from '@/shared/types/auth'
import { setupPush } from '@/shared/firebase'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { App } from '@capacitor/app'

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const KAKAO_NATIVE_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI as string

export function useOAuthLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const googleBtnRef = useRef<HTMLDivElement>(null)
  const googleInitialized = useRef(false)
  const naverInitialized = useRef(false)
  const kakaoLoading = useRef(false)

  const handleAuthResponse = (res: ApiResponse<OAuthLoginData>) => {
    if (!res.success || !res.data) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.')
      return
    }
    const { isNewUser, accessToken, refreshToken, tempToken } = res.data
    if (!isNewUser && accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      setupPush()
      navigate('/home')
    } else if (isNewUser && tempToken) {
      sessionStorage.setItem('tempToken', tempToken)
      navigate('/profile-setup')
    }
  }

  // 카카오 SDK 초기화 (웹 전용)
  useEffect(() => {
    if (Capacitor.isNativePlatform()) return
    if (!KAKAO_JS_KEY || !window.Kakao) return
    if (window.Kakao.isInitialized()) return
    window.Kakao.init(KAKAO_JS_KEY)
  }, [])

  // 구글 SDK 초기화
  const initGoogleBtn = useCallback(() => {
    if (!GOOGLE_CLIENT_ID || !window.google || !googleBtnRef.current) return
    if (googleInitialized.current) return
    googleInitialized.current = true
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: { credential: string }) => {
        try {
          const res = await googleOAuthLogin(response.credential)
          handleAuthResponse(res)
        } catch {
          setError('구글 로그인에 실패했습니다. 다시 시도해주세요.')
        }
      },
    })
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'outline',
      size: 'large',
      width: 315,
    })
  }, [navigate])

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    if (window.google) { initGoogleBtn(); return }
    const interval = setInterval(() => {
      if (window.google) { initGoogleBtn(); clearInterval(interval) }
    }, 200)
    return () => clearInterval(interval)
  }, [initGoogleBtn])

  // 네이버 SDK 초기화
  const initNaverBtn = useCallback(() => {
    if (!NAVER_CLIENT_ID || !window.naver) return
    if (naverInitialized.current) return
    naverInitialized.current = true
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: NAVER_CLIENT_ID,
      callbackUrl: window.location.origin,
      isPopup: false,
      loginButton: { color: 'green', type: 3, height: 58 },
    })
    naverLogin.init()
  }, [])

  useEffect(() => {
    if (!NAVER_CLIENT_ID) return
    if (window.naver) { initNaverBtn(); return }
    const interval = setInterval(() => {
      if (window.naver) { initNaverBtn(); clearInterval(interval) }
    }, 200)
    return () => clearInterval(interval)
  }, [initNaverBtn])

  // 네이버 콜백 — URL 해시에서 access_token 추출
  useEffect(() => {
    if (!window.location.hash.includes('access_token')) return
    const params = new URLSearchParams(window.location.hash.replace('#', '?'))
    const accessToken = params.get('access_token')
    if (!accessToken) return
    window.history.replaceState(null, '', window.location.pathname)
    naverOAuthLogin(accessToken)
      .then(handleAuthResponse)
      .catch(() => setError('네이버 로그인에 실패했습니다. 다시 시도해주세요.'))
  }, [])

  const loginWithKakaoNative = () => {
    return new Promise<void>((resolve, reject) => {
      const listenerPromise = App.addListener('appUrlOpen', async (data) => {
        if (!data.url.startsWith('com.plana.replan://oauth')) return
        const listener = await listenerPromise
        listener.remove()
        await Browser.close()
        const url = new URL(data.url)
        const code = url.searchParams.get('code')
        if (!code) { reject(new Error('No authorization code')); return }
        try {
          const params = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: KAKAO_JS_KEY,
            redirect_uri: KAKAO_NATIVE_REDIRECT_URI,
            code,
          })
          const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
          })
          const tokenData = await tokenRes.json()
          if (!tokenData.access_token) { reject(new Error('No access token')); return }
          const res = await kakaoOAuthLogin(tokenData.access_token)
          handleAuthResponse(res)
          resolve()
        } catch (err) {
          reject(err)
        }
      })
      Browser.open({
        url: `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_JS_KEY}&redirect_uri=${encodeURIComponent(KAKAO_NATIVE_REDIRECT_URI)}&response_type=code`,
        presentationStyle: 'popover',
      })
    })
  }

  const loginWithKakao = async () => {
    if (kakaoLoading.current) return
    if (!window.Kakao) {
      setError('카카오 로그인을 사용할 수 없습니다. 다시 시도해주세요.')
      return
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JS_KEY)
    }
    kakaoLoading.current = true
    try {
      if (Capacitor.isNativePlatform()) {
        await loginWithKakaoNative()
        return
      }
      const accessToken = await new Promise<string>((resolve, reject) => {
        window.Kakao.Auth.login({
          scope: 'account_email',
          success: (authObj) => resolve(authObj.access_token),
          fail: (err) => {
            console.error('[Kakao] fail 콜백:', JSON.stringify(err))
            reject(err)
          },
        })
      })
      const res = await kakaoOAuthLogin(accessToken)
      handleAuthResponse(res)
    } catch (err) {
      console.error('[Kakao] 로그인 에러:', err)
      setError('카카오 로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      kakaoLoading.current = false
    }
  }

  const loginWithGoogle = () => {
    const googleBtn = googleBtnRef.current?.querySelector('div[role="button"]') as HTMLElement
    googleBtn?.click()
  }

  const loginWithNaver = () => {
    document.querySelector<HTMLAnchorElement>('#naverIdLogin a')?.click()
  }

  return { error, googleBtnRef, loginWithKakao, loginWithGoogle, loginWithNaver }
}
