import { useEffect, useState } from 'react'
import MainButton from '@/shared/components/MainButton'
import Title from '@/shared/components/Title'
import TodoCard from '@/shared/components/TodoCard'
import Input from '@/shared/components/Input'
import CheckBoxIcon from '@/icons/CheckBoxIcon'
import { getTodos } from '@/shared/api/todo'
import type { Todo } from '@/shared/types/todo'
import type {
  ReplanAnchorTodo,
  ReplanAnswer,
  ReplanQuestion,
} from '@/shared/types/replan'
import { cn } from '@/shared/utils/cn'
import { getDayTag, formatTime } from '../utils'

interface QuestionStepProps {
  anchorTodo: ReplanAnchorTodo
  questions: ReplanQuestion[]
  answers: Record<string, ReplanAnswer>
  onAnswerChange: (key: string, value: Partial<ReplanAnswer>) => void
  onNext: () => void
  excludeTodoId: number
  isSubmitting: boolean
}

export default function QuestionStep({
  anchorTodo,
  questions,
  answers,
  onAnswerChange,
  onNext,
  excludeTodoId,
  isSubmitting,
}: QuestionStepProps) {
  const [candidateTodos, setCandidateTodos] = useState<Todo[]>([])
  const needsTodoSelect = questions.some((q) => q.type === 'TODO_SELECT')

  useEffect(() => {
    if (!needsTodoSelect) return
    const accessToken = localStorage.getItem('accessToken') ?? ''
    getTodos(accessToken, 'all', 'dueDate').then((res) => {
      setCandidateTodos(
        (res.data ?? []).filter((t) => t.todoId !== excludeTodoId),
      )
    })
  }, [needsTodoSelect, excludeTodoId])

  const toggleSelectedTodo = (key: string, todoId: number) => {
    const current = answers[key]?.selectedTodoIds ?? []
    const next = current.includes(todoId)
      ? current.filter((id) => id !== todoId)
      : [...current, todoId]
    onAnswerChange(key, { selectedTodoIds: next })
  }

  return (
    <div className="px-5 pt-8 pb-36">
      <div className="flex flex-col gap-3 mb-8">
        <Title>
          <div>추가 질문이 있어요.</div>
          <div>답변할수록 더 적절한 투두가 만들어져요.</div>
        </Title>
      </div>

      <div className="mb-6">
        <p className="font-semibold text-sm text-bluegray-darker mb-2">
          기존 투두 수정 사항
        </p>
        <TodoCard status="default">
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
      </div>

      {questions.map((question) => (
        <div key={question.key} className="mb-6">
          <p className="font-semibold text-sm text-bluegray-darker mb-2">
            {question.title}
          </p>

          {question.type === 'TEXT' ? (
            <Input
              maxLength={120}
              showCount="always"
              value={answers[question.key]?.text ?? ''}
              setValue={(text) => onAnswerChange(question.key, { text })}
            >
              <Input.Field placeholder="답변을 입력해주세요" />
              <Input.Bottom>
                <Input.Count />
              </Input.Bottom>
            </Input>
          ) : (
            <div className="flex flex-col gap-3">
              {candidateTodos.map((todo) => {
                const selected = (
                  answers[question.key]?.selectedTodoIds ?? []
                ).includes(todo.todoId)
                return (
                  <div
                    key={todo.todoId}
                    className="flex gap-4.25 items-center max-w-full overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        toggleSelectedTodo(question.key, todo.todoId)
                      }
                      className={cn(
                        'w-5.5 h-5.5 shrink-0 border-bluegray-light-active border rounded-[5px] flex items-center justify-center',
                        selected && 'border-none',
                      )}
                    >
                      {selected && <CheckBoxIcon color="#579DEC" />}
                    </button>
                    <div
                      className="flex-1"
                      onClick={() =>
                        toggleSelectedTodo(question.key, todo.todoId)
                      }
                    >
                      <TodoCard status={selected ? 'focused' : 'default'}>
                        <TodoCard.Content>
                          <TodoCard.Title dayTag={getDayTag(todo.routineType)}>
                            {todo.title}
                          </TodoCard.Title>
                          {todo.dueDate && (
                            <TodoCard.Time>
                              {formatTime(todo.dueDate)}
                            </TodoCard.Time>
                          )}
                        </TodoCard.Content>
                        {todo.tagTitle && (
                          <TodoCard.Category
                            category={todo.tagTitle}
                            color={todo.tagColor}
                          />
                        )}
                      </TodoCard>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}

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
