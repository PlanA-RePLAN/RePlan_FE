import ChevronLeftIcon from '@/icons/ChevronLeftIcon'

interface BackHeaderProps {
  title: string
  onBack?: () => void
}

export default function BackHeader({ title, onBack }: BackHeaderProps) {
  return (
    <header className="relative flex items-center w-full py-4">
      <button
        onClick={onBack}
        className="p-2 flex items-center justify-center"
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
