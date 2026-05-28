// components
import Title from '@/shared/components/Title'
import Description from '@/shared/components/Description'
import MainButton from '@/shared/components/MainButton'
import ListItem from '@/shared/components/ListItem'
import GoalIcon from '@/icons/GoalIcon'
import CalendarClearSharpIcon from '@/icons/CalendarClearSharpIcon'
import CalendarWithClockIcon from '@/icons/CalendarWithClockIcon'
import ChecvronRightIcon from '@/icons/ChevronLeftIcon'
import BottomSheet from '@/shared/components/BottomSheet'
import DatePicker from '@/features/onBoarding/components/DatePicker'
import TimePicker from '@/features/onBoarding/components/TimePicker'

// utils
import { useState } from 'react'
import { format } from 'date-fns'
import { cn } from '@/shared/utils/cn'

export default function AskQuestion({ moveNext }: { moveNext: () => void }) {
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined)
  const [deadlineTime, setDeadlineTime] = useState('')
  const [dateSheetOpen, setDateSheetOpen] = useState(false)
  const [timeSheetOpen, setTimeSheetOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3">
        <Title>이렇게 정리했어요!</Title>
        <Description>수정하고 싶은 항목을 눌러주세요.</Description>
      </div>
      <div className="flex gap-2 mt-8">
        <GoalIcon />
        <div className="font-medium">목표</div>
      </div>
      <ListItem className="mt-2 mb-8 text-bluegray-black">
        토익 850점 달성
      </ListItem>
      <div className="flex gap-2 text-bluegray-black items-center font-medium">
        <CalendarClearSharpIcon width={20} height={20} color="#3B3D41" />
        마감기한
      </div>
      {/* 마감 날짜와 시간 입력 필드 */}
      <div className={cn('grid transition-all duration-500 ease-in-out')}>
        <div className="overflow-hidden">
          <div className="flex flex-col">
            <button
              onClick={() => setDateSheetOpen(true)}
              className="flex justify-between items-center py-4 mt-2 border-y border-bluegray-light-hover w-full"
            >
              <div className="flex gap-2 items-center">
                <div className="w-5.5 h-5.5 rounded-full bg-bluegray-light-active flex items-center justify-center">
                  <CalendarClearSharpIcon fill="white" />
                </div>
                <div className="text-sm font-medium">마감 날짜</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-bluegray-dark-active text-xs font-bold py-1 px-3 rounded-full bg-blue-light">
                  {deadlineDate ? format(deadlineDate, 'yyyy년 MM월 dd일') : ''}
                </div>
                <ChecvronRightIcon
                  className="rotate-180"
                  width="18"
                  height="18"
                  color="#A9AFB9"
                />
              </div>
            </button>
            <button
              onClick={() => setTimeSheetOpen(true)}
              className="flex justify-between items-center py-4 w-full border-b border-bluegray-light-hover"
            >
              <div className="flex gap-2 items-center">
                <div className="w-5.5 h-5.5 rounded-full bg-bluegray-light-active flex items-center justify-center">
                  <CalendarWithClockIcon fill="white" />
                </div>
                <div className="text-sm font-medium">마감 시간</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-bluegray-dark-active text-xs font-bold py-1 px-3 rounded-full bg-blue-light">
                  {deadlineTime}
                </div>
                <ChecvronRightIcon
                  className="rotate-180"
                  width="18"
                  height="18"
                  color="#A9AFB9"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed pb-13 pt-10 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <MainButton
          option="primary"
          onClick={moveNext}
          title="다음으로"
          className="mt-10"
        />
      </div>

      <BottomSheet
        isOpen={dateSheetOpen}
        onClose={() => setDateSheetOpen(false)}
      >
        <DatePicker
          value={deadlineDate}
          onConfirm={(date) => {
            setDeadlineDate(date)
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
          value={deadlineTime}
          onConfirm={(time) => {
            setDeadlineTime(time)
            setTimeSheetOpen(false)
          }}
          onClose={() => setTimeSheetOpen(false)}
        />
      </BottomSheet>
    </div>
  )
}
