// utils
import { useState, useEffect } from 'react'
import { cn } from '@/shared/utils/cn'
import {
  getTodos,
  getTodoDetail,
  deleteTodo,
  toggleTodoComplete,
  updateTodoOrder,
  createTodo,
} from '@/shared/api/todo'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// type
import type { Todo, TodoDetail } from '@/shared/types/todo'
import type { CustomTag } from '@/features/onBoarding/type/types'
import { PRESET_TAGS } from '@/features/onBoarding/type/types'

const symbolSvg = '/assets/symbol.svg'
const addSvg = '/assets/add.svg'

// components
import ChevronDownStrokeIcon from '@/icons/ChevronDownStrokeIcon'
import DatePicker from '../onBoarding/components/DatePicker'
import Dropdown from '@/shared/components/Dropdown'
import TodoCard from '@/shared/components/TodoCard'
import BottomSheet from '@/shared/components/BottomSheet'
import MonthPeaker from '../goal/components/MonthPeaker'
import DefaultProfileIcon from '@/icons/DefaultProfileIcon'
import TodoInfoSheet from '../onBoarding/components/TodoInfoSheet'
import TodoEditSheet from '../onBoarding/components/TodoEditSheet'
import type { ProposedTodo } from '@/features/onBoarding/type/types'

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]

