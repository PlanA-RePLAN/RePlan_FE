import { useState } from 'react'
import { format } from 'date-fns'
import axios from 'axios'

// components
import Description from '@/shared/components/Description'
import Input from '@/shared/components/Input'
import Title from '@/shared/components/Title'
import MainButton from '@/shared/components/MainButton'
import ExampleTag from './components/ExampleTag'
import MessageQuestionIcon from '@/icons/MessageQuestionIcon'

// api
import { refineGoal } from '@/shared/api/goal'

// stores
import { useOnboardingStore } from '@/store/onboardingStore'

export default function WritingGoalDetails({
  moveNext,
}: {
  moveNext: () => void
}) {
  const goalValue = useOnboardingStore((s) => s.goalValue)
  const deadlineDate = useOnboardingStore((s) => s.deadlineDate)
  const deadlineTime = useOnboardingStore((s) => s.deadlineTime)
  const setRefineData = useOnboardingStore((s) => s.setRefineData)

  const [currentLevel, setCurrentLevel] = useState('')
  const [availableTime, setAvailableTime] = useState('')
  const [specialNote, setSpecialNote] = useState('')
  const [loading, setLoading] = useState(false)

  const isFilled = Boolean(
    currentLevel.trim() && availableTime.trim() && specialNote.trim(),
  )

  const handleSubmit = async () => {
    if (!isFilled || loading) return
    setLoading(true)
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const deadline = deadlineDate
        ? `${format(deadlineDate, 'yyyy-MM-dd')}${
            deadlineTime ? ` ${deadlineTime}` : ''
          }`
        : ''
      const body = {
        goal: goalValue,
        deadline,
        currentLevel: currentLevel.trim(),
        availableTime: availableTime.trim(),
        notes: specialNote.trim(),
      }
      console.log('[refineGoal] request body', body)
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
        {/* 현재 수준 */}
        <Input
          value={currentLevel}
          setValue={setCurrentLevel}
          maxLength={120}
          showCount="always"
        >
          <Input.Label option="secondary">
            <div className="flex gap-2 items-center text-bluegray-black">
              <MessageQuestionIcon />
              현재 수준
            </div>
          </Input.Label>
          <div className="flex gap-1.25 py-2 overflow-x-auto">
            <ExampleTag
              tag="토익 600점대"
              onClick={() => setCurrentLevel('토익 600점대')}
            />
            <ExampleTag
              tag="RC 파트 취약"
              onClick={() => setCurrentLevel('RC 파트 취약')}
            />
            <ExampleTag
              tag="영어 공백 3년"
              onClick={() => setCurrentLevel('영어 공백 3년')}
            />
          </div>
          <Input.Field height={95} placeholder="답변을 입력해주세요" />
          <Input.Bottom>
            <Input.Count />
          </Input.Bottom>
        </Input>

        {/* 투자 가능 시간 */}
        <Input
          value={availableTime}
          setValue={setAvailableTime}
          maxLength={120}
          showCount="always"
        >
          <Input.Label option="secondary">
            <div className="flex gap-2 items-center text-bluegray-black">
              <MessageQuestionIcon />
              투자 가능 시간
            </div>
          </Input.Label>
          <div className="flex gap-1.25 py-2 overflow-x-auto">
            <ExampleTag
              tag="주 5회 2시간"
              onClick={() => setAvailableTime('주 5회 2시간')}
            />
            <ExampleTag
              tag="자투리 시간만"
              onClick={() => setAvailableTime('자투리 시간만')}
            />
            <ExampleTag
              tag="주말 집중"
              onClick={() => setAvailableTime('주말 집중')}
            />
          </div>
          <Input.Field height={95} placeholder="답변을 입력해주세요" />
          <Input.Bottom>
            <Input.Count />
          </Input.Bottom>
        </Input>

        {/* 특이사항 */}
        <Input
          value={specialNote}
          setValue={setSpecialNote}
          maxLength={120}
          showCount="always"
        >
          <Input.Label option="secondary">
            <div className="flex gap-2 items-center text-bluegray-black">
              <MessageQuestionIcon />
              특이사항
            </div>
          </Input.Label>
          <div className="flex gap-1.25 py-2 overflow-x-auto">
            <ExampleTag
              tag="교재 있어요"
              onClick={() => setSpecialNote('교재 있어요')}
            />
            <ExampleTag
              tag="학원 병행 중"
              onClick={() => setSpecialNote('학원 병행 중')}
            />
            <ExampleTag tag="없음" onClick={() => setSpecialNote('없음')} />
          </div>
          <Input.Field height={95} placeholder="답변을 입력해주세요" />
          <Input.Bottom>
            <Input.Count />
          </Input.Bottom>
        </Input>
      </div>

      <div className="h-30" />
      <div className="fixed pb-13 pt-10 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <MainButton
          option={isFilled && !loading ? 'primary' : 'disabled'}
          onClick={handleSubmit}
          title={loading ? '분석 중...' : '다음으로'}
        />
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-bluegray-light-hover border-t-bluegray-black rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
