import { cn } from '@/shared/utils/cn'

interface MainButtonProps {
  onClick: () => void
  title: string
  className?: string
  option: 'primary' | 'secondary'
}

export default function MainButton({
  onClick,
  title,
  className,
  option,
}: MainButtonProps) {
  const optionClasses = {
    secondary: 'bg-bluegray-light-hover text-bluegray-black',
    primary: 'bg-bluegray-black text-white',
  }
  return (
    <button
      className={cn(
        'text-center font-bold py-4 w-full rounded-xl',
        optionClasses[option],
        className || '',
      )}
      onClick={onClick}
    >
      {title}
    </button>
  )
}