function formatTime(dueDate: string | null): string | undefined {
  if (!dueDate) return undefined
  const date = new Date(dueDate)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function getDayTag(routineType: string | null): 'D' | 'M' | undefined {
  if (routineType === 'DAILY') return 'D'
  if (routineType === 'MONTHLY') return 'M'
  return undefined
}

function SortableItem({
  id,
  children,
}: {
  id: number
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<
    'all' | 'day' | 'week' | 'month'
  >('all')
  const [sort, setSort] = useState<'priority' | 'dueDate' | 'latest'>(
    'priority',
  )
  const [todos, setTodos] = useState<Todo[]>([])
  const [selectedTodo, setSelectedTodo] = useState<TodoDetail | null>(null)
  const [allTags] = useState<CustomTag[]>(PRESET_TAGS)

  const [selectedYear, setSelectedYear] = useState<number>(2026)
  const [selectedMonth, setSelectedMonth] = useState<number>(5)
  const [isTodoAddBottomSheetOpen, setIsTodoAddBottomSheet] = useState(false)
  const [isMonthBottomSheetOpen, setIsMonthBottomSheetOpen] = useState(false)
  const [isDeleteBottomSheetOpen, setIsDeleteBottomSheetOpen] = useState(false)
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null)
  const [isNewTodoSheetOpen, setIsNewTodoSheetOpen] = useState(false)

  const emptyTodo: ProposedTodo = {
    id: 0,
    title: '',
    time: '',
    dayTag: 'D',
    selectedTagId: PRESET_TAGS[0]?.id ?? '',
    repeat: '없음',
    deadlineDate: null,
    deadlineTime: null,
    subTodos: [],
  }

  // 투두 선택
  const handleClickTodo = async (todoId: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const res = await getTodoDetail(accessToken, todoId)
      if (res.success && res.data) {
        setSelectedTodo(res.data)
        setIsTodoAddBottomSheet(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 탭 선택
  const handleSelect = (value: string) => {
    setSelectedTab(value as 'all' | 'day' | 'week' | 'month')
  }

  // 투두 삭제 (공통)
  const deleteTodoById = async (todoId: number) => {
    setTodos((prev) => prev.filter((t) => t.todoId !== todoId))
    setIsTodoAddBottomSheet(false)
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await deleteTodo(accessToken, todoId)
    } catch (error) {
      console.error(error)
    }
  }

  // 투두 생성
  const handleCreateTodo = async (proposed: ProposedTodo) => {
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''

      let dueDate: string | null = null
      if (proposed.deadlineDate) {
        const date = new Date(proposed.deadlineDate)
        if (proposed.deadlineTime) {
          const [timePart, meridiem] = proposed.deadlineTime.split(' ')
          const [h, m] = timePart.split(':').map(Number)
          const hours24 =
            meridiem === 'PM' && h !== 12
              ? h + 12
              : meridiem === 'AM' && h === 12
                ? 0
                : h
          date.setHours(hours24, m, 0, 0)
        }
        dueDate = date.toISOString()
      }

      const res = await createTodo(accessToken, {
        title: proposed.title,
        dueDate,
        tagId: null,
        goalId: null,
      })

      if (res.success && res.data) {
        const accessToken2 = localStorage.getItem('accessToken') ?? ''
        const apiSort = sort === 'latest' ? 'priority' : sort
        const listRes = await getTodos(accessToken2, selectedTab, apiSort)
        if (listRes.success) setTodos(listRes.data ?? [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsNewTodoSheetOpen(false)
    }
  }

  // TodoCard 스와이프 삭제 → 확인 바텀시트 오픈
  const handleDeleteClick = (todoId: number) => {
    setDeletingTodoId(todoId)
    setIsDeleteBottomSheetOpen(true)
  }

  // 바텀시트 "삭제" 버튼 → 실제 삭제 실행
  const handleConfirmDelete = async () => {
    if (deletingTodoId === null) return
    await deleteTodoById(deletingTodoId)
    setIsDeleteBottomSheetOpen(false)
    setDeletingTodoId(null)
  }

  // 투두 완료 및 미완료
  const handleToggleComplete = async (todoId: number, isCompleted: boolean) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.todoId === todoId ? { ...t, isCompleted: !isCompleted } : t,
      ),
    )
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await toggleTodoComplete(accessToken, todoId, !isCompleted)
    } catch (error) {
      setTodos((prev) =>
        prev.map((t) => (t.todoId === todoId ? { ...t, isCompleted } : t)),
      )
      console.error(error)
    }
  }

  // 투두 목록 조회
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken') ?? ''
        const apiSort = sort === 'latest' ? 'priority' : sort
        const res = await getTodos(accessToken, selectedTab, apiSort)
        if (res.success) setTodos(res.data ?? [])
      } catch (error) {
        console.error(error)
      }
    }
    fetchTodos()
  }, [selectedTab, sort])

  // 투두 필터링 및 정렬
  const filteredTodos = todos.filter((t) => {
    if (!t.dueDate) return true
    const date = new Date(t.dueDate)
    return (
      date.getFullYear() === selectedYear &&
      date.getMonth() + 1 === selectedMonth
    )
  })

  const sortedTodos =
    sort === 'latest'
      ? [...filteredTodos].sort((a, b) => b.todoId - a.todoId)
      : filteredTodos

  const pinnedTodos = sortedTodos.filter((t) => t.isPinned)
  const regularTodos = sortedTodos.filter((t) => !t.isPinned)

  // 직접설정순(드래그앤드롭)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = todos.findIndex((t) => t.todoId === active.id)
    const newIndex = todos.findIndex((t) => t.todoId === over.id)
    const newTodos = arrayMove(todos, oldIndex, newIndex)
    setTodos(newTodos)

    const newRegularTodos = newTodos.filter((t) => !t.isPinned)
    const movedIndex = newRegularTodos.findIndex((t) => t.todoId === active.id)
    const prevTodoId =
      movedIndex > 0 ? newRegularTodos[movedIndex - 1].todoId : null
    const nextTodoId =
      movedIndex < newRegularTodos.length - 1
        ? newRegularTodos[movedIndex + 1].todoId
        : null

    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await updateTodoOrder(
        accessToken,
        active.id as number,
        prevTodoId,
        nextTodoId,
      )
    } catch (error) {
      console.error(error)
      setTodos(todos)
    }
  }

  return (
    <div className="relative h-dvh flex flex-col px-5">
      <div className="flex gap-1">
        <p className="font-bold">{`${selectedYear}년 ${selectedMonth}월`}</p>
        <ChevronDownStrokeIcon
          onClick={() => setIsMonthBottomSheetOpen(true)}
        />
      </div>

      {/* 전체, 일, 월, 연도별 토글 */}
      <div className="flex mt-5 mb-5 gap-1">
        {TABS.map((tab) => (
          <p
            key={tab.value}
            onClick={() => handleSelect(tab.value)}
            className={cn(
              'px-3.5 py-2 rounded-[19px] text-[12px] cursor-pointer',
              selectedTab === tab.value
                ? 'bg-bluegray-black text-white'
                : 'bg-bluegray-light text-bluegray-dark',
            )}
          >
            {tab.label}
          </p>
        ))}
      </div>

      {/* 캘린더 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div>
          <DatePicker
            onClose={() => {}}
            onConfirm={() => {}}
            showHeader={false}
          />
        </div>

        {filteredTodos.length === 0 ? (
          <div className="flex flex-col w-full justify-center items-center mt-16">
            <DefaultProfileIcon width={72} height={72} />
            <h3 className="font-bold mt-6 mb-2">오늘 할 일이 없어요</h3>
            <p className="text-xs text-center text-bluegray-normal">
              투두를 추가하고 <br />
              하루를 계획해보세요
            </p>
          </div>
        ) : (
          <>
            {/* 주요 투두 */}
            {pinnedTodos.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mt-8">
                  <img src={symbolSvg} alt="" />
                  <p className="font-bold text-[14px] text-bluegray-darker">
                    주요 투두
                  </p>
                </div>
                {pinnedTodos.map((todo) => (
                  <TodoCard
                    key={todo.todoId}
                    status="swipeable"
                    onDelete={() => handleDeleteClick(todo.todoId)}
                  >
                    <TodoCard.Icon />
                    <TodoCard.Content>
                      <TodoCard.Title
                        dayTag={getDayTag(todo.routineType)}
                        onClick={() => handleClickTodo(todo.todoId)}
                      >
                        {todo.title}
                      </TodoCard.Title>
                      {todo.dueDate && (
                        <TodoCard.Time>
                          {formatTime(todo.dueDate)}
                        </TodoCard.Time>
                      )}
                    </TodoCard.Content>
                    <TodoCard.Category
                      category={todo.tagTitle ?? '미선택'}
                      usePin
                      pinned={todo.isPinned}
                      setPinned={() => {}}
                    />
                  </TodoCard>
                ))}
              </div>
            )}

            <div className="bg-bluegray-light-hover w-full h-px my-8"></div>

            {/* 정렬된 투두 */}
            <div className="flex flex-col gap-3">
              <Dropdown
                items={['마감기한순', '최신등록순', '직접설정순']}
                onChange={(item) => {
                  if (item === '마감기한순') setSort('dueDate')
                  else if (item === '최신등록순') setSort('latest')
                  else setSort('priority')
                }}
              />
              <div className="h-dvh overflow-y-auto">
                {sort === 'priority' ? (
                  <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <SortableContext
                      items={regularTodos.map((t) => t.todoId)}
                      strategy={verticalListSortingStrategy}
                    >
                      {regularTodos.map((todo) => (
                        <SortableItem key={todo.todoId} id={todo.todoId}>
                          <TodoCard
                            status={
                              todo.isCompleted ? 'grey' : 'swipeable-delete'
                            }
                            onDelete={() => handleDeleteClick(todo.todoId)}
                            onClick={() => handleClickTodo(todo.todoId)}
                          >
                            <TodoCard.Icon
                              onClick={() =>
                                handleToggleComplete(
                                  todo.todoId,
                                  todo.isCompleted,
                                )
                              }
                              checked={todo.isCompleted}
                            />
                            <TodoCard.Content>
                              <TodoCard.Title
                                dayTag={getDayTag(todo.routineType)}
                              >
                                {todo.title}
                              </TodoCard.Title>
                              {todo.dueDate && (
                                <TodoCard.Time>
                                  {formatTime(todo.dueDate)}
                                </TodoCard.Time>
                              )}
                            </TodoCard.Content>
                            <TodoCard.Category
                              category={todo.tagTitle ?? '미선택'}
                              usePin
                              pinned={todo.isPinned}
                              setPinned={() => {}}
                            />
                          </TodoCard>
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  regularTodos.map((todo) => (
                    <TodoCard
                      key={todo.todoId}
                      status={todo.isCompleted ? 'grey' : 'swipeable-delete'}
                      onDelete={() => handleDeleteClick(todo.todoId)}
                      onClick={() => handleClickTodo(todo.todoId)}
                    >
                      <TodoCard.Icon
                        onClick={() =>
                          handleToggleComplete(todo.todoId, todo.isCompleted)
                        }
                        checked={todo.isCompleted}
                      />
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
                      <TodoCard.Category
                        category={todo.tagTitle ?? '미선택'}
                        usePin
                        pinned={todo.isPinned}
                        setPinned={() => {}}
                      />
                    </TodoCard>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 투두 추가 버튼 */}
      <button
        onClick={() => setIsNewTodoSheetOpen(true)}
        className="fixed bottom-33 right-5 bg-blue-normal w-11 h-11 rounded-full flex justify-center items-center"
      >
        <img src={addSvg} alt="" />
      </button>

      <TodoEditSheet
        isOpen={isNewTodoSheetOpen}
        onClose={() => setIsNewTodoSheetOpen(false)}
        onConfirm={handleCreateTodo}
        todo={emptyTodo}
        allTags={allTags}
        onTagAdd={() => {}}
        title="투두 추가"
      />

      {selectedTodo && (
        <TodoInfoSheet
          isOpen={isTodoAddBottomSheetOpen}
          onClose={() => setIsTodoAddBottomSheet(false)}
          onEdit={() => {}}
          todo={selectedTodo}
          allTags={allTags}
          onSubTodoAdd={() => {}}
          onClick={() => deleteTodoById(selectedTodo.todoId)}
        />
      )}

      <BottomSheet
        isOpen={isDeleteBottomSheetOpen}
        onClose={() => setIsDeleteBottomSheetOpen(false)}
      >
        <div className="pt-4 pb-9 px-5 flex flex-col items-center w-full">
          <h3 className="text-xl font-semibold">투두를 삭제하시겠습니까?</h3>
          <div className="flex gap-3 mt-5 w-full">
            {/* 버튼 컴포넌트로 나중에 교체 */}
            <button
              onClick={() => setIsDeleteBottomSheetOpen(false)}
              className="flex-1 py-3 rounded-xl bg-bluegray-light text-black font-semibold"
            >
              취소
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 py-3 rounded-xl bg-bluegray-light  text-danger font-semibold"
            >
              삭제
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={isMonthBottomSheetOpen}
        onClose={() => setIsMonthBottomSheetOpen(false)}
      >
        <MonthPeaker
          value={selectedMonth}
          year={selectedYear}
          onClose={() => setIsMonthBottomSheetOpen(false)}
          onConfirm={(year, month) => {
            setSelectedYear(year)
            setSelectedMonth(month)
            setIsMonthBottomSheetOpen(false)
          }}
        />
      </BottomSheet>
    </div>
  )
}
