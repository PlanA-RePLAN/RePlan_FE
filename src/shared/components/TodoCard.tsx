import CheckIcon from '@/icons/CheckIcon'
import TodoTag from './TodoTag'
import { cn } from '@/shared/utils/cn'
import GoalIcon from '@/icons/GoalIcon'
import ClockIcon from '@/icons/ClockIcon'
import PinIcon from '@/icons/PinIcon'

type Category = 'Study' | 'Project' | 'Health' | 'Rest' | 'Other' | '미선택'

// ── 루트 ──────────────────────────────────────────────
interface TodoCardProps {
  children: React.ReactNode
  className?: string
  status?: 'focused' | 'grey' | 'default'
}

function TodoCard({ children, className, status = 'default' }: TodoCardProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 w-full rounded-2xl border border-bluegray-light bg-white p-4 mt-3 transition-all duration-100 ease-in-out',
        className,
        {
          'bg-blue-light/60 border-blue-light-active': status === 'focused',
          'bg-bluegray-light': status === 'grey',
        },
      )}
    >
      {children}
    </div>
  )
}

// ── Icon ──────────────────────────────────────────────
interface IconProps {
  checked?: boolean
}

function Icon({ checked = false }: IconProps) {
  return (
    <div className="shrink-0">{checked ? <GoalIcon /> : <CheckIcon />}</div>
  )
}

// ── Content ───────────────────────────────────────────
interface ContentProps {
  children: React.ReactNode
}

function Content({ children }: ContentProps) {
  return (
    <div className="flex flex-col gap-1 flex-1 items-start min-w-0">
      {children}
    </div>
  )
}

// ── Title ─────────────────────────────────────────────
interface TitleProps {
  children: React.ReactNode
  dayTag?: 'M' | 'D'
}

function Title({ children, dayTag }: TitleProps) {
  const dayTagColors = {
    D: 'text-[#7EA4F5]',
    M: 'text-[#FFA9A9]',
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-bluegray-black truncate">
        {children}
      </span>
      {dayTag && (
        <span
          className={`shrink-0 text-sm font-semibold ${dayTagColors[dayTag]}`}
        >
          {dayTag}
        </span>
      )}
    </div>
  )
}

// ── Time ──────────────────────────────────────────────
interface TimeProps {
  children: React.ReactNode
}

function Time({ children }: TimeProps) {
  return (
    <div className="flex items-start gap-1">
      <ClockIcon />
      <span className="text-xs text-bluegray-normal">{children}</span>
    </div>
  )
}

// ── Category ──────────────────────────────────────────
interface CategoryProps {
  category: Category
  usePin?: boolean
  pinned?: boolean
  setPinned?: (pinned: boolean) => void
}

function Category({
  category,
  usePin = false,
  pinned = false,
  setPinned,
}: CategoryProps) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {usePin && (
        <button
          onClick={() => setPinned && setPinned(!pinned)}
          aria-label={pinned ? '핀 해제' : '핀하기'}
        >
          <PinIcon checked={pinned} />
        </button>
      )}
      <TodoTag category={category} />
    </div>
  )
}

// ── Composition ───────────────────────────────────────
TodoCard.Icon = Icon
TodoCard.Content = Content
TodoCard.Title = Title
TodoCard.Time = Time
TodoCard.Category = Category

export default TodoCard
