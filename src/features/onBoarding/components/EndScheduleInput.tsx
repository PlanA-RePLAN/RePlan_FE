import { useState } from 'react'
import { format } from 'date-fns'
import BottomSheet from '@/shared/components/BottomSheet'
import CheckBoxIcon from '@/icons/CheckBoxIcon'
import ChevronRightIcon from '@/icons/ChevronRightIcon'
import DatePicker from './DatePicker'
import TimePicker from './TimePicker'

interface EndScheduleInputProps {
  date: Date | null
  time: string | null
  useDate: boolean
  useTime: boolean
  onUseDateChange: (use: boolean) => void
  onUseTimeChange: (use: boolean) => void
  onDateChange: (date: Date) => void
  onTimeChange: (time: string) => void
}

function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d
}

function Checkbox({ checked }: { checked: boolean }) {
  return checked ? (
    <CheckBoxIcon />
  ) : (
    <div className="w-[18px] h-[18px] rounded-[5px] border border-bluegray-normal" />
  )
}

export default function EndScheduleInput({
  date,
  time,
  useDate,
  useTime,
  onUseDateChange,
  onUseTimeChange,
  onDateChange,
  onTimeChange,
}: EndScheduleInputProps) {
  const [dateSheetOpen, setDateSheetOpen] = useState(false)
  const [timeSheetOpen, setTimeSheetOpen] = useState(false)

  const handleToggleDate = () => {
    if (!useDate && !date) onDateChange(getTomorrow())
    onUseDateChange(!useDate)
  }

  const handleToggleTime = () => {
    if (!useTime && !time) onTimeChange('11:59 PM')
    onUseTimeChange(!useTime)
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between py-4 border-y border-bluegray-light-hover w-full">
          <button
            className="flex gap-2 items-center"
            onClick={handleToggleDate}
          >
            <Checkbox checked={useDate} />
            <span className="text-sm font-medium text-bluegray-black tracking-tight">
              종료 날짜
            </span>
          </button>
          <button
            onClick={() => setDateSheetOpen(true)}
            className="flex gap-2 items-center text-bluegray-dark-active text-sm font-medium"
          >
            <span>{date ? format(date, 'yyyy년 M월 d일') : '없음'}</span>
            <ChevronRightIcon width={20} height={20} />
          </button>
        </div>

        {useDate && (
          <div className="flex items-center justify-between py-4 border-b border-bluegray-light-hover w-full">
            <button
              className="flex gap-2 items-center"
              onClick={handleToggleTime}
            >
              <Checkbox checked={useTime} />
              <span className="text-sm font-medium text-bluegray-black tracking-tight">
                종료 시간
              </span>
            </button>
            <button
              onClick={() => setTimeSheetOpen(true)}
              className="flex gap-2 items-center text-bluegray-dark-active text-sm font-medium"
            >
              {time && <span>{time}</span>}
              <ChevronRightIcon width={20} height={20} />
            </button>
          </div>
        )}
      </div>

      <BottomSheet
        isOpen={dateSheetOpen}
        onClose={() => setDateSheetOpen(false)}
      >
        <DatePicker
          value={date ?? undefined}
          onConfirm={(d) => {
            onDateChange(d)
            if (!useDate) onUseDateChange(true)
            setDateSheetOpen(false)
          }}
          onClose={() => setDateSheetOpen(false)}
        />
      </BottomSheet>

      <BottomSheet
        isOpen={timeSheetOpen}
        onClose={() => setTimeSheetOpen(false)}
      >
        <TimePicker
          value={time ?? undefined}
          onConfirm={(t) => {
            onTimeChange(t)
            if (!useTime) onUseTimeChange(true)
            setTimeSheetOpen(false)
          }}
          onClose={() => setTimeSheetOpen(false)}
        />
      </BottomSheet>
    </>
  )
}
