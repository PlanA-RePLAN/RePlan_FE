import { cn } from '@/shared/utils/cn'

interface ProgressBarProps {
  totalSteps: number
  currentStep: number
}

export default function ProgressBar({
  totalSteps,
  currentStep,
}: ProgressBarProps) {
  return (
    <div className="gap-3.5 flex w-full">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={cn('h-1.25 rounded-[20px] flex-1', {
            'bg-bluegray-darker': index < currentStep,
            'bg-bluegray-light-hover': index >= currentStep,
          })}
        />
      ))}
    </div>
  )
}
