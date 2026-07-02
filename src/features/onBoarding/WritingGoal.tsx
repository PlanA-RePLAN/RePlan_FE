import { useState } from 'react'
import { format, isSameDay } from 'date-fns'

// components
import Description from '@/shared/components/Description'
import Input from '@/shared/components/Input'
import Title from '@/shared/components/Title'
import MainButton from '@/shared/components/MainButton'
import GoalIcon from '@/icons/GoalIcon'
import ExampleTag from './components/ExampleTag'
import CalendarClearSharpIcon from '@/icons/CalendarClearSharpIcon'
import EndScheduleInput from './components/EndScheduleInput'
import GoalToast from './components/GoalToast'

// api
import { exploreGoal } from '@/shared/api/goal'

// stores
import { useOnboardingStore, NO_DEADLINE_DATE } from '@/store/onboardingStore'

function timeToHHmm(time: string | null): string | null {
  if (!time) return null
  const [timePart, period] = time.trim().split(' ')
  if (!period) return timePart
  const [hStr, mStr] = timePart.split(':')
  let h = parseInt(hStr)
  if (h > 12) return `${String(h).padStart(2, '0')}:${mStr}`
  if (period === 'AM') {
    h = h === 12 ? 0 : h
  } else {
    h = h === 12 ? 12 : h + 12
  }
  return `${String(h).padStart(2, '0')}:${mStr}`
}

export default function WritingGoal({ moveNext }: { moveNext: () => void }) {
  // store에서 관리되는 전역 변수
  const storeGoalValue = useOnboardingStore((s) => s.goalValue)
  const storeDeadlineDate = useOnboardingStore((s) => s.deadlineDate)
  const storeDeadlineTime = useOnboardingStore((s) => s.deadlineTime)
  const setGoalValue = useOnboardingStore((s) => s.setGoalValue)
  const setDeadlineDate = useOnboardingStore((s) => s.setDeadlineDate)
  const setDeadlineTime = useOnboardingStore((s) => s.setDeadlineTime)

  const hasStoredDeadline = Boolean(
    storeDeadlineDate && !isSameDay(storeDeadlineDate, NO_DEADLINE_DATE),
  )

  // local state
  const [goal, setGoal] = useState(storeGoalValue)
  const [endDate, setEndDate] = useState<Date | null>(
    hasStoredDeadline ? storeDeadlineDate : null,
  )
  const [useEndDate, setUseEndDate] = useState(hasStoredDeadline)
  const [endTime, setEndTime] = useState<string | null>(storeDeadlineTime)
  const [useEndTime, setUseEndTime] = useState(storeDeadlineTime !== null)
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const setQuestions = useOnboardingStore((s) => s.setQuestions)

  const isFilled = Boolean(goal.trim())

  const handleSubmit = async () => {
    if (!isFilled || loading) return
    setLoading(true)
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const deadlineDate =
        useEndDate && endDate ? format(endDate, 'yyyy-MM-dd') : null
      const deadlineTime = useEndDate && useEndTime ? timeToHHmm(endTime) : null
      const res = await exploreGoal(accessToken, {
        goal: goal.trim(),
        deadlineDate,
        deadlineTime,
      })
      if (res.success && res.data) {
        if (!res.data.valid) {
          setToastMessage(
            res.data.message ?? '달성할 수 있는 목표를 입력해주세요.',
          )
          return
        }
        setGoalValue(goal.trim())
        setDeadlineDate(useEndDate && endDate ? endDate : NO_DEADLINE_DATE)
        setDeadlineTime(useEndDate && useEndTime ? endTime : null)
        setQuestions(res.data.questions)
        moveNext()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 pb-6">
        <Title>목표를 작성해주세요!</Title>
        <Description>
          <div>추상적이어도 좋아요. 구체화를 도와줄게요! </div>
          <div>항목을 구체적으로 채울수록 완성도 있는 투두가 만들어져요.</div>
        </Description>
      </div>

      {/* --------- 목표 입력 ------------ */}
      <Input value={goal} setValue={setGoal} maxLength={50} showCount="always">
        <Input.Label option="secondary">
          <div className="flex gap-2 items-center text-bluegray-black">
            <GoalIcon colored={false} />
            목표
          </div>
        </Input.Label>
        <div className="flex gap-1.25 py-2 overflow-x-auto">
          <ExampleTag
            tag="토익 850점 달성하기"
            onClick={() => setGoal('토익 850점 달성하기')}
          />
          <ExampleTag
            tag="5kg 감량하기"
            onClick={() => setGoal('5kg 감량하기')}
          />
          <ExampleTag
            tag="책 완독하기"
            onClick={() => setGoal('책 완독하기')}
          />
          <ExampleTag
            tag="자격증 취득하기"
            onClick={() => setGoal('자격증 취득하기')}
          />
          <ExampleTag
            tag="저축 목표 달성하기"
            onClick={() => setGoal('저축 목표 달성하기')}
          />
          <ExampleTag
            tag="운동 습관 만들기"
            onClick={() => setGoal('운동 습관 만들기')}
          />
        </div>
        <Input.Field height={49} placeholder="목표를 입력해주세요" />
        <Input.Bottom>
          <Input.Count />
        </Input.Bottom>
      </Input>

      {/* --------- 종료 일정 ------------ */}
      <div className="h-8" />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center text-bluegray-black text-sm font-medium">
          <CalendarClearSharpIcon width={20} height={20} color="#3B3D41" />
          종료 일정
        </div>
        <EndScheduleInput
          date={endDate}
          time={endTime}
          useDate={useEndDate}
          useTime={useEndTime}
          onUseDateChange={setUseEndDate}
          onUseTimeChange={setUseEndTime}
          onDateChange={setEndDate}
          onTimeChange={setEndTime}
        />
      </div>

      <div className="h-30" />
      <div className="fixed pb-13 pt-10 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <MainButton
          option={isFilled && !loading ? 'primary' : 'disabled'}
          onClick={handleSubmit}
          title={loading ? '분석 중...' : '다음으로'}
        />
      </div>

      {toastMessage && (
        <GoalToast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  )
}
