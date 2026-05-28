import { useState } from 'react'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import Toggle from '@/shared/components/Toggle'
import ChevronLeftIcon from '@/icons/ChevronLeftIcon'
import TimePicker from './TimePicker'

interface MonthlySettingProps {
  selectedDay: number
  onDayChange: (day: number) => void
  timeEnabled: boolean
  onTimeEnabledChange: (enabled: boolean) => void
  time: string
  onTimeChange: (time: string) => void
}

export default function MonthlySetting({
  selectedDay,
  onDayChange,
  timeEnabled,
  onTimeEnabledChange,
  time,
  onTimeChange,
}: MonthlySettingProps) {
  const today = new Date()
  const [displayMonth, setDisplayMonth] = useState(
    new Date(today.getFullYear(), today.getMonth()),
  )

  const daysInDisplayMonth = new Date(
    displayMonth.getFullYear(),
    displayMonth.getMonth() + 1,
    0,
  ).getDate()

  const selectedDate =
    selectedDay && selectedDay <= daysInDisplayMonth
      ? new Date(
          displayMonth.getFullYear(),
          displayMonth.getMonth(),
          selectedDay,
        )
      : undefined

  const handlePrev = () =>
    setDisplayMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))

  const handleNext = () =>
    setDisplayMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))

  return (
    <>
      {/* Month navigation */}
      <div className="flex items-center justify-center gap-6 mt-4 mb-1">
        <button onClick={handlePrev}>
          <ChevronLeftIcon width={20} height={20} color="#3B3D41" />
        </button>
        <span className="text-lg font-bold text-bluegray-black w-32 text-center">
          {format(displayMonth, 'yyyy년 M월', { locale: ko })}
        </span>
        <button onClick={handleNext}>
          <ChevronLeftIcon
            width={20}
            height={20}
            color="#3B3D41"
            className="rotate-180"
          />
        </button>
      </div>

      {/* Calendar */}
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDayChange(date.getDate())}
        month={displayMonth}
        onMonthChange={setDisplayMonth}
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
          selected:
            '[&>button]:bg-bluegray-black [&>button]:text-white [&>button]:rounded-full',
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
        }}
      />

      {/* 반복 시간 */}
      <div className="w-full border-t border-b border-bluegray-light-hover py-4 flex items-center justify-between">
        <div className="text-sm font-medium text-bluegray-dark">반복 시간</div>
        <div className="flex gap-3 items-center">
          {timeEnabled && (
            <span className="bg-blue-light text-xs font-bold text-bluegray-dark-active rounded-full px-3 py-1">
              {time}
            </span>
          )}
          <Toggle checked={timeEnabled} onChange={onTimeEnabledChange} />
        </div>
      </div>

      {timeEnabled && (
        <TimePicker
          useHeader={false}
          value={time}
          onChange={onTimeChange}
          onClose={() => {}}
        />
      )}
    </>
  )
}
