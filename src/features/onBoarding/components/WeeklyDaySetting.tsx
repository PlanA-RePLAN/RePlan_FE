import Toggle from '@/shared/components/Toggle'
import ClockIcon from '@/icons/ClockIcon'
import TimePicker from './TimePicker'
import { cn } from '@/shared/utils/cn'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

interface WeeklyDaySettingProps {
  selectedDays: string[]
  onDaysChange: (days: string[]) => void
  timeEnabled: boolean
  onTimeEnabledChange: (enabled: boolean) => void
  time: string
  onTimeChange: (time: string) => void
}

export default function WeeklyDaySetting({
  selectedDays,
  onDaysChange,
  timeEnabled,
  onTimeEnabledChange,
  time,
  onTimeChange,
}: WeeklyDaySettingProps) {
  const toggle = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) return
      onDaysChange(selectedDays.filter((d) => d !== day))
    } else {
      onDaysChange([...selectedDays, day])
    }
  }

  return (
    <>
      <div className="flex justify-between my-7 px-1">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => toggle(day)}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium',
              selectedDays.includes(day)
                ? 'bg-bluegray-black text-white'
                : day === '토'
                  ? 'text-blue-500'
                  : day === '일'
                    ? 'text-red-500'
                    : 'text-bluegray-normal',
            )}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="w-full mt-2 border-b border-bluegray-light-hover py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClockIcon />
          <div className="text-sm font-medium text-bluegray-dark">
            반복 시간
          </div>
        </div>
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
