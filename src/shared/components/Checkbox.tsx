import CheckBoxIcon from '@/icons/CheckBoxIcon'
import { cn } from '@/shared/utils/cn'

interface CheckboxProps {
  checked: boolean
  color?: string
  className?: string
}

export default function Checkbox({ checked, color = '#579DEC', className }: CheckboxProps) {
  return checked ? (
    <CheckBoxIcon color={color} className={className} />
  ) : (
    <div
      className={cn(
        'w-[18px] h-[18px] rounded-[5px] border border-bluegray-light-active shrink-0',
        className,
      )}
    />
  )
}
