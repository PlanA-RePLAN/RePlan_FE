import CloseButtonIcon from '@/icons/CloseButtonIcon'
import CircleCheckButtonIcon from '@/icons/CircleCheckButtonIcon'
import ChevronLeftIcon from '@/icons/ChevronLeftIcon'

interface BottomSheetHeaderProps {
  title: string
  onClose: () => void
  onConfirm: () => void
  confirmDisabled?: boolean
  onPrev?: () => void
  onNext?: () => void
}

export default function BottomSheetHeader({
  title,
  onClose,
  onConfirm,
  confirmDisabled = false,
  onPrev,
  onNext,
}: BottomSheetHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <button onClick={onClose}>
        <CloseButtonIcon />
      </button>

      <div className="flex items-center gap-3">
        {onPrev && (
          <button onClick={onPrev}>
            <ChevronLeftIcon width={20} height={20} color="#7F838B" />
          </button>
        )}
        <span className="text-lg font-bold text-bluegray-black w-28 text-center">
          {title}
        </span>
        {onNext && (
          <button onClick={onNext}>
            <ChevronLeftIcon width={20} height={20} color="#7F838B" className="rotate-180" />
          </button>
        )}
      </div>

      <button onClick={onConfirm} disabled={confirmDisabled} className="disabled:opacity-30">
        <CircleCheckButtonIcon />
      </button>
    </div>
  )
}
