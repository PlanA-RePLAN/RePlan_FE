import { useState } from 'react'
import { format } from 'date-fns'
import { cn } from '@/shared/utils/cn'
import BottomSheet from '@/shared/components/BottomSheet'
import Toggle from '@/shared/components/Toggle'
import CalendarClearSharpIcon from '@/icons/CalendarClearSharpIcon'
import CalendarWithClockIcon from '@/icons/CalendarWithClockIcon'
import DatePicker from './DatePicker'
import TimePicker from './TimePicker'

interface DeadlineInputProps {
  date: Date | null
  time: string | null
  useDate: boolean
  useTime: boolean
  notUseToggle?: boolean
  onUseDateChange: (use: boolean) => void
  onUseTimeChange: (use: boolean) => void
  onDateChange?: (date: Date) => void
  onTimeChange?: (time: string) => void
}

export default function DeadlineInput({
  date,
  time,
  useDate,
  useTime,
  notUseToggle,
  onUseDateChange,
  onUseTimeChange,
  onDateChange,
  onTimeChange,
}: DeadlineInputProps) {
  const [dateSheetOpen, setDateSheetOpen] = useState(false)
  const [timeSheetOpen, setTimeSheetOpen] = useState(false)

  // 마감 시간은 마감 날짜에 종속된다 (날짜 없이 시간만은 백엔드가 거부)
  const timeDisabled = !useDate

  const handleUseDateChange = (next: boolean) => {
    onUseDateChange(next)
    if (next) {
      // 스위치를 켜면 바로 값을 정하도록 바텀시트를 연다
      if (onDateChange) setDateSheetOpen(true)
    } else if (useTime) {
      // 날짜를 끄면 시간도 함께 끈다
      onUseTimeChange(false)
    }
  }

  const handleUseTimeChange = (next: boolean) => {
    if (timeDisabled) return
    onUseTimeChange(next)
    if (next && onTimeChange) setTimeSheetOpen(true)
  }

  return (
    <>
      <div className="flex flex-col">
        <button
          onClick={() =>
            onDateChange && (notUseToggle || useDate) && setDateSheetOpen(true)
          }
          className="flex justify-between items-center py-4 mt-2 border-y border-bluegray-light-hover w-full"
        >
          <div className="flex gap-2 items-center">
            <div className="w-5.5 h-5.5 rounded-full bg-bluegray-light-active flex items-center justify-center">
              <CalendarClearSharpIcon fill="white" />
            </div>
            <div className="text-sm font-medium">종료 날짜</div>
          </div>
          <div className="flex gap-2 items-center">
            {date && (
              <div className="text-bluegray-dark-active text-xs font-bold py-1 px-3 rounded-full bg-blue-light">
                {format(date, 'yyyy년 MM월 dd일')}
              </div>
            )}
            {!notUseToggle && (
              <Toggle checked={useDate} onChange={handleUseDateChange} />
            )}
          </div>
        </button>

        <button
          onClick={() =>
            onTimeChange && (notUseToggle || useTime) && setTimeSheetOpen(true)
          }
          className="flex justify-between items-center py-4 w-full border-b border-bluegray-light-hover"
        >
          <div
            className={cn(
              'flex gap-2 items-center',
              !notUseToggle && timeDisabled && 'opacity-40',
            )}
          >
            <div className="w-5.5 h-5.5 rounded-full bg-bluegray-light-active flex items-center justify-center">
              <CalendarWithClockIcon fill="white" />
            </div>
            <div className="text-sm font-medium">종료 시간</div>
          </div>
          <div className="flex gap-2 items-center">
            {time && (
              <div className="text-bluegray-dark-active text-xs font-bold py-1 px-3 rounded-full bg-blue-light">
                {time}
              </div>
            )}
            {!notUseToggle && (
              <Toggle
                checked={useTime}
                onChange={handleUseTimeChange}
                disabled={timeDisabled}
              />
            )}
          </div>
        </button>
      </div>

      {onDateChange && (
        <BottomSheet
          isOpen={dateSheetOpen}
          onClose={() => setDateSheetOpen(false)}
        >
          <DatePicker
            value={date ?? undefined}
            onConfirm={(d) => {
              onDateChange(d)
              setDateSheetOpen(false)
            }}
            disablePast={true}
            onClose={() => setDateSheetOpen(false)}
          />
        </BottomSheet>
      )}

      {onTimeChange && (
        <BottomSheet
          isOpen={timeSheetOpen}
          onClose={() => setTimeSheetOpen(false)}
        >
          <TimePicker
            value={time ?? undefined}
            onConfirm={(t) => {
              onTimeChange(t)
              setTimeSheetOpen(false)
            }}
            onClose={() => setTimeSheetOpen(false)}
          />
        </BottomSheet>
      )}
    </>
  )
}
