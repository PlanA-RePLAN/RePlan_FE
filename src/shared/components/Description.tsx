import { cn } from '../utils/cn'
interface DescriptionProps {
  children: React.ReactNode
  className?: string
}

export default function Description({ children, className }: DescriptionProps) {
  return (
    <h1
      className={cn(
        'text-[14px] font-medium leading-[150%] text-bluegray-normal-active',
        className,
      )}
    >
      {children}
    </h1>
  )
}
