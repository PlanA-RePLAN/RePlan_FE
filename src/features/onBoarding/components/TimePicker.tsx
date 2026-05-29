import { useState, useEffect } from 'react'
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import BottomSheetHeader from '@/shared/components/BottomSheetHeader'

const ITEM_HEIGHT = 48
const VISIBLE_COUNT = 5
const OFFSET = Math.floor(VISIBLE_COUNT / 2)
const ANGLE_PER_ITEM = 15

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const PERIODS = ['AM', 'PM']

interface DrumItemProps {
  y: MotionValue<number>
  index: number
  label: string
}

function DrumItem({ y, index, label }: DrumItemProps) {
  const rotateX = useTransform(y, (yVal) => {
    const offset = (index - OFFSET) * ITEM_HEIGHT + yVal
    return (offset / ITEM_HEIGHT) * -ANGLE_PER_ITEM
  })

  const color = useTransform(y, (yVal) => {
    const dist = Math.min(
      1,
      Math.abs((index - OFFSET) * ITEM_HEIGHT + yVal) / ITEM_HEIGHT,
    )
    const dark = [59, 61, 65]
    const light = [196, 198, 202]
    const r = Math.round(dark[0] + (light[0] - dark[0]) * dist)
    const g = Math.round(dark[1] + (light[1] - dark[1]) * dist)
    const b = Math.round(dark[2] + (light[2] - dark[2]) * dist)
    return `rgb(${r},${g},${b})`
  })

  return (
    <motion.div
      style={{
        height: ITEM_HEIGHT,
        rotateX,
        color,
        transformPerspective: 400,
      }}
      className="flex items-center justify-center select-none text-2xl font-medium"
    >
      {label}
    </motion.div>
  )
}

interface DrumColumnProps {
  items: string[]
  initialIndex: number
  onChange: (index: number) => void
}

function DrumColumn({ items, initialIndex, onChange }: DrumColumnProps) {
  const y = useMotionValue((OFFSET - initialIndex) * ITEM_HEIGHT)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragEnd = (_: unknown) => {
    const rawIndex = OFFSET - y.get() / ITEM_HEIGHT
    const clamped = Math.max(
      0,
      Math.min(items.length - 1, Math.round(rawIndex)),
    )
    animate(y, (OFFSET - clamped) * ITEM_HEIGHT, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    })
    onChange(clamped)
  }

  return (
    <div
      className="relative flex-1 overflow-hidden"
      style={{
        height: VISIBLE_COUNT * ITEM_HEIGHT,
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
      }}
    >
      <motion.div
        drag="y"
        style={{ y }}
        dragConstraints={{
          top: (OFFSET - (items.length - 1)) * ITEM_HEIGHT,
          bottom: OFFSET * ITEM_HEIGHT,
        }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="cursor-grab active:cursor-grabbing"
      >
        {items.map((item, i) => (
          <DrumItem key={i} y={y} index={i} label={item} />
        ))}
      </motion.div>
    </div>
  )
}

interface TimePickerProps {
  value?: string
  onConfirm?: (time: string) => void
  onChange?: (time: string) => void
  onClose: () => void
  useHeader?: boolean
}

function computeTimeString(
  hourIdx: number,
  minuteIdx: number,
  periodIdx: number,
): string {
  const hour12 = hourIdx + 1
  const hour24 =
    periodIdx === 0
      ? hour12 === 12
        ? 0
        : hour12
      : hour12 === 12
        ? 12
        : hour12 + 12
  return `${String(hour24).padStart(2, '0')}:${MINUTES[minuteIdx]} ${PERIODS[periodIdx]}`
}

export default function TimePicker({
  value,
  onConfirm,
  onChange,
  onClose,
  useHeader = true,
}: TimePickerProps) {
  const now = new Date()
  const initHour24 = value ? parseInt(value.split(':')[0]) : now.getHours()
  const initMinute = value ? parseInt(value.split(':')[1]) : now.getMinutes()
  const initPeriod = initHour24 >= 12 ? 1 : 0
  const initHour12 = (initHour24 % 12 === 0 ? 12 : initHour24 % 12) - 1

  const [hourIdx, setHourIdx] = useState(initHour12)
  const [minuteIdx, setMinuteIdx] = useState(initMinute)
  const [periodIdx, setPeriodIdx] = useState(initPeriod)

  useEffect(() => {
    onChange?.(computeTimeString(hourIdx, minuteIdx, periodIdx))
  }, [hourIdx, minuteIdx, periodIdx])

  const handleConfirm = () => {
    onConfirm?.(computeTimeString(hourIdx, minuteIdx, periodIdx))
  }

  return (
    <div className="px-4 pt-2 pb-6">
      {useHeader && (
        <BottomSheetHeader
          title="마감 시간"
          onClose={onClose}
          onConfirm={handleConfirm}
        />
      )}

      {/* 드럼 피커 */}
      <div className="relative flex px-18">
        {/* 선택 하이라이트 */}
        <div
          className="absolute inset-x-0 bg-bluegray-light rounded-xl pointer-events-none"
          style={{ top: OFFSET * ITEM_HEIGHT, height: ITEM_HEIGHT }}
        />

        <DrumColumn
          items={HOURS}
          initialIndex={hourIdx}
          onChange={setHourIdx}
        />
        <DrumColumn
          items={MINUTES}
          initialIndex={minuteIdx}
          onChange={setMinuteIdx}
        />
        <DrumColumn
          items={PERIODS}
          initialIndex={periodIdx}
          onChange={setPeriodIdx}
        />
      </div>
    </div>
  )
}
