import Title from '@/shared/components/Title'
import Description from '@/shared/components/Description'
import MainButton from '@/shared/components/MainButton'
import MenuIcon from '@/icons/MenuIcon'
import ListItem from '@/shared/components/ListItem'
import RestLeftFillIcon from '@/icons/RestLeftFillIcon'
import TodoCard from '@/shared/components/TodoCard'
import CheckBoxIcon from '@/icons/CheckBoxIcon'
import TodoInfoSheet from './components/TodoInfoSheet'
import TodoEditSheet from './components/TodoEditSheet'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { cn } from '@/shared/utils/cn'
import {
  type ProposedTodo,
  type CustomTag,
  PRESET_TAGS,
  ROUTINE_TO_REPEAT,
  REPEAT_TO_ROUTINE,
} from './type/types'
import { useOnboardingStore } from '@/store/onboardingStore'
import type { AiRecommendedTodo } from '@/shared/types/goal'
import type { TodoDetail } from '@/shared/types/todo'
import { createGoalWithTodos } from '@/shared/api/goal'

interface ProposeGoalProps {
  moveNext: () => void
}

function formatTime24to12(time: string | null): string {
  if (!time) return ''
  const [hStr, mStr] = time.split(':')
  const h = parseInt(hStr)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${String(h12).padStart(2, '0')}:${mStr} ${period}`
}

// "HH12:mm AM/PM" 또는 "HH24:mm AM/PM" → "HH:mm" (24h)
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

function toTodoDetail(t: ProposedTodo): TodoDetail {
  return {
    todoId: t.id,
    title: t.title,
    dueDate: t.deadlineDate ? format(t.deadlineDate, 'yyyy-MM-dd') : null,
    isCompleted: false,
    tagId: null,
    tagTitle: t.selectedTagId === '미선택' ? null : t.selectedTagId,
    tagColor: null,
    routineType: REPEAT_TO_ROUTINE[t.repeat],
    subTodos: t.subTodos.map((s) => ({
      todoId: s.id,
      title: s.title,
      isCompleted: false,
    })),
  }
}

function mapAiTodo(todo: AiRecommendedTodo, index: number): ProposedTodo {
  const repeat = todo.routineType
    ? (ROUTINE_TO_REPEAT[todo.routineType] ?? '없음')
    : '없음'
  const dayTag: 'D' | 'M' =
    todo.routineType === 'WEEKLY' || todo.routineType === 'MONTHLY' ? 'M' : 'D'

  return {
    id: index + 1,
    title: todo.title,
    time: formatTime24to12(todo.dueTime),
    dayTag,
    selectedTagId: 'Study',
    repeat,
    routineDate: todo.routineDate ?? null,
    deadlineDate: todo.dueDate ? new Date(todo.dueDate) : null,
    deadlineTime: todo.dueTime ? formatTime24to12(todo.dueTime) : null,
    subTodos: [],
  }
}

export default function ProposeGoal({ moveNext }: ProposeGoalProps) {
  const aiRecommendation = useOnboardingStore((s) => s.aiRecommendation)
  const goalValue = useOnboardingStore((s) => s.goalValue)
  const deadlineDate = useOnboardingStore((s) => s.deadlineDate)
  const deadlineTime = useOnboardingStore((s) => s.deadlineTime)

  const initialTodos = useMemo(
    () => (aiRecommendation?.todos ?? []).map(mapAiTodo),
    [aiRecommendation],
  )

  const [todos, setTodos] = useState<ProposedTodo[]>(initialTodos)
  const [allTags, setAllTags] = useState<CustomTag[]>(PRESET_TAGS)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [selectedTodo, setSelectedTodo] = useState<ProposedTodo | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleTodoClick = (todo: ProposedTodo) => {
    setSelectedTodo(todo)
    setInfoOpen(true)
  }

  const handleEditOpen = () => {
    setInfoOpen(false)
    setEditOpen(true)
  }

  const handleEditConfirm = (updated: ProposedTodo) => {
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    setSelectedTodo(updated)
    setEditOpen(false)
    setInfoOpen(true)
  }

  const handleSubTodoAdd = (title: string) => {
    if (!selectedTodo) return
    const newSubTodo = { id: Date.now(), title }
    const updated = {
      ...selectedTodo,
      subTodos: [...selectedTodo.subTodos, newSubTodo],
    }
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    setSelectedTodo(updated)
  }

  const handleTagAdd = (tag: CustomTag) => {
    setAllTags((prev) => [...prev, tag])
  }

  const handleSubmit = async () => {
    if (selectedIds.length === 0 || loading) return
    setLoading(true)
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const selectedTodos = todos.filter((t) => selectedIds.includes(t.id))
      const isRecurring = (t: ProposedTodo) => t.repeat !== '없음'

      const res = await createGoalWithTodos(accessToken, {
        title: goalValue,
        dueDate: deadlineDate ? format(deadlineDate, 'yyyy-MM-dd') : null,
        dueTime: deadlineTime ? timeToHHmm(deadlineTime) : null,
        todos: selectedTodos.map((t) => ({
          type: isRecurring(t) ? 'RECURRING' : 'ONE_TIME',
          title: t.title,
          dueDate:
            !isRecurring(t) && t.deadlineDate
              ? format(t.deadlineDate, 'yyyy-MM-dd')
              : null,
          dueTime: !isRecurring(t) ? timeToHHmm(t.deadlineTime) : null,
          routineType: isRecurring(t) ? REPEAT_TO_ROUTINE[t.repeat] : null,
          routineDate: isRecurring(t) ? (t.routineDate ?? null) : null,
          tagId: null,
          subTodos: !isRecurring(t) ? t.subTodos.map((s) => s.title) : [],
        })),
      })
      if (res.success) {
        moveNext()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col max-h-full overflow-scroll">
      <div className="flex flex-col gap-3">
        <Title>
          <div>목표에 맞는</div>
          <div>투두리스트를 제안드릴게요.</div>
        </Title>
        <Description>
          <div>마음에 드는 리스트를 골라주세요.</div>
          <div>마음에 들지 않는다면 수정할 수 있어요!</div>
        </Description>
      </div>

      <ListItem className="mt-6 mb-8 border-none">{goalValue}</ListItem>

      <div>
        <div className="flex items-center gap-2 w-full">
          <MenuIcon />
          <div className="font-bold text-[16px] text-bluegray-black">
            추천 투두
          </div>
          <button className="ml-auto flex items-center justify-center rounded-full p-1 bg-bluegray-light-hover">
            <RestLeftFillIcon />
          </button>
        </div>

        {todos.map((todo, index) => (
          <div
            className="flex gap-4.25 items-center max-w-full overflow-hidden"
            key={index}
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
                <TodoCard.Category
                  category={
                    (todo.selectedTagId as Parameters<
                      typeof TodoCard.Category
                    >[0]['category']) ?? '미선택'
                  }
                />
              </TodoCard>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed left-0 bottom-10 w-full flex gap-2 px-5">
        <MainButton
          option={selectedIds.length === 0 || loading ? 'disabled' : 'primary'}
          onClick={handleSubmit}
          title={loading ? '저장 중...' : '선택한 투두 추가하기'}
        />
      </div>

      {selectedTodo && (
        <>
          <TodoInfoSheet
            isOpen={infoOpen}
            onClose={() => setInfoOpen(false)}
            onEdit={handleEditOpen}
            todo={toTodoDetail(selectedTodo)}
            allTags={allTags}
            onSubTodoAdd={handleSubTodoAdd}
          />
          <TodoEditSheet
            isOpen={editOpen}
            onClose={() => {
              setEditOpen(false)
              setInfoOpen(true)
            }}
            onConfirm={handleEditConfirm}
            todo={selectedTodo}
            allTags={allTags}
            onTagAdd={handleTagAdd}
          />
        </>
      )}
    </div>
  )
}
