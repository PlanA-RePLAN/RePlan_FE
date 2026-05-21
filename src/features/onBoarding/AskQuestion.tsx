// components
import Title from '@/shared/components/Title'
import Description from '@/shared/components/Description'
import MainButton from '@/shared/components/MainButton'
import ListItem from '@/shared/components/ListItem'
import GoalIcon from '@/icons/GoalIcon'
import CheckBoxIcon from '@/icons/CheckBoxIcon'
import CalendarClearSharpIcon from '@/icons/CalendarClearSharpIcon'
import CalendarWithClockIcon from '@/icons/CalendarWithClockIcon'

// utils
import { useState } from 'react'
import { cn } from '@/shared/utils/cn'
import ChecvronRightIcon from '@/icons/ChevronLeftIcon'

const CHOICES = [
  { id: 'self', label: '직접 선택할게요' },
  { id: 'recommended', label: '추천 받고 싶어요' },
  { id: 'no_deadline', label: '기한을 설정하지 않을래요' },
]

export default function AskQuestion({ moveNext }: { moveNext: () => void }) {
  const [period, setPeriod] = useState('')
  const [deadlineDate] = useState('')
  const [deadlineTime] = useState('')

  const isNextEnabled =
    period === 'self' ? deadlineDate.trim() !== '' : period.trim() !== ''

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3">
        <Title>질문이 있어요.</Title>
        <Description>
          <div className="flex items-center gap-2">
            <GoalIcon />
            <div>목표 기한은 언제까지인가요?</div>
          </div>
        </Description>
      </div>
      <ListItem className="my-8">토익 850점 달성</ListItem>
      <div className="flex flex-col gap-3">
        {CHOICES.map((choice, index) => (
          <ListItem
            key={index}
            className={cn(
              'bg-bluegray-light text-bluegray-darker font-medium transition-colors duration-300 ease-in-out border border-transparent',
              choice.id === period &&
                'bg-white border-bluegray-light-active px-0',
            )}
          >
            <button
              onClick={() => setPeriod(choice.id)}
              className={cn(
                'flex items-center gap-3 w-full',
                choice.id === period && 'px-4',
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 shrink-0 border-bluegray-normal border rounded-[5px] flex items-center justify-center',
                  choice.id === period && 'border-none',
                )}
              >
                {choice.id === period && <CheckBoxIcon />}
              </div>
              <div>{choice.label}</div>
            </button>

            {/* 마감 날짜와 시간 입력 필드 */}
            {choice.id !== 'no_deadline' && (
              <div
                className={cn(
                  'grid transition-all duration-500 ease-in-out',
                  choice.id === period ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center py-4 my-4 border-y border-bluegray-light-hover px-4">
                      <div className="flex gap-2 items-center">
                        <div className="w-5.5 h-5.5 rounded-full bg-bluegray-light-active flex items-center justify-center">
                          <CalendarClearSharpIcon fill="white" />
                        </div>
                        <div>마감 날짜</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="text-bluegray-dark-active text-xs font-bold">
                          {deadlineDate}
                        </div>
                        <ChecvronRightIcon
                          className="rotate-180"
                          width="20"
                          height="20"
                          color="#A9AFB9"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <div className="flex gap-2 items-center">
                        <div className="w-5.5 h-5.5 rounded-full bg-bluegray-light-active flex items-center justify-center">
                          <CalendarWithClockIcon fill="white" />
                        </div>
                        <div>마감 시간</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="text-bluegray-dark-active text-xs font-bold">
                          {deadlineTime}
                        </div>
                        <ChecvronRightIcon
                          className="rotate-180"
                          width="20"
                          height="20"
                          color="#A9AFB9"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ListItem>
        ))}
      </div>

      <MainButton
        option={isNextEnabled ? 'primary' : 'disabled'}
        onClick={moveNext}
        title="다음으로"
        className="mt-10"
      />
    </div>
  )
}
