const logoSvg = '/assets/logo.svg'
import Button from '@/features/profileSetup/components/Button'
import GoogleIcon from '@/icons/GoogleIcon'
import { useOAuthLogin } from '@/features/profileSetup/hooks/useOAuthLogin'

const LOGIN_OPTION = [
  { title: '카카오', img: 'kakao', option: 'kakao', icon: undefined },
  { title: 'apple', img: 'apple', option: 'apple', icon: undefined },
  { title: 'google', img: 'google', option: 'google', icon: <GoogleIcon /> },
  { title: 'naver', img: 'naver', option: 'naver', icon: undefined },
] as const

export default function LoginPage() {
  const { error, googleBtnRef, loginWithKakao, loginWithGoogle, loginWithNaver, loginWithApple } = useOAuthLogin()

  const handleLogin = (option: string) => {
    if (option === 'kakao') loginWithKakao()
    if (option === 'google') loginWithGoogle()
    if (option === 'naver') loginWithNaver()
    if (option === 'apple') loginWithApple()
  }

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <div className="flex flex-col items-center gap-3 absolute top-[33.5%]">
        <img src={logoSvg} alt="" />
        <p className="text-base text-bluegray-normal-hover">실패 없는 재계획 프로젝트</p>
      </div>
      {error && (
        <p className="absolute top-[60%] text-sm text-danger text-center px-5">
          {error}
        </p>
      )}
      {/* 구글/네이버 SDK 버튼 (숨김) */}
      <div ref={googleBtnRef} className="hidden" />
      <div id="naverIdLogin" className="hidden" />
      <div className="w-full px-5 flex flex-col gap-2 absolute bottom-[6%]">
        {LOGIN_OPTION.map((item) => (
          <Button
            key={item.title}
            onClick={() => handleLogin(item.option)}
            {...item}
          />
        ))}
      </div>
    </div>
  )
}
