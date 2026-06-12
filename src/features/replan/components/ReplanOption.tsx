import { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'
import CircleCheckButtonIcon from '@/icons/CircleCheckButtonIcon'

interface ReplanOptionProps {
  icon: ReactNode
  label: string
  description?: string
  isSelected?: boolean
  onChange?: (selected: boolean) => void
}

export default function ReplanOption({
  icon,
  label,
  description,
  isSelected = false,
  onChange,
}: ReplanOptionProps) {
  const handleClick = () => {
    onChange?.(!isSelected)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full rounded-xl px-4 py-2.5 mb-3 flex items-center gap-3 text-left transition-colors',
        isSelected
          ? 'bg-white border border-bluegray-light-active'
          : 'bg-bluegray-light border border-bluegray-light hover:bg-bluegray-light-hover',
      )}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="font-medium text-sm text-bluegray-darker">{label}</div>
        {description && (
          <div className="text-xs text-bluegray-normal mt-1">{description}</div>
        )}
      </div>
      {isSelected && (
        <CircleCheckButtonIcon color="#A9AFB9" width={24} height={22} />
      )}
    </button>
  )
}
