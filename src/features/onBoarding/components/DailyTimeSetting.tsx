import Toggle from '@/shared/components/Toggle'
import TimePicker from './TimePicker'

interface DailyTimeSettingProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  time: string
  onTimeChange: (time: string) => void
}

export default function DailyTimeSetting({
  checked,
  onCheckedChange,
  time,
  onTimeChange,
}: DailyTimeSettingProps) {
  return (
    <>
      <div className="w-full mt-2 border-b border-bluegray-light-hover py-4 flex items-center justify-between">
        <div className="text-sm font-medium text-bluegray-dark">반복시간</div>
        <div className="flex gap-3 items-center">
          {checked && (
            <span className="bg-blue-light text-xs font-bold text-bluegray-dark-active rounded-full px-3 py-1">
              {time}
            </span>
          )}
          <Toggle checked={checked} onChange={onCheckedChange} />
        </div>
      </div>

      {checked && (
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
