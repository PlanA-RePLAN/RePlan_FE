import { motion } from 'framer-motion'
import { cn } from '@/shared/utils/cn'

interface AiLoadingOverlayProps {
  highlightMessage?: string
  message: string
  description?: string
}

const SKELETON_CARDS = Array.from({ length: 4 })
const MARQUEE_DURATION = 24

export default function AiLoadingOverlay({
  highlightMessage = '',
  message,
  description = '조금만 기다려주세요, 금방 완성돼요',
}: AiLoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-bluegray-light">
      <div className="flex flex-col items-center gap-9">
        <TargetIcon className="size-16 text-bluegray-black" />
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-2xl font-bold tracking-tight">
            <span className="text-blue-normal">{highlightMessage}</span>
            {message}
          </p>
          <p className="text-sm font-medium text-bluegray-normal">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-30 flex flex-col gap-9">
        <MarqueeRow direction="left" />
        <MarqueeRow direction="right" />
      </div>
    </div>
  )
}

function MarqueeRow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex w-max gap-4"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          duration: MARQUEE_DURATION,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {[...SKELETON_CARDS, ...SKELETON_CARDS].map((_, index) => (
          <SkeletonTodoCard key={index} />
        ))}
      </motion.div>
    </div>
  )
}

function SkeletonTodoCard() {
  return (
    <div className="flex h-18.25 w-78.5 shrink-0 items-center justify-between rounded-2xl bg-white p-4 shadow-[0px_0px_8px_rgba(50,59,71,0.04)]">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-32 rounded-full bg-bluegray-light" />
        <div className="h-3 w-20 rounded-full bg-bluegray-light" />
      </div>
      <div className="h-6 w-15 shrink-0 rounded-full bg-bluegray-light" />
    </div>
  )
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn('shrink-0', className)}>
      <circle cx="32" cy="32" r="27" stroke="currentColor" strokeWidth="7" />
      <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="7" />
      <circle cx="32" cy="32" r="3" fill="currentColor" />
    </svg>
  )
}
