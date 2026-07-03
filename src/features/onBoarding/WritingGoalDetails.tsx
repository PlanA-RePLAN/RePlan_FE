import { useState } from 'react'
import { format, isSameDay } from 'date-fns'
import axios from 'axios'

// components
import Description from '@/shared/components/Description'
import Input from '@/shared/components/Input'
import Title from '@/shared/components/Title'
import MainButton from '@/shared/components/MainButton'
import ExampleTag from './components/ExampleTag'
import MessageQuestionIcon from '@/icons/MessageQuestionIcon'
import AiLoadingOverlay from './components/AiLoadingOverlay'

// api
import { refineGoal } from '@/shared/api/goal'

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

export default function WritingGoalDetails({
  moveNext,
}: {
  moveNext: () => void
}) {
  const goalValue = useOnboardingStore((s) => s.goalValue)
  const questions = useOnboardingStore((s) => s.questions)
  const deadlineDate = useOnboardingStore((s) => s.deadlineDate)
  const deadlineTime = useOnboardingStore((s) => s.deadlineTime)
  const setRefineData = useOnboardingStore((s) => s.setRefineData)

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const hasDeadline = Boolean(
    deadlineDate && !isSameDay(deadlineDate, NO_DEADLINE_DATE),
  )

  const handleSubmit = async () => {
    if (loading) return
    setLoading(true)
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const body = {
        goal: goalValue,
        deadlineDate: hasDeadline
          ? format(deadlineDate as Date, 'yyyy-MM-dd')
          : null,
        deadlineTime: hasDeadline ? timeToHHmm(deadlineTime) : null,
        answers: questions.map((q) => ({
          question: q.question,
          answer: (answers[q.question] ?? '').trim(),
        })),
      }
      const res = await refineGoal(accessToken, body)
      if (res.success && res.data) {
        setRefineData(res.data)
        moveNext()
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.error('[refineGoal] error response', e.response?.data)
      } else {
        console.error('[refineGoal] error', e)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col relative">
      <div className="flex flex-col gap-3 pb-6">
        <Title>몇 가지만 더 물어볼게요!</Title>
        <Description>
          <div>목표에 맞는 질문을 준비했어요.</div>
          <div>답변할수록 더 정확한 플랜이 만들어져요.</div>
        </Description>
      </div>

      <div className="flex flex-col gap-5">
        {questions.map((q) => (
          <Input
            key={q.question}
            value={answers[q.question] ?? ''}
            setValue={(v) =>
              setAnswers((prev) => ({ ...prev, [q.question]: v }))
            }
            maxLength={120}
            showCount="always"
          >
            <Input.Label option="secondary">
              <div className="flex gap-2 items-center text-bluegray-black">
                <MessageQuestionIcon />
                {q.question}
              </div>
            </Input.Label>
            <div className="flex gap-1.25 py-2 overflow-x-auto">
              {q.chips.map((chip) => (
                <ExampleTag
                  key={chip}
                  tag={chip}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [q.question]: chip }))
                  }
                />
              ))}
            </div>
            <Input.Field height={95} placeholder="답변을 입력해주세요" />
            <Input.Bottom>
              <Input.Count />
            </Input.Bottom>
          </Input>
        ))}
      </div>

      <div className="h-30" />
      <div className="fixed pb-13 pt-10 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <MainButton
          option={loading ? 'disabled' : 'primary'}
          onClick={handleSubmit}
          title="다음으로"
        />
      </div>

      {loading && <AiLoadingOverlay message="딱 맞는 플랜을 짜고 있어요!" />}
    </div>
  )
}
