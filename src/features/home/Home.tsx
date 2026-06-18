// utils
import { useState } from 'react'
import { cn } from '@/shared/utils/cn'
import { AnimatePresence } from 'framer-motion'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// type
import type { TodoDetail } from '@/shared/types/todo'
import type { CustomTag, ProposedTodo } from '@/features/onBoarding/type/types'
import { PRESET_TAGS, ROUTINE_TO_REPEAT } from '@/features/onBoarding/type/types'

// hooks
import { useCalendar } from './hooks/useCalendar'
import { useBottomSheets } from './hooks/useBottomSheets'
import { useTodos } from './hooks/useTodos'

const symbolSvg = '/assets/symbol.svg'
const addSvg = '/assets/add.svg'
const completeSvg = '/assets/completeIcon.svg'
const dragBar = '/assets/dragBar.svg'

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
import ChevronLeftIcon from '@/icons/ChevronLeftIcon'
import Toast from '@/features/home/components/Toast'

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]

const WEEKDAY_NUM_TO_NAME: Record<number, string> = {
  1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토', 7: '일',
}

function formatTime(dueDate: string | null): string | undefined {
  if (!dueDate) return undefined
  const date = new Date(dueDate)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function getDayTag(routineType: string | null): 'D' | 'W' | 'M' | undefined {
  if (routineType === 'DAILY') return 'D'
  if (routineType === 'WEEKLY') return 'W'
  if (routineType === 'MONTHLY') return 'M'
  return undefined
}

function todoDetailToProposed(todo: TodoDetail): ProposedTodo {
  const deadlineDate = todo.dueDate ? new Date(todo.dueDate) : null
  const deadlineTime = formatTime(todo.dueDate) ?? null
  return {
    id: todo.todoId,
    title: todo.title,
    time: deadlineTime ?? '',
    dayTag: 'D',
    selectedTagId: todo.tagTitle ?? '미선택',
    repeat: todo.routineType ? (ROUTINE_TO_REPEAT[todo.routineType] ?? '없음') : '없음',
    weeklyDay: todo.routineDate ? WEEKDAY_NUM_TO_NAME[todo.routineDate] : undefined,
    monthlyDay: todo.routineDate ?? undefined,
    deadlineDate,
    deadlineTime,
    subTodos: todo.subTodos.map((s) => ({ id: s.todoId, title: s.title })),
  }
}

function SortableItem({ id, children }: { id: number; children: (dragListeners: Record<string, unknown> | undefined) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
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
    >
      {children(listeners)}
    </div>
  )
}


export default function Home() {
  const [showEdit, setShowEdit] = useState(false)
  const [priorityEdit, setPriorityEdit] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'all' | 'day' | 'week' | 'month'>('all')
  const [sort, setSort] = useState<'priority' | 'dueDate' | 'latest'>('priority')
  const [allTags] = useState<CustomTag[]>(PRESET_TAGS)

  const calendar = useCalendar()
  const sheets = useBottomSheets()
  const todoHook = useTodos({
    selectedTab,
    sort,
    selectedDate: calendar.selectedDate,
    selectedYear: calendar.selectedYear,
    selectedMonth: calendar.selectedMonth,
  })

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

  const handlePriorityEdit = () => {
    setPriorityEdit(!priorityEdit)
  }

  const handleSelect = (value: string) => {
    setSelectedTab(value as 'all' | 'day' | 'week' | 'month')
    calendar.setSelectedDate(null)
  }

  const handleClickTodo = async (todoId: number) => {
    await todoHook.fetchTodo(todoId)
    sheets.setIsTodoInfoSheetOpen(true)
  }

  const handleCreateTodo = async (proposed: ProposedTodo) => {
    try {
      await todoHook.handleCreateTodo(proposed)
    } finally {
      sheets.setIsNewTodoSheetOpen(false)
    }
  }

  const handleUpdateTodo = async (updated: ProposedTodo) => {
    await todoHook.handleUpdateTodo(updated)
    sheets.setIsEditTodoSheetOpen(false)
    sheets.setIsTodoInfoSheetOpen(false)
  }

  const handleDeleteClick = (todoId: number) => {
    todoHook.setDeletingTodoId(todoId)
    sheets.setIsDeleteBottomSheetOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (todoHook.deletingTodoId === null) return
    await todoHook.deleteById(todoHook.deletingTodoId)
    todoHook.setDeletingTodoId(null)
    sheets.setIsDeleteBottomSheetOpen(false)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  return (
    <div className="relative h-dvh flex flex-col px-5">
      <div className="flex gap-1">
        <p className="font-bold">{`${calendar.selectedYear}년 ${calendar.selectedMonth}월`}</p>
        <ChevronDownStrokeIcon onClick={() => sheets.setIsMonthBottomSheetOpen(true)} />
      </div>

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

      <div className="flex-1 overflow-y-auto">
        <div>
          <DatePicker
            onClose={() => {}}
            onConfirm={(date) => calendar.setSelectedDate(date)}
            onDeselect={() => calendar.setSelectedDate(null)}
            showHeader={false}
            weeks={
              selectedTab === 'day' ? 1 :
              selectedTab === 'week' ? 2 :
              undefined
            }
            selectedColor="#EEF5FD"
            selectedTextColor='none'
            dueDates={todoHook.calendarDueDates}
          />
        </div>

        {todoHook.filteredTodos.length === 0 ? (
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
            {todoHook.pinnedTodos.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mt-8">
                  <img src={symbolSvg} alt="" />
                  <p className="font-bold text-[14px] text-bluegray-darker">주요 투두</p>
                </div>
                {todoHook.pinnedTodos.map((todo) => (
                  <TodoCard
                    key={todo.todoId}
                    status="swipeable"
                    onDelete={() => handleDeleteClick(todo.todoId)}
                    pinned={todo.isPinned}
                    onPin={(isPinned) => todoHook.handleTogglePin(todo.todoId, isPinned)}
                  >
                    <TodoCard.Icon
                      onClick={() => todoHook.handleToggleComplete(todo.todoId, todo.isCompleted)}
                      checked={todo.isCompleted}
                    />
                    <TodoCard.Content>
                      <TodoCard.Title
                        dayTag={getDayTag(todo.routineType)}
                        onClick={() => handleClickTodo(todo.todoId)}
                      >
                        {todo.title}
                      </TodoCard.Title>
                      {todo.dueDate && (
                        <TodoCard.Time>{formatTime(todo.dueDate)}</TodoCard.Time>
                      )}
                    </TodoCard.Content>
                    <TodoCard.Category
                      category={todo.tagTitle ?? ''}
                      usePin
                      pinned={todo.isPinned}
                      setPinned={(isPinned) => todoHook.handleTogglePin(todo.todoId, isPinned)}
                    />
                  </TodoCard>
                ))}
              </div>
            )}

            <div className="bg-bluegray-light-hover w-full h-px my-8"></div>

            <div className="flex flex-col gap-3">
              <div className='flex justify-between'>
                <Dropdown
                  items={['마감기한순', '최신등록순', '직접설정순']}
                  onChange={(item) => {
                    if (item === '마감기한순') {
                      setSort('dueDate');
                      setShowEdit(false);
                    }
                    else if (item === '최신등록순') {
                      setSort('latest');
                      setShowEdit(false);
                    }
                    else {
                      setSort('priority'); 
                      setShowEdit(true);
                    }
                  }}
                />
                {showEdit && (
                  <p 
                  onClick={()=> handlePriorityEdit()}
                  className='text-[12px] text-center text-bluegray-normal-active py-[6.5px] w-12 h-8 border border-bluegray-light-hover rounded-[20px] cursor-pointer'>
                    {priorityEdit ? '완료' : '편집'}
                </p>
                )}
              </div>
              <div className="h-dvh overflow-y-auto">
                {sort === 'priority' ? (
                  <DndContext sensors={sensors} onDragEnd={todoHook.handleDragEnd}>
                    <SortableContext
                      items={todoHook.regularActiveTodos.map((t) => t.todoId)}
                      strategy={verticalListSortingStrategy}
                    >
                      {todoHook.regularActiveTodos.map((todo) => (
                        <SortableItem key={todo.todoId} id={todo.todoId}>
                          {(dragListeners) => (
                            <div className='flex w-full items-center gap-3'>
                              <div className="flex-1 min-w-0">
                                <TodoCard
                                  status="swipeable"
                                  onDelete={() => handleDeleteClick(todo.todoId)}
                                  onClick={() => handleClickTodo(todo.todoId)}
                                  pinned={todo.isPinned}
                                  onPin={(isPinned) => todoHook.handleTogglePin(todo.todoId, isPinned)}
                                >
                                  <TodoCard.Icon
                                    onClick={() => todoHook.handleToggleComplete(todo.todoId, todo.isCompleted)}
                                    checked={todo.isCompleted}
                                  />
                                  <TodoCard.Content>
                                    <TodoCard.Title dayTag={getDayTag(todo.routineType)}>
                                      {todo.title}
                                    </TodoCard.Title>
                                    {todo.dueDate && (
                                      <TodoCard.Time>{formatTime(todo.dueDate)}</TodoCard.Time>
                                    )}
                                  </TodoCard.Content>
                                  <TodoCard.Category
                                    category={todo.tagTitle ?? ''}
                                    usePin
                                    pinned={todo.isPinned}
                                    setPinned={(isPinned) => todoHook.handleTogglePin(todo.todoId, isPinned)}
                                  />
                                </TodoCard>
                              </div>
                              {priorityEdit && (
                                <img src={dragBar} alt="" {...dragListeners} className="cursor-grab touch-none shrink-0" />
                              )}
                            </div>
                          )}
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  todoHook.regularActiveTodos.map((todo) => (
                    <TodoCard
                      key={todo.todoId}
                      status="swipeable"
                      onDelete={() => handleDeleteClick(todo.todoId)}
                      onClick={() => handleClickTodo(todo.todoId)}
                      pinned={todo.isPinned}
                      onPin={(isPinned) => todoHook.handleTogglePin(todo.todoId, isPinned)}
                    >
                      <TodoCard.Icon
                        onClick={() => todoHook.handleToggleComplete(todo.todoId, todo.isCompleted)}
                        checked={todo.isCompleted}
                      />
                      <TodoCard.Content>
                        <TodoCard.Title dayTag={getDayTag(todo.routineType)}>
                          {todo.title}
                        </TodoCard.Title>
                        {todo.dueDate && (
                          <TodoCard.Time>{formatTime(todo.dueDate)}</TodoCard.Time>
                        )}
                      </TodoCard.Content>
                      <TodoCard.Category
                        category={todo.tagTitle ?? ''}
                        usePin
                        pinned={todo.isPinned}
                        setPinned={(isPinned) => todoHook.handleTogglePin(todo.todoId, isPinned)}
                      />
                    </TodoCard>
                  ))
                )}

                <>
                  <div 
                  onClick={() => todoHook.setIsCompletedOpen((prev) => !prev)}
                  className="flex items-center mt-8 mb-2 justify-between">
                    <div className='flex items-center gap-1'>
                      <img src={completeSvg} alt="" />
                      <p className="font-bold text-[14px] text-bluegray-darker">완료 투두</p>
                    </div>
                    <ChevronLeftIcon
                      className={cn(
                        'w-5 h-5 transition-transform duration-300 cursor-pointer',
                        todoHook.isCompletedOpen ? 'rotate-[180deg]' : 'rotate-90',
                      )}
                      
                    />
                  </div>
                  {todoHook.isCompletedOpen && todoHook.completedTodos.map((todo) => (
                    <TodoCard
                      key={todo.todoId}
                      status="grey"
                      onDelete={() => handleDeleteClick(todo.todoId)}
                      onClick={() => handleClickTodo(todo.todoId)}
                      pinned={todo.isPinned}
                      onPin={(isPinned) => todoHook.handleTogglePin(todo.todoId, isPinned)}
                    >
                      <TodoCard.Icon
                        onClick={() => todoHook.handleToggleComplete(todo.todoId, todo.isCompleted)}
                        checked={todo.isCompleted}
                      />
                      <TodoCard.Content>
                        <TodoCard.Title dayTag={getDayTag(todo.routineType)}>
                          {todo.title}
                        </TodoCard.Title>
                        {todo.dueDate && (
                          <TodoCard.Time>{formatTime(todo.dueDate)}</TodoCard.Time>
                        )}
                      </TodoCard.Content>
                      <TodoCard.Category
                        category={todo.tagTitle ?? ''}
                        usePin
                        pinned={todo.isPinned}
                        setPinned={(isPinned) => todoHook.handleTogglePin(todo.todoId, isPinned)}
                      />
                    </TodoCard>
                  ))}
                </>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => sheets.setIsNewTodoSheetOpen(true)}
        className="z-10 fixed bottom-33 right-5 bg-blue-normal w-11 h-11 rounded-full flex justify-center items-center"
      >
        <img src={addSvg} alt="" />
      </button>

      <TodoEditSheet
        isOpen={sheets.isNewTodoSheetOpen}
        onClose={() => sheets.setIsNewTodoSheetOpen(false)}
        onConfirm={handleCreateTodo}
        todo={emptyTodo}
        allTags={allTags}
        onTagAdd={() => {}}
        title="투두 추가"
      />

      {todoHook.selectedTodo && (
        <>
          <TodoInfoSheet
            isOpen={sheets.isTodoInfoSheetOpen}
            onClose={() => sheets.setIsTodoInfoSheetOpen(false)}
            onEdit={() => {
              sheets.setIsTodoInfoSheetOpen(false)
              sheets.setIsEditTodoSheetOpen(true)
            }}
            todo={todoHook.selectedTodo}
            allTags={allTags}
            onSubTodoAdd={() => {}}
            onClick={() => {
              todoHook.deleteById(todoHook.selectedTodo!.todoId)
              sheets.setIsTodoInfoSheetOpen(false)
            }}
          />
          <TodoEditSheet
            isOpen={sheets.isEditTodoSheetOpen}
            onClose={() => {
              sheets.setIsEditTodoSheetOpen(false)
              sheets.setIsTodoInfoSheetOpen(true)
            }}
            onConfirm={handleUpdateTodo}
            todo={todoDetailToProposed(todoHook.selectedTodo)}
            allTags={allTags}
            onTagAdd={() => {}}
            title="투두 수정"
          />
        </>
      )}

      <BottomSheet
        isOpen={sheets.isDeleteBottomSheetOpen}
        onClose={() => sheets.setIsDeleteBottomSheetOpen(false)}
      >
        <div className="pt-4 pb-9 px-5 flex flex-col items-center w-full">
          <h3 className="text-xl font-semibold">투두를 삭제하시겠습니까?</h3>
          <div className="flex gap-3 mt-5 w-full">
            <button
              onClick={() => sheets.setIsDeleteBottomSheetOpen(false)}
              className="flex-1 py-3 rounded-xl bg-bluegray-light text-black font-semibold"
            >
              취소
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 py-3 rounded-xl bg-bluegray-light text-danger font-semibold"
            >
              삭제
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={sheets.isMonthBottomSheetOpen}
        onClose={() => sheets.setIsMonthBottomSheetOpen(false)}
      >
        <MonthPeaker
          value={calendar.selectedMonth}
          year={calendar.selectedYear}
          onClose={() => sheets.setIsMonthBottomSheetOpen(false)}
          onConfirm={(year, month) => {
            calendar.setSelectedYear(year)
            calendar.setSelectedMonth(month)
            sheets.setIsMonthBottomSheetOpen(false)
          }}
        />
      </BottomSheet>

      <AnimatePresence>
        {todoHook.showToast && (
          <Toast type='success' onClose={() => todoHook.setShowToast(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
