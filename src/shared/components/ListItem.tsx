import { cn } from '../utils/cn'

interface ListItemProps {
  children: React.ReactNode
  className?: string
}

export default function ListItem({ children, className }: ListItemProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-4 font-semibold text-sm bg-blue-light text-blue-normal',
        className,
      )}
    >
      {children}
    </div>
  )
}
