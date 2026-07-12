import { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import { format, startOfWeek, addDays, addMonths, isSameDay, isToday } from 'date-fns'
import BottomSheetHeader from '@/shared/components/BottomSheetHeader'
import { cn } from '@/shared/utils/cn'
import 'react-day-picker/dist/style.css'

interface DatePickerProps {
  value?: Date
  defaultMonth?: Date
  onConfirm: (date: Date) => void
  onDeselect?: () => void
  onClose: () => void
  showHeader?: boolean
  weeks?: number
  selectedColor?: string
  selectedTextColor?: string
  dueDates?: Date[]
}

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

export default function DatePicker({
  value,
  defaultMonth,
  onConfirm,
  onDeselect,
  onClose,
  showHeader,
  weeks,
  dueDates = [],
}: DatePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>(value)
  const [month, setMonth] = useState<Date>(defaultMonth ?? value ?? new Date())

  useEffect(() => {
    if (defaultMonth) setMonth(defaultMonth)
  }, [defaultMonth])

  useEffect(() => {
    setSelected(value)
  }, [value])

  if (weeks) {
    const referenceDate = defaultMonth ?? value ?? new Date()
    const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 })
    const days = Array.from({ length: weeks * 7 }, (_, i) => addDays(weekStart, i))

    const toDateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const rangeStart = toDateOnly(selected ?? new Date())
    const rangeEnd = toDateOnly(addDays(rangeStart, 6))
    const isInRange = (d: Date) => { const dd = toDateOnly(d); return dd >= rangeStart && dd <= rangeEnd }

    return (
      <div className="px-4 pt-2 pb-4">
        <div className="flex w-full">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="flex-1 text-center text-sm text-bluegray-normal py-2">
              {label}
            </div>
          ))}
        </div>
        {Array.from({ length: weeks }, (_, weekIndex) => {
          const rowDays = days.slice(weekIndex * 7, weekIndex * 7 + 7)
          const showRange = weeks > 1
          const inRangeInRow = showRange ? rowDays.filter(isInRange) : []
          const firstInRow = inRangeInRow[0]
          const lastInRow = inRangeInRow[inRangeInRow.length - 1]

          return (
            <div key={weekIndex} className="flex w-full">
              {rowDays.map((day) => {
                const dayInRange = showRange && isInRange(day)
                const isRangeFirst = dayInRange && firstInRow && isSameDay(day, firstInRow)
                const isRangeLast = dayInRange && lastInRow && isSameDay(day, lastInRow)
                const isSelected = selected && isSameDay(day, selected)
                const isTodayDate = isToday(day)
                const isSat = day.getDay() === 6
                const isSun = day.getDay() === 0
                const hasDue = dueDates.some((d) => isSameDay(d, day))
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'flex-1 flex items-center justify-center',
                      dayInRange && 'bg-[#EEF5FD]',
                      isRangeFirst && 'rounded-l-full',
                      isRangeLast && 'rounded-r-full',
                    )}
                  >
                    <button
                      onClick={() => {
                        if (selected && isSameDay(day, selected)) {
                          setSelected(undefined)
                          onDeselect?.()
                        } else {
                          setSelected(day)
                          onConfirm(day)
                        }
                      }}
                      className={cn(
                        'relative w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors',
                        isTodayDate && !isSelected && 'border border-bluegray-light-active',
                        isSelected && 'bg-[#EEF5FD]',
                        isSat && 'text-blue-500',
                        isSun && 'text-red-500',
                        !isSat && !isSun && 'text-bluegray-darker',
                      )}
                    >
                      {hasDue && (
                        <span className="absolute top-1.5 left-[calc(50%+7px)] -translate-x-1/2 w-0.75 h-0.75 rounded-full bg-[#A9AFB9]" />
                      )}
                      {format(day, 'd')}
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  const toDateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const monthRangeStart = selected ? toDateOnly(selected) : null
  const monthRangeEnd = monthRangeStart ? toDateOnly(addDays(addMonths(monthRangeStart, 1), -1)) : null
  const isMonthInRange = (date: Date) => {
    if (!monthRangeStart || !monthRangeEnd) return false
    const d = toDateOnly(date)
    return d >= monthRangeStart && d <= monthRangeEnd
  }

  return (
    <div className="px-4 pt-2 pb-4">
      {showHeader !== false &&
        <BottomSheetHeader
          title={format(month, 'yyyy년 M월')}
          onClose={onClose}
          onConfirm={() => selected && onConfirm(selected)}
          confirmDisabled={!selected}
          onPrev={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))}
          onNext={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))}
        />
      }
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => {
          setSelected(date)
          if (date) onConfirm(date)
          else onDeselect?.()
        }}
        month={month}
        onMonthChange={setMonth}
        locale={ko}
        hideNavigation
        weekStartsOn={1}
        classNames={{
          root: 'w-full',
          months: 'w-full',
          month: 'w-full',
          month_caption: 'hidden',
          month_grid: 'w-full border-collapse',
          weekdays: 'flex w-full',
          weekday: 'flex-1 text-center text-sm text-bluegray-normal py-2 font-normal',
          weeks: 'flex flex-col gap-1 w-full',
          week: 'flex w-full',
          day: 'flex-1 flex items-center justify-center',
          day_button:
            'w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium text-bluegray-darker transition-colors',
          selected: '[&>button]:bg-[#EEF5FD] [&>button]:rounded-full',
          today:
            '[&>button]:border [&>button]:border-bluegray-light-active [&>button]:rounded-full',
          outside: '[&>button]:text-bluegray-light-active',
        }}
        modifiersClassNames={{
          saturday: '[&>button]:text-blue-500',
          sunday: '[&>button]:text-red-500',
          rangeLeft: 'bg-[#EEF5FD] rounded-l-full',
          rangeRight: 'bg-[#EEF5FD] rounded-r-full',
          rangeMid: 'bg-[#EEF5FD]',
        }}
        modifiers={{
          saturday: (date) => date.getDay() === 6,
          sunday: (date) => date.getDay() === 0,
          hasDue: (date) => dueDates.some((d) => isSameDay(d, date)),
          rangeLeft: (date) => isMonthInRange(date) && (!!monthRangeStart && isSameDay(date, monthRangeStart) || date.getDay() === 1),
          rangeRight: (date) => isMonthInRange(date) && (!!monthRangeEnd && isSameDay(date, monthRangeEnd) || date.getDay() === 0),
          rangeMid: (date) => {
            if (!isMonthInRange(date)) return false
            const isLeft = (!!monthRangeStart && isSameDay(date, monthRangeStart)) || date.getDay() === 1
            const isRight = (!!monthRangeEnd && isSameDay(date, monthRangeEnd)) || date.getDay() === 0
            return !isLeft && !isRight
          },
        }}
        components={{
          DayButton: ({ day, modifiers, ...props }) => (
            <button
              {...props}
              className={cn(props.className, 'relative')}
            >
              {modifiers.hasDue && (
                <span className="absolute top-1.5 left-[calc(50%+7px)] -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-[#A9AFB9]" />
              )}
              {props.children}
            </button>
          ),
        }}
      />
    </div>
  )
}
