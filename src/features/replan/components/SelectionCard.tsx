import { cn } from '@/shared/utils/cn'

interface SelectionCardProps {
  icon: React.ReactNode
  label: string
  step: number
}

export default function SelectionCard({
  icon,
  label,
  step,
}: SelectionCardProps) {
  const step2Style = 'bg-blue-light'
  const step3Style = 'bg-white border border-bluegray-light-active'

  return (
    <div
      className={cn(
        'w-full rounded-xl p-4 mb-2 flex items-center gap-3',
        step === 2 ? step2Style : step3Style,
      )}
    >
      <div className="shrink-0 [&_path]:fill-[#579DEC] [&_rect]:fill-[#579DEC] [&_circle]:fill-[#579DEC]">
        {icon}
      </div>
      <div
        className={cn(
          'flex-1 font-medium text-sm text-blue-normal',
          step === 4 && 'text-bluegray-darker',
        )}
      >
        {label}
      </div>
    </div>
  )
}
