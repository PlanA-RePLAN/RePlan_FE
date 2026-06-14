import { useState } from 'react'

// components
import MainButton from '@/shared/components/MainButton'
import Title from '@/shared/components/Title'
import TodoCard from '@/shared/components/TodoCard'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import CheckBoxIcon from '@/icons/CheckBoxIcon'
import MenuIcon from '@/icons/MenuIcon'
import RestLeftFillIcon from '@/icons/RestLeftFillIcon'
import SelectionCard from './SelectionCard'

// utils
import { cn } from '@/shared/utils/cn'

// types
import {
  MainOptionItem,
  MoonIcon,
  RecommendedTodo,
  SubOptionItem,
  SubSubOptionItem,
} from '../replanData'

interface TodoSuggestionProps {
  selectedOptionData: MainOptionItem
  selectedSubOptionData: SubOptionItem
  selectedSubSubOptionData?: SubSubOptionItem
  onFinishWithoutAdd: () => void
  onAddTodos: (ids: string[]) => void
}

export default function TodoSuggestion({
  selectedOptionData,
  selectedSubOptionData,
  selectedSubSubOptionData,
  onFinishWithoutAdd,
  onAddTodos,
}: TodoSuggestionProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const titleLines = selectedSubOptionData.todoSuggestionTitle ?? [
    '완료했어요!',
    '수고하셨습니다.',
  ]
  const recommendedTodos = selectedSubOptionData.recommendedTodos ?? []

  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    )
  }

  const handleTodoClick = (todo: RecommendedTodo) => {
    setSelectedIds((prev) =>
      prev.includes(todo.id)
        ? prev.filter((t) => t !== todo.id)
        : [...prev, todo.id],
    )
  }

  return (
    <div className="px-5 pt-8 pb-36">
      <div className="flex flex-col gap-3 mb-8">
        <Title>
          {titleLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </Title>
      </div>

      <SelectionCard
        step={2}
        icon={selectedOptionData.icon}
        label={selectedOptionData.label}
      />
      <SelectionCard
        step={3}
        icon={selectedSubOptionData.icon}
        label={selectedSubOptionData.label}
      />
      {selectedSubSubOptionData && (
        <SelectionCard
          step={4}
          icon={selectedSubSubOptionData.icon ?? <MoonIcon />}
          label={selectedSubSubOptionData.label}
        />
      )}

      <div className="flex justify-center mb-4">
        <ChevronDownIcon color="#E6F0FC" width={40} height={30} />
      </div>

      {recommendedTodos.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MenuIcon />
              <span className="font-semibold text-sm text-bluegray-darker">
                추천 투두
              </span>
            </div>
            <button className="ml-auto flex items-center justify-center rounded-full p-1 bg-bluegray-light-hover">
              <RestLeftFillIcon />
            </button>
          </div>

          {recommendedTodos.map((todo, index) => (
            <div
              key={index}
              className="flex gap-4.25 items-center max-w-full overflow-hidden"
            >
              <button
                onClick={(e) => handleSelect(todo.id, e)}
                className={cn(
                  'w-5.5 h-5.5 shrink-0 border-bluegray-light-active border rounded-[5px] flex items-center justify-center',
                  selectedIds.includes(todo.id) && 'border-none',
                )}
              >
                {selectedIds.includes(todo.id) && (
                  <CheckBoxIcon color="#579DEC" />
                )}
              </button>
              <div className="flex-1" onClick={() => handleTodoClick(todo)}>
                <TodoCard
                  status={selectedIds.includes(todo.id) ? 'focused' : 'default'}
                >
                  <TodoCard.Content>
                    <TodoCard.Title dayTag={todo.dayTag}>
                      {todo.title}
                    </TodoCard.Title>
                    <TodoCard.Time>{todo.time}</TodoCard.Time>
                  </TodoCard.Content>
                  <TodoCard.Category category={todo.category} />
                </TodoCard>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="fixed pb-10 pt-6 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <div className="flex gap-3">
          <MainButton
            option="secondary"
            onClick={onFinishWithoutAdd}
            title="추가 없이 끝내기"
            className="flex-1"
          />
          <MainButton
            option="primary"
            onClick={() => onAddTodos(selectedIds)}
            title="투두 추가하기"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
