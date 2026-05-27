import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/features/profileSetup/components/Button'
import GoogleIcon from '@/icons/GoogleIcon'
import { kakaoOAuthLogin } from '@/shared/api/auth'
import type { ApiResponse, OAuthLoginData } from '@/shared/types/auth'

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY

const LOGIN_OPTION = [
  { title: '카카오', img: 'kakao', option: 'kakao', icon: undefined },
  { title: 'apple', img: 'apple', option: 'apple', icon: undefined },
  { title: 'google', img: 'google', option: 'google', icon: <GoogleIcon /> },
  { title: 'naver', img: 'naver', option: 'naver', icon: undefined },
] as const

export default function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  // 카카오 SDK 초기화
  useEffect(() => {
    if (!KAKAO_JS_KEY || !window.Kakao || window.Kakao.isInitialized()) 
      return
    window.Kakao.init(KAKAO_JS_KEY)
  }, [])

  //응답 처리
  const handleAuthResponse = (res: ApiResponse<OAuthLoginData>) => {
    if (!res.success || !res.data) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.')
      return
    }

    const { isNewUser, accessToken, refreshToken, tempToken } = res.data

    // 기존 유저
    if (!isNewUser && accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      navigate('/home')
    }
    // 신규 유저 
    else if (isNewUser && tempToken) {
      sessionStorage.setItem('tempToken', tempToken)
      navigate('/profile-setup')
    }
  }

  // 카카오 로그인
  const handleKakaoLogin = async () => {
    try {
      const accessToken = await new Promise<string>((resolve, reject) => {
        window.Kakao.Auth.login({
          scope: 'account_email',
          success: (authObj) => resolve(authObj.access_token),
          fail: reject,
        })
      })
      const res = await kakaoOAuthLogin(accessToken)
      handleAuthResponse(res)
    } catch {
      setError('카카오 로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleLogin = (option: string) => {
    if (option === 'kakao') handleKakaoLogin()
  }

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <div className="flex flex-col items-center gap-3 absolute top-[33.5%]">
        <img src="/src/assets/logo.svg" alt="" />
        <p className="text-base text-bluegray-normal-hover">실패 없는 재계획 프로젝트</p>
      </div>
      {error && (
        <p className="absolute top-[60%] text-sm text-danger text-center px-5">{error}</p>
      )}
      <div className="w-full px-5 flex flex-col gap-2 absolute bottom-[6%]">
        {LOGIN_OPTION.map((item) => (
          <Button key={item.title} onClick={() => handleLogin(item.option)} {...item} />
        ))}
      </div>
    </div>
  )
}
