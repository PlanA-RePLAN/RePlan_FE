import GoogleIcon from "@/icons/GoogleIcon"

export type Provider = 'KAKAO' | 'GOOGLE' | 'NAVER' | 'APPLE'

interface LogoIconProps {
    provider: Provider
}

const PROVIDER_CONFIG: Record<Provider, { bgColor: string; icon: React.ReactNode }> = {
  KAKAO: { bgColor: '#FEE500', icon: <img src="/assets/kakao.svg" alt="kakao" className="w-4 h-4" /> },
  GOOGLE: { bgColor: '#FFFFFF', icon: <GoogleIcon /> },
  NAVER: { bgColor: '#00BF18', icon: <img src="/assets/naver.svg" alt="naver" className="w-3 h-3" /> },
  APPLE: { bgColor: '#000000', icon: <img src="/assets/apple.svg" alt="apple" className="w-4 h-4" /> },
}

export default function LogoIcon({ provider }: LogoIconProps) {
  const config = PROVIDER_CONFIG[provider]
  return (
    <div
      style={{ backgroundColor: config.bgColor }}
      className="w-5 h-5 rounded-full flex items-center justify-center"
    >
      {config.icon}
    </div>
  )
}
