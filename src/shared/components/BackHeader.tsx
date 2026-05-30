import ChevronLeftIcon from '@/icons/ChevronLeftIcon'
import { cn } from '../utils/cn'

interface BackHeaderProps {
  title: string
  onBack?: () => void
  className?: string
}

export default function BackHeader({
  title,
  onBack,
  className = '',
}: BackHeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 z-50 px-5 flex items-center w-screen py-4 border-b border-bluegray-light-hover bg-white',
        className,
      )}
    >
      <button
        onClick={onBack}
        className="flex items-center justify-center"
        aria-label="뒤로가기"
      >
        <ChevronLeftIcon width={24} height={24} color="#202021" />
      </button>
      <span className="absolute left-0 right-0 text-center text-xl font-medium text-bluegray-black pointer-events-none">
        {title}
      </span>
    </header>
  )
}
