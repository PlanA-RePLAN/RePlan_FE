import MainButton from '@/shared/components/MainButton'
import Title from '@/shared/components/Title'
import TodoCard from '@/shared/components/TodoCard'
import { MAIN_OPTIONS, MainOptionKey } from '../replanData'
import DirectInputOption from './DirectInputOption'
import ReplanOption from './ReplanOption'

interface Step1Props {
  selectedOption: MainOptionKey | null
  onOptionChange: (key: MainOptionKey) => void
  onNext: () => void
}

export default function Step1({
  selectedOption,
  onOptionChange,
  onNext,
}: Step1Props) {
  return (
    <div className="px-5 pt-8">
      <div className="flex flex-col gap-3 mb-8">
        <Title>
          <div>조금 놓쳐도 괜찮아요!</div>
          <div>어떤 일이 있었나요?</div>
        </Title>
      </div>

      <TodoCard status="focused" className="mb-8">
        <TodoCard.Content>
          <TodoCard.Title dayTag="M">영어 단어 100개 암기</TodoCard.Title>
          <TodoCard.Time>9:00 PM</TodoCard.Time>
        </TodoCard.Content>
        <TodoCard.Category category="Study" />
      </TodoCard>

      {MAIN_OPTIONS.map((option) =>
        option.key === 'directInput' ? (
          <DirectInputOption
            key={option.key}
            isSelected={selectedOption === 'directInput'}
            onChange={() => onOptionChange('directInput')}
          />
        ) : (
          <ReplanOption
            key={option.key}
            icon={option.icon}
            label={option.label}
            onChange={() => onOptionChange(option.key)}
            isSelected={selectedOption === option.key}
          />
        ),
      )}

      <div className="fixed pb-10 pt-10 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <MainButton
          option="primary"
          onClick={onNext}
          title="다음으로"
          className="mt-10"
        />
      </div>
    </div>
  )
}
