import { useState } from 'react'
import Description from '@/shared/components/Description'
import Input from '@/shared/components/Input'
import Title from '@/shared/components/Title'
import MainButton from '@/shared/components/MainButton'

export default function WritingGoal({ moveNext }: { moveNext: () => void }) {
  const [goal, setGoal] = useState('')

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 pb-6">
        <Title>목표를 작성해주세요!</Title>
        <Description>
          <div>
            목표 기한, 교재 등 이미 계획한 것이 있다면 함께 작성해주세요.
          </div>
          <div>추상적이어도 좋아요. 구체화를 도와줄게요!</div>
        </Description>
      </div>

      <Input value={goal} setValue={setGoal} maxLength={80} showCount="always">
        <Input.Label option="secondary">목표</Input.Label>
        <Input.Field height={89} placeholder="목표를 입력해주세요" />
        <Input.Bottom>
          <Input.Example>
            e.g. 토익 850점, 8월까지, ETS 단기공략 토익 850+ 교재 사용
          </Input.Example>
          <Input.Count />
        </Input.Bottom>
      </Input>

      <MainButton
        option={goal.trim() ? 'primary' : 'disabled'}
        onClick={moveNext}
        title="다음으로"
        className="mt-10"
      />
    </div>
  )
}
