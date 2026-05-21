import { cn } from '@/shared/utils/cn'

interface MainButtonProps {
  onClick: () => void
  title: string
  className?: string
  option: 'primary' | 'secondary'
  disabled?: boolean
}

export default function MainButton({
  onClick,
  title,
  className,
  option,
  disabled,
}: MainButtonProps) {
  const optionClasses = {
    secondary: 'bg-bluegray-light-hover text-bluegray-black',
    primary: 'bg-bluegray-black text-white',
  }
  return (
    <button
      disabled={disabled}
      className={cn(
        'text-center font-bold py-4 w-full rounded-xl',
        optionClasses[option],
        disabled ? 'bg-bluegray-light-hover text-bluegray-normal cursor-not-allowed' : '',
        className || '',
      )}
      onClick={onClick}
    >
      {title}
    </button>
  )
}
