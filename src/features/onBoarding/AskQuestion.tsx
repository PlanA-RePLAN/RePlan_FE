// components
import Title from '@/shared/components/Title'
import Description from '@/shared/components/Description'
import MainButton from '@/shared/components/MainButton'
import ListItem from '@/shared/components/ListItem'
// utils
import { useState } from 'react'
import GoalIcon from '@/icons/GoalIcon'
import CheckBoxIcon from '@/icons/CheckBoxIcon'
import { cn } from '@/shared/utils/cn'

export default function AskQuestion({ moveNext }: { moveNext: () => void }) {
  const [period, setPeriod] = useState('')
  const choices = [
    { id: 'self', label: '직접 선택할게요' },
    { id: 'recommended', label: '추천 받고 싶어요' },
    { id: 'no_deadline', label: '기한을 설정하지 않을래요' },
  ]

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
        {choices.map((choice, index) => (
          <ListItem
            key={index}
            className="bg-bluegray-light text-bluegray-darker font-medium items-center"
          >
            <div className="flex gap-3">
              <button
                onClick={() => setPeriod(choice.id)}
                className={cn(
                  'w-5 h-5 bg-transparent border-bluegray-normal border rounded-[5px]',
                  choice.id === period && 'border-none',
                )}
              >
                {choice.id === period && <CheckBoxIcon />}
              </button>
              <div>{choice.label}</div>
            </div>
          </ListItem>
        ))}
      </div>

      <MainButton
        option={period.trim() ? 'primary' : 'disabled'}
        onClick={moveNext}
        title="다음으로"
        className="mt-10"
      />
    </div>
  )
}
