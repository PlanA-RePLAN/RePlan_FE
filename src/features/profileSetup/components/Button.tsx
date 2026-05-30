import { cn } from '@/shared/utils/cn'

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
        {icon ?? <img src={`src/assets/${img}.svg`} alt={title} />}
      </span>
      <p>{title}로 계속하기</p>
    </button>
  )
}
