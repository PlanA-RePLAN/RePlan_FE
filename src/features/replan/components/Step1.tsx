import MainButton from '@/shared/components/MainButton'
import Title from '@/shared/components/Title'
import TodoCard from '@/shared/components/TodoCard'
import type { TodoDetail } from '@/shared/types/todo'
import { MAIN_OPTIONS, MainOptionKey } from '../replanData'
import { getDayTag, formatTime } from '../utils'
import DirectInputOption from './DirectInputOption'
import ReplanOption from './ReplanOption'

interface Step1Props {
  anchorTodo: TodoDetail | null
  selectedOption: MainOptionKey | null
  onOptionChange: (key: MainOptionKey) => void
  directInputText: string
  onDirectInputTextChange: (text: string) => void
  onNext: () => void
  isSubmitting: boolean
}

export default function Step1({
  anchorTodo,
  selectedOption,
  onOptionChange,
  directInputText,
  onDirectInputTextChange,
  onNext,
  isSubmitting,
}: Step1Props) {
  return (
    <div className="px-5 pt-8">
      <div className="flex flex-col gap-3 mb-8">
        <Title>
          <div>조금 놓쳐도 괜찮아요!</div>
          <div>어떤 일이 있었나요?</div>
        </Title>
      </div>

      {anchorTodo && (
        <TodoCard status="focused" className="mb-8">
          <TodoCard.Content>
            <TodoCard.Title dayTag={getDayTag(anchorTodo.routineType)}>
              {anchorTodo.title}
            </TodoCard.Title>
            {anchorTodo.dueDate && (
              <TodoCard.Time>{formatTime(anchorTodo.dueDate)}</TodoCard.Time>
            )}
          </TodoCard.Content>
          {anchorTodo.tagTitle && (
            <TodoCard.Category
              category={anchorTodo.tagTitle}
              color={anchorTodo.tagColor}
            />
          )}
        </TodoCard>
      )}

      {MAIN_OPTIONS.map((option) =>
        option.key === 'directInput' ? (
          <DirectInputOption
            key={option.key}
            isSelected={selectedOption === 'directInput'}
            onChange={() => onOptionChange('directInput')}
            text={directInputText}
            onTextChange={onDirectInputTextChange}
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
          option={isSubmitting ? 'disabled' : 'primary'}
          onClick={onNext}
          title={isSubmitting ? '불러오는 중...' : '다음으로'}
          className="mt-10"
        />
      </div>
    </div>
  )
}
