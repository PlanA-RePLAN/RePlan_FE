import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import { format } from 'date-fns'
import BottomSheetHeader from '@/shared/components/BottomSheetHeader'
import 'react-day-picker/dist/style.css'

interface DatePickerProps {
  value?: Date
  onConfirm: (date: Date) => void
  onClose: () => void
}

export default function DatePicker({
  value,
  onConfirm,
  onClose,
}: DatePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>(value)
  const [month, setMonth] = useState<Date>(value ?? new Date())

  return (
    <div className="px-4 pt-2 pb-4">
      <BottomSheetHeader
        title={format(month, 'yyyy년 M월')}
        onClose={onClose}
        onConfirm={() => selected && onConfirm(selected)}
        confirmDisabled={!selected}
        onPrev={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))}
        onNext={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))}
      />

      {/* 캘린더 */}
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
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
    </div>
  )
}
