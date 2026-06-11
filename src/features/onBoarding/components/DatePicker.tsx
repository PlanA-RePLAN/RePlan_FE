import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns'
import BottomSheetHeader from '@/shared/components/BottomSheetHeader'
import { cn } from '@/shared/utils/cn'
import 'react-day-picker/dist/style.css'

interface DatePickerProps {
  value?: Date
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
  onConfirm,
  onDeselect,
  onClose,
  showHeader,
  weeks,
  selectedColor,
  selectedTextColor,
  dueDates = [],
}: DatePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>(value)
  const [month, setMonth] = useState<Date>(value ?? new Date())

  if (weeks) {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const days = Array.from({ length: weeks * 7 }, (_, i) => addDays(weekStart, i))

    return (
      <div className="px-4 pt-2 pb-4">
        <div className="flex w-full">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="flex-1 text-center text-sm text-bluegray-normal py-2"
            >
              {label}
            </div>
          ))}
        </div>
        {Array.from({ length: weeks }, (_, weekIndex) => (
          <div key={weekIndex} className="flex w-full">
            {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => {
              const isSelected = selected && isSameDay(day, selected)
              const isTodayDate = isToday(day)
              const isSat = day.getDay() === 6
              const isSun = day.getDay() === 0
              const hasDue = dueDates.some((d) => isSameDay(d, day))
              return (
                <div
                  key={day.toISOString()}
                  className="flex-1 flex items-center justify-center"
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
                      isSelected && !selectedColor && 'bg-bluegray-black text-white',
                      !isSelected && isTodayDate && 'border border-bluegray-light-active',
                      !isSelected && isSat && 'text-blue-500',
                      !isSelected && isSun && 'text-red-500',
                      !isSelected && !isTodayDate && !isSat && !isSun && 'text-bluegray-darker',
                    )}
                    style={isSelected && selectedColor ? { backgroundColor: selectedColor, color: selectedTextColor ?? 'white' } : undefined}
                  >
                    {hasDue && (
                      <span className="absolute top-1.5 left-[calc(50%+7px)] -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-[#A9AFB9]" />
                    )}
                    {format(day, 'd')}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
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
          weekday: 'flex-1 text-center text-sm text-bluegray-normal py-2',
          weeks: 'flex flex-col gap-1 w-full',
          week: 'flex w-full',
          day: 'flex-1 flex items-center justify-center',
          day_button:
            'w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium text-bluegray-darker transition-colors',
          selected: selectedColor
            ? ''
            : '[&>button]:bg-bluegray-black [&>button]:text-white [&>button]:rounded-full',
          today:
            '[&>button]:border [&>button]:border-bluegray-light-active [&>button]:rounded-full',
          outside: '[&>button]:text-bluegray-light-active',
        }}
        modifiersClassNames={{
          saturday: '[&>button]:text-blue-500',
          sunday: '[&>button]:text-red-500',
        }}
        modifiers={{
          saturday: (date) => date.getDay() === 6,
          sunday: (date) => date.getDay() === 0,
          hasDue: (date) => dueDates.some((d) => isSameDay(d, date)),
        }}
        components={{
          DayButton: ({ day, modifiers, ...props }) => (
            <button
              {...props}
              className={cn(props.className, 'relative')}
              style={modifiers.selected && selectedColor ? { backgroundColor: selectedColor, color: selectedTextColor ?? 'white', borderRadius: '100%' } : undefined}
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
