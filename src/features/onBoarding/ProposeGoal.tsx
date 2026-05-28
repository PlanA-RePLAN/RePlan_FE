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
import { useState } from 'react'
import { cn } from '@/shared/utils/cn'
import { type ProposedTodo, type CustomTag, PRESET_TAGS } from './type/types'

interface ProposeGoalProps {
  moveNext: () => void
}

const INITIAL_TODOS: ProposedTodo[] = [
  {
    id: 1,
    title: '11시 이전 취침',
    time: '11:00 AM',
    dayTag: 'D',
    selectedTagId: 'Study',
    repeat: '데일리',
    deadlineDate: new Date('2026-05-01'),
    deadlineTime: '8:00 PM',
    subTodos: [{ id: 1, title: '영단어 10개 암기' }],
  },
  {
    id: 2,
    title: '모의고사 풀이',
    time: '11:00 AM',
    dayTag: 'M',
    selectedTagId: 'Study',
    repeat: '위클리',
    deadlineDate: new Date('2026-05-01'),
    deadlineTime: '8:00 AM',
    subTodos: [],
  },
  {
    id: 3,
    title: '토익 모의고사 1회 풀기',
    time: '1:00 PM',
    dayTag: 'D',
    selectedTagId: 'Study',
    repeat: '데일리',
    deadlineDate: new Date('2026-05-01'),
    deadlineTime: '1:00 PM',
    subTodos: [],
  },
  {
    id: 4,
    title: '토익 모의고사 1회 풀기',
    time: '1:00 PM',
    dayTag: 'D',
    selectedTagId: 'Study',
    repeat: '데일리',
    deadlineDate: null,
    deadlineTime: null,
    subTodos: [],
  },
]

export default function ProposeGoal({ moveNext }: ProposeGoalProps) {
  const [todos, setTodos] = useState<ProposedTodo[]>(INITIAL_TODOS)
  const [allTags, setAllTags] = useState<CustomTag[]>(PRESET_TAGS)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [selectedTodo, setSelectedTodo] = useState<ProposedTodo | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

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

  return (
    <div className="flex flex-col">
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

      <ListItem className="mt-6 mb-8 border-none">
        토익 850점 달성, 5월 1일까지, ETS 토익 단기공략 850+ 교재 사용
      </ListItem>

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
          <div className="flex gap-4.25 items-center" key={index}>
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
          option={selectedIds.length === 0 ? 'disabled' : 'primary'}
          onClick={moveNext}
          title="선택한 투두 추가하기"
        />
      </div>

      {selectedTodo && (
        <>
          <TodoInfoSheet
            isOpen={infoOpen}
            onClose={() => setInfoOpen(false)}
            onEdit={handleEditOpen}
            todo={selectedTodo}
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
