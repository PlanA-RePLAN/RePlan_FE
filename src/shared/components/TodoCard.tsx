import focusedSvg from '@/assets/foucsed.svg'
import CheckIcon from '@/icons/CheckIcon'
import TodoTag from './TodoTag'
import { cn } from '@/shared/utils/cn'
import GoalIcon from '@/icons/GoalIcon'
import ClockIcon from '@/icons/ClockIcon'
import PinIcon from '@/icons/PinIcon'
import { motion, useAnimation } from 'framer-motion'

type Category = string

// ── 루트 ──────────────────────────────────────────────
const SLIDE_WIDTH_FULL = 160
const SLIDE_WIDTH_DELETE = 80

interface TodoCardProps {
  children: React.ReactNode
  className?: string
  status?: 'focused' | 'swipeable' | 'swipeable-delete' | 'grey' | 'default'
  onDelete?: () => void
  onClick?: () => void
}

function TodoCard({ children, className, status = 'default', onDelete, onClick }: TodoCardProps) {
  const controls = useAnimation()
  const isSwipeable = status === 'swipeable' || status === 'swipeable-delete'
  const isFocusedStyle = status === 'focused' || status === 'swipeable'
  const slideWidth = status === 'swipeable-delete' ? SLIDE_WIDTH_DELETE : SLIDE_WIDTH_FULL

  const cardContent = (
    <div
      className={cn(
        'relative flex items-start gap-3 w-full rounded-2xl border border-bluegray-light bg-white p-4 transition-all duration-100 ease-in-out',
        { 'mt-3': !isSwipeable },
        className,
        {
          'bg-[#F5F9FE] border-blue-light-active': isFocusedStyle,
          'bg-bluegray-light': status === 'grey',
        },
      )}
    >
      {children}
      {status === 'swipeable' && (
        <img src={focusedSvg} className="absolute right-0 top-1/2 -translate-y-1/2" />
      )}
    </div>
  )

  if (!isSwipeable) return cardContent

  return (
    <div className="relative overflow-hidden mt-3">
      <div className="absolute right-0 top-0 h-full flex">

        {/* 삭제하기 버튼 */}
        <div className='flex flex-col items-center gap-1.5 px-2'>
          <button onClick={onDelete} className="w-12 h-12 rounded-full bg-danger flex items-center justify-center">
            <img src="/src/assets/delete.svg" alt="" />
          </button>
          <p className='text-[10px] text-bluegray-dark'>삭제하기</p>
        </div>

        {/* 리플랜하기 버튼 (swipeable 전용) */}
        {status === 'swipeable' && (
          <div className='flex flex-col items-center gap-1.5 px-2'>
            <button className="w-12 h-12 rounded-full bg-blue-normal flex items-center justify-center">
              {/* 아이콘 컴포넌트 */}
            </button>
            <p className='text-[10px] text-bluegray-dark'>리플랜하기</p>
          </div>
        )}

      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -slideWidth, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        animate={controls}
        onDragEnd={(_, info) => {
          if (info.offset.x < -slideWidth / 2) {
            controls.start({ x: -slideWidth })
          } else {
            controls.start({ x: 0 })
          }
        }}
      >
        {cardContent}
      </motion.div>
    </div>
  )
}

// ── Icon ──────────────────────────────────────────────
interface IconProps {
  checked?: boolean
  onClick?: ()=>void
}

function Icon({ checked = false, onClick }: IconProps) {
  return (
    <div className="shrink-0" onClick={onClick}>{checked ? <GoalIcon /> : <CheckIcon />}</div>
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
