import { cn } from '@/shared/utils/cn'
import kakaoSvg from '@/assets/kakao.svg'
import appleSvg from '@/assets/apple.svg'
import naverSvg from '@/assets/naver.svg'

interface ButtonProps {
  onClick: () => void
  title: string
  img: string
  option: 'kakao' | 'apple' | 'google' | 'naver'
  icon?: React.ReactNode
}

const optionClasses = {
  kakao: 'bg-[#FEE500] text-bluegray-black',
  apple: 'bg-bluegray-black text-white',
  naver: 'bg-[#00BF18] text-white',
  google: 'bg-white text-bluegray-black border border-bluegray-light-active',
}

const imgMap: Record<string, string> = {
  kakao: kakaoSvg,
  apple: appleSvg,
  naver: naverSvg,
}

export default function Button({ onClick, title, img, option, icon }: ButtonProps) {
  return (
    <button
      className={cn(
        'relative w-full h-12 px-4 rounded-xl flex justify-center items-center',
        optionClasses[option],
      )}
      onClick={onClick}
    >
      <span className="absolute left-6">
        {icon ?? <img src={imgMap[img]} alt={title} />}
      </span>
      <p>{title}로 계속하기</p>
    </button>
  )
}
