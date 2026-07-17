// utils
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import { AnimatePresence } from 'framer-motion'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { startOfWeek, addDays } from 'date-fns'

// type
import type { TodoDetail } from '@/shared/types/todo'
import type { Item, ItemDetail, RoutineItemScope } from '@/shared/types/item'
import { itemKey } from '@/shared/types/item'
import type { CustomTag, ProposedTodo } from '@/features/onBoarding/type/types'
import {
  ROUTINE_TO_REPEAT,
  fetchAllTags,
} from '@/features/onBoarding/type/types'

// hooks
import { useCalendar } from './hooks/useCalendar'
import { useBottomSheets } from './hooks/useBottomSheets'
import { useItems } from './hooks/useItems'

//assests
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

const WEEKDAY_INDEX_TO_NAME: Record<number, string> = {
  0: '월',
  1: '화',
  2: '수',
  3: '목',
  4: '금',
  5: '토',
  6: '일',
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

// 카드 표시용: 마감일자 + 마감시간. 루틴이면 이 회차(그날)의 마감이다.
function formatDateTime(dueDate: string): string {
  return `${dueDate.slice(0, 10)}, ${formatTime(dueDate)}`
}

// ISO 일시 → 'HH:mm' (상세시트 dueTime/repeatTime 형식)
function toHHmm(dt: string | null): string | null {
  if (!dt) return null
  const d = new Date(dt)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function getDayTag(routineType: string | null): 'D' | 'W' | 'M' | undefined {
  if (routineType === 'DAILY') return 'D'
  if (routineType === 'WEEKLY') return 'W'
  if (routineType === 'MONTHLY') return 'M'
  return undefined
}

// 정보 시트 "반복 시간" 행: 그날만 시간이 바뀐 회차면 그날의 마감시간을(라벨도 교체), 아니면 루틴 기본 반복시간을 보여준다.
function repeatTimeRow(detail: ItemDetail): {
  label: string
  time: string | null
} {
  // 반복시간 미설정(null) 루틴은 반복 시간 행을 아예 숨긴다 (time null)
  const momTime = detail.routineTime?.slice(0, 5) ?? null
  const effTime = detail.dueDate?.slice(11, 16) ?? null
  const changedThisDay =
    detail.kind === 'ROUTINE' &&
    effTime != null &&
    effTime !== (momTime ?? '23:59')
  return changedThisDay
    ? { label: '이 날의 종료 시간', time: effTime }
    : { label: '반복 시간', time: momTime }
}

// 상세 응답 단독으로 시트 데이터를 만든다 (v0.29.0부터 루틴 상세도 반복정보/마감일시 완결).
// 루틴이면 마감 일정 = 루틴 종료일(repeatEndDate), 투두면 = 마감일.
function itemDetailToTodoDetail(detail: ItemDetail): TodoDetail {
  const dueSource =
    detail.kind === 'ROUTINE' ? detail.repeatEndDate : detail.dueDate
  return {
    todoId: detail.todoId ?? 0,
    title: detail.title,
    dueDate: dueSource,
    dueTime: toHHmm(dueSource),
    isCompleted: detail.isCompleted,
    tagId: detail.tagId,
    tagTitle: detail.tagTitle,
    tagColor: detail.tagColor,
    routineType: detail.routineType,
    routineDays: detail.routineDays,
    subTodos: detail.subItems.map((s) => ({
      todoId: s.todoId,
      title: s.title,
      isCompleted: s.isCompleted,
      reservedIndex: s.reservedIndex,
      subRoutineId: s.subRoutineId,
    })),
  }
}

// 'HH:mm:ss' → 'h:mm AM/PM' (TimePicker 표시 형식)
function formatTimeHMS(t: string | null): string | undefined {
  if (!t) return undefined
  const [h, m] = t.split(':').map(Number)
  const meridiem = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${meridiem}`
}

function itemDetailToProposed(
  detail: ItemDetail,
  scope?: RoutineItemScope,
): ProposedTodo {
  const { routineType, routineDays } = detail
  const isRoutine = detail.kind === 'ROUTINE'

  // 시간 초기값 — 이번만 수정: 그날의 실제 마감시간(23:59는 "시간 없음"), 전체 수정: 루틴 기본 반복시간
  const occurrenceHasTime =
    detail.dueDate != null && detail.dueDate.slice(11, 16) !== '23:59'
  const thisTime = occurrenceHasTime ? formatTime(detail.dueDate) : undefined
  const repeatTime = isRoutine
    ? scope === 'THIS'
      ? thisTime
      : formatTimeHMS(detail.routineTime)
    : undefined
  // 마감(종료일): 루틴=반복 종료일, 투두=마감일
  const endStr = isRoutine ? detail.repeatEndDate : detail.dueDate
  const deadlineDate = endStr ? new Date(endStr) : null
  const deadlineTime = formatTime(endStr) ?? null

  return {
    id: detail.todoId ?? 0,
    title: detail.title,
    time: (isRoutine ? repeatTime : deadlineTime) ?? '',
    dayTag: 'D',
    selectedTagId: detail.tagId != null ? String(detail.tagId) : '미선택',
    repeat: routineType ? (ROUTINE_TO_REPEAT[routineType] ?? '없음') : '없음',
    repeatTime,
    repeatTimeEnabled: repeatTime != null,
    weeklyDay:
      routineType === 'WEEKLY' && routineDays
        ? routineDays
            .map((i) => WEEKDAY_INDEX_TO_NAME[i])
            .filter((n): n is string => !!n)
        : undefined,
    monthlyDay:
      routineType === 'MONTHLY' && routineDays ? routineDays : undefined,
    deadlineDate,
    deadlineTime,
    subTodos: detail.subItems.map((s, i) => ({
      id: s.todoId ?? -(i + 1), // 행 없는 하위(예약분·예정분)는 임시 음수 키
      title: s.title,
    })),
  }
}

function SortableItem({
  id,
  children,
}: {
  id: string
  children: (
    dragListeners: Record<string, unknown> | undefined,
  ) => React.ReactNode
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
    >
      {children(listeners)}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [priorityEdit, setPriorityEdit] = useState(false)
  const [selectedTab, setSelectedTab] = useState<
    'all' | 'day' | 'week' | 'month'
  >('all')
  const [sort, setSort] = useState<'priority' | 'dueDate' | 'latest'>('dueDate')
  const showEdit = sort === 'priority'
  const [allTags, setAllTags] = useState<CustomTag[]>([])
  // 루틴 수정 시 선택한 범위 (THIS/ALL). 투두는 undefined
  const [editScope, setEditScope] = useState<RoutineItemScope | undefined>(
    undefined,
  )

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    fetchAllTags(accessToken).then(setAllTags)
  }, [])

  const calendar = useCalendar()
  const sheets = useBottomSheets()
  const itemHook = useItems({
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
    selectedTagId: '미선택',
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
  }

  const handleClickItem = async (item: Item) => {
    await itemHook.fetchDetail(item)
    sheets.setIsTodoInfoSheetOpen(true)
  }

  const handleCreateItem = async (proposed: ProposedTodo) => {
    try {
      await itemHook.handleCreate(proposed)
    } finally {
      sheets.setIsNewTodoSheetOpen(false)
    }
  }

  // 정보시트에서 '수정' → 루틴이면 범위 선택 시트, 투두면 바로 수정 시트
  const handleEditClick = () => {
    sheets.setIsTodoInfoSheetOpen(false)
    if (itemHook.selectedItem?.kind === 'ROUTINE') {
      sheets.setIsEditScopeSheetOpen(true)
    } else {
      setEditScope(undefined)
      sheets.setIsEditTodoSheetOpen(true)
    }
  }

  const handlePickEditScope = (scope: RoutineItemScope) => {
    setEditScope(scope)
    sheets.setIsEditScopeSheetOpen(false)
    sheets.setIsEditTodoSheetOpen(true)
  }

  // 수정 시트의 하위 목록 diff를 저장 시점에 반영한다. 조작 범위는 수정 진입 때 고른 것(이번만/모두)을 따른다.
  const handleUpdateItem = async (updated: ProposedTodo) => {
    const item = itemHook.selectedItem
    const detail = itemHook.selectedDetail
    if (!item || !detail) return
    await itemHook.handleUpdate(item, editScope, updated)

    // proposed의 하위 id → 원본 subItem 복원 (양수=todoId, 음수=subItems 배열 위치)
    const resolveSub = (id: number) =>
      id > 0
        ? detail.subItems.find((s) => s.todoId === id)
        : detail.subItems[-id - 1]

    const original = itemDetailToProposed(detail, editScope).subTodos
    const originalIds = new Set(original.map((s) => s.id))
    const updatedIds = new Set(updated.subTodos.map((s) => s.id))

    // 전체(ALL) 수정은 미래 회차 예외를 리셋하므로, 예약 하위(그날 전용)는 대상에서 뺀다
    const touchable = (sub?: (typeof detail.subItems)[number]) =>
      sub != null &&
      !(editScope === 'ALL' && sub.todoId == null && sub.reservedIndex != null)

    // 제목 수정 (index가 안 밀리게 삭제보다 먼저)
    for (const cur of updated.subTodos) {
      if (!originalIds.has(cur.id)) continue
      const before = original.find((s) => s.id === cur.id)
      if (!before || before.title === cur.title) continue
      const sub = resolveSub(cur.id)
      if (touchable(sub)) {
        await itemHook.handleUpdateSubTodo(sub!, cur.title, editScope)
      }
    }
    // 삭제 — 예약 index가 당겨지지 않게 뒤(index 큰 쪽)부터
    const removed = original
      .filter((s) => !updatedIds.has(s.id))
      .map((s) => resolveSub(s.id))
      .filter((sub) => touchable(sub))
      .sort((a, b) => (b?.reservedIndex ?? -1) - (a?.reservedIndex ?? -1))
    for (const sub of removed) {
      await itemHook.handleDeleteSubTodo(sub!, editScope)
    }
    // 추가
    for (const sub of updated.subTodos.filter((s) => !originalIds.has(s.id))) {
      await itemHook.handleAddSubTodo(item, sub.title, editScope)
    }
    sheets.setIsEditTodoSheetOpen(false)
    sheets.setIsTodoInfoSheetOpen(false)
  }

  const handleDeleteClick = (item: Item) => {
    itemHook.setDeletingItem(item)
    sheets.setIsDeleteBottomSheetOpen(true)
  }

  const runDelete = async (scope?: RoutineItemScope) => {
    if (!itemHook.deletingItem) return
    await itemHook.handleDelete(itemHook.deletingItem, scope)
    itemHook.setDeletingItem(null)
    sheets.setIsDeleteBottomSheetOpen(false)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const [weekViewStart, setWeekViewStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  )

  const [dayViewStart, setDayViewStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  )

  const calendarTouchStartX = useRef<number | null>(null)

  const handleCalendarTouchStart = (e: React.TouchEvent) => {
    calendarTouchStartX.current = e.touches[0].clientX
  }

  const handleCalendarTouchEnd = (e: React.TouchEvent) => {
    if (calendarTouchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - calendarTouchStartX.current
    calendarTouchStartX.current = null
    if (Math.abs(delta) < 50) return
    if (selectedTab === 'week') {
      const newStart = addDays(weekViewStart, delta < 0 ? 14 : -14)
      setWeekViewStart(newStart)
      calendar.setSelectedYear(newStart.getFullYear())
      calendar.setSelectedMonth(newStart.getMonth() + 1)
    } else if (selectedTab === 'day') {
      const newStart = addDays(dayViewStart, delta < 0 ? 7 : -7)
      setDayViewStart(newStart)
      calendar.setSelectedYear(newStart.getFullYear())
      calendar.setSelectedMonth(newStart.getMonth() + 1)
    } else {
      const next = new Date(
        calendar.selectedYear,
        calendar.selectedMonth - 1 + (delta < 0 ? 1 : -1),
      )
      calendar.setSelectedYear(next.getFullYear())
      calendar.setSelectedMonth(next.getMonth() + 1)
    }
  }

  return (
    <div className="relative min-h-dvh flex flex-col px-5 pb-[167px]">
      <div className="sticky top-26.5 z-40 bg-white">
        <div className="flex gap-1 cursor-pointer">
          <p className="font-bold">{`${calendar.selectedYear}년 ${calendar.selectedMonth}월`}</p>
          <ChevronDownStrokeIcon
            onClick={() => sheets.setIsMonthBottomSheetOpen(true)}
          />
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
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedTab !== 'all' && (
          <div
            onTouchStartCapture={handleCalendarTouchStart}
            onTouchEndCapture={handleCalendarTouchEnd}
          >
            <DatePicker
              onClose={() => {}}
              onConfirm={(date) => calendar.setSelectedDate(date)}
              onDeselect={() => calendar.setSelectedDate(null)}
              showHeader={false}
              value={calendar.selectedDate ?? undefined}
              defaultMonth={
                selectedTab === 'week'
                  ? weekViewStart
                  : selectedTab === 'day'
                    ? dayViewStart
                    : new Date(
                        calendar.selectedYear,
                        calendar.selectedMonth - 1,
                        1,
                      )
              }
              weeks={
                selectedTab === 'day'
                  ? 1
                  : selectedTab === 'week'
                    ? 2
                    : undefined
              }
              dueDates={itemHook.calendarDueDates}
              variant={selectedTab === 'month' ? 'range' : 'single'}
            />
          </div>
        )}

        {itemHook.filteredItems.length === 0 ? (
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
            {itemHook.pinnedItems.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mt-8">
                  <img src={symbolSvg} alt="" />
                  <p className="font-bold text-[14px] text-bluegray-darker">
                    주요 투두
                  </p>
                </div>
                {itemHook.pinnedItems.map((item) => (
                  <TodoCard
                    key={itemKey(item)}
                    status={item.isOverdue ? 'replan' : 'swipeable'}
                    onDelete={() => handleDeleteClick(item)}
                    onReplan={() =>
                      item.todoId && navigate(`/replan/${item.todoId}`)
                    }
                    onClick={() => handleClickItem(item)}
                    pinned={item.isPinned}
                    onPin={(isPinned) =>
                      itemHook.handleTogglePin(item, isPinned)
                    }
                  >
                    <TodoCard.Icon
                      onClick={() => itemHook.handleToggleComplete(item)}
                      checked={item.isCompleted}
                    />
                    <TodoCard.Content>
                      <TodoCard.Title dayTag={getDayTag(item.routineType)}>
                        {item.title}
                      </TodoCard.Title>
                      {item.dueDate && (
                        <TodoCard.Time>
                          {formatDateTime(item.dueDate)}
                        </TodoCard.Time>
                      )}
                    </TodoCard.Content>
                    <TodoCard.Category
                      category={item.tagTitle ?? ''}
                      usePin
                      pinned={item.isPinned}
                      setPinned={(isPinned) =>
                        itemHook.handleTogglePin(item, isPinned)
                      }
                    />
                  </TodoCard>
                ))}
              </div>
            )}

            {itemHook.pinnedItems.length > 0 && (
              <div className="bg-bluegray-light-hover w-full h-px my-8"></div>
            )}

            <div className="flex flex-col gap-3">
              {itemHook.regularActiveItems.length > 0 && (
                <div className="flex justify-between">
                  <Dropdown
                    width="w-[116px]"
                    items={['마감기한순', '최신등록순', '직접설정순']}
                    onChange={(item) => {
                      if (item === '마감기한순') {
                        setSort('dueDate')
                        setPriorityEdit(false)
                      } else if (item === '최신등록순') {
                        setSort('latest')
                        setPriorityEdit(false)
                      } else {
                        setSort('priority')
                      }
                    }}
                  />
                  {showEdit && (
                    <p
                      onClick={() => handlePriorityEdit()}
                      className="text-[12px] text-center text-bluegray-normal-active py-[6.5px] w-12 h-8 border border-bluegray-light-hover rounded-[20px] cursor-pointer"
                    >
                      {priorityEdit ? '완료' : '편집'}
                    </p>
                  )}
                </div>
              )}
              <div>
                {sort === 'priority' ? (
                  <DndContext
                    sensors={sensors}
                    onDragEnd={itemHook.handleDragEnd}
                  >
                    <SortableContext
                      items={itemHook.regularActiveItems.map((it) =>
                        itemKey(it),
                      )}
                      strategy={verticalListSortingStrategy}
                    >
                      {itemHook.regularActiveItems.map((item) => (
                        <SortableItem key={itemKey(item)} id={itemKey(item)}>
                          {(dragListeners) => (
                            <div className="flex w-full items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <TodoCard
                                  status={item.isOverdue ? 'replan' : 'swipeable'}
                                  onDelete={() => handleDeleteClick(item)}
                                  onReplan={() =>
                                    item.todoId &&
                                    navigate(`/replan/${item.todoId}`)
                                  }
                                  onClick={() => handleClickItem(item)}
                                  pinned={item.isPinned}
                                  onPin={(isPinned) =>
                                    itemHook.handleTogglePin(item, isPinned)
                                  }
                                >
                                  <TodoCard.Icon
                                    onClick={() =>
                                      itemHook.handleToggleComplete(item)
                                    }
                                    checked={item.isCompleted}
                                  />
                                  <TodoCard.Content>
                                    <TodoCard.Title
                                      dayTag={getDayTag(item.routineType)}
                                    >
                                      {item.title}
                                    </TodoCard.Title>
                                    {item.dueDate && (
                                      <TodoCard.Time>
                                        {formatDateTime(item.dueDate)}
                                      </TodoCard.Time>
                                    )}
                                  </TodoCard.Content>
                                  <TodoCard.Category
                                    category={item.tagTitle ?? ''}
                                    usePin
                                    pinned={item.isPinned}
                                    setPinned={(isPinned) =>
                                      itemHook.handleTogglePin(item, isPinned)
                                    }
                                  />
                                </TodoCard>
                              </div>
                              {priorityEdit && (
                                <img
                                  src={dragBar}
                                  alt=""
                                  {...dragListeners}
                                  className="cursor-grab touch-none shrink-0"
                                />
                              )}
                            </div>
                          )}
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  itemHook.regularActiveItems.map((item) => (
                    <TodoCard
                      key={itemKey(item)}
                      status={item.isOverdue ? 'replan' : 'swipeable'}
                      onDelete={() => handleDeleteClick(item)}
                      onReplan={() =>
                        item.todoId && navigate(`/replan/${item.todoId}`)
                      }
                      onClick={() => handleClickItem(item)}
                      pinned={item.isPinned}
                      onPin={(isPinned) =>
                        itemHook.handleTogglePin(item, isPinned)
                      }
                    >
                      <TodoCard.Icon
                        onClick={() => itemHook.handleToggleComplete(item)}
                        checked={item.isCompleted}
                      />
                      <TodoCard.Content>
                        <TodoCard.Title dayTag={getDayTag(item.routineType)}>
                          {item.title}
                        </TodoCard.Title>
                        {item.dueDate && (
                          <TodoCard.Time>
                            {formatDateTime(item.dueDate)}
                          </TodoCard.Time>
                        )}
                      </TodoCard.Content>
                      <TodoCard.Category
                        category={item.tagTitle ?? ''}
                        usePin
                        pinned={item.isPinned}
                        setPinned={(isPinned) =>
                          itemHook.handleTogglePin(item, isPinned)
                        }
                      />
                    </TodoCard>
                  ))
                )}

                <>
                  <div
                    onClick={() => itemHook.setIsCompletedOpen((prev) => !prev)}
                    className="flex items-center mt-8 mb-2 justify-between"
                  >
                    <div className="flex items-center gap-1">
                      <img src={completeSvg} alt="" />
                      <p className="font-bold text-[14px] text-bluegray-darker">
                        완료 투두
                      </p>
                    </div>
                    <ChevronLeftIcon
                      className={cn(
                        'w-5 h-5 transition-transform duration-300 cursor-pointer',
                        itemHook.isCompletedOpen
                          ? 'rotate-[270deg]'
                          : 'rotate-180',
                      )}
                    />
                  </div>
                  {itemHook.isCompletedOpen &&
                    itemHook.completedItems.map((item) => (
                      <TodoCard
                        key={itemKey(item)}
                        status="grey"
                        onDelete={() => handleDeleteClick(item)}
                        onClick={() => handleClickItem(item)}
                        pinned={item.isPinned}
                        onPin={(isPinned) =>
                          itemHook.handleTogglePin(item, isPinned)
                        }
                      >
                        <TodoCard.Icon
                          onClick={() => itemHook.handleToggleComplete(item)}
                          checked={item.isCompleted}
                        />
                        <TodoCard.Content>
                          <TodoCard.Title dayTag={getDayTag(item.routineType)}>
                            {item.title}
                          </TodoCard.Title>
                          {item.dueDate && (
                            <TodoCard.Time>
                              {formatDateTime(item.dueDate)}
                            </TodoCard.Time>
                          )}
                        </TodoCard.Content>
                        <TodoCard.Category
                          category={item.tagTitle ?? ''}
                          usePin
                          pinned={item.isPinned}
                          setPinned={(isPinned) =>
                            itemHook.handleTogglePin(item, isPinned)
                          }
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
        onConfirm={handleCreateItem}
        todo={emptyTodo}
        allTags={allTags}
        onTagAdd={() => {}}
        title="투두 추가"
      />

      {itemHook.selectedItem && itemHook.selectedDetail && (
        <>
          <TodoInfoSheet
            isOpen={sheets.isTodoInfoSheetOpen}
            onClose={() => sheets.setIsTodoInfoSheetOpen(false)}
            onEdit={handleEditClick}
            todo={itemDetailToTodoDetail(itemHook.selectedDetail)}
            repeatTime={repeatTimeRow(itemHook.selectedDetail).time}
            repeatTimeLabel={repeatTimeRow(itemHook.selectedDetail).label}
            allTags={allTags}
            onSubTodoToggle={(sub) => itemHook.handleToggleSubTodo(sub)}
            onReplan={
              // 리플랜은 행(todoId) 있는 미완료 투두만 — 미래 회차·완료 투두는 버튼 숨김
              itemHook.selectedDetail.todoId != null &&
              !itemHook.selectedDetail.isCompleted
                ? () => navigate(`/replan/${itemHook.selectedDetail!.todoId}`)
                : undefined
            }
            onClick={() => {
              handleDeleteClick(itemHook.selectedItem!)
              sheets.setIsTodoInfoSheetOpen(false)
            }}
          />
          <TodoEditSheet
            isOpen={sheets.isEditTodoSheetOpen}
            onClose={() => {
              sheets.setIsEditTodoSheetOpen(false)
              sheets.setIsTodoInfoSheetOpen(true)
            }}
            onConfirm={handleUpdateItem}
            todo={itemDetailToProposed(itemHook.selectedDetail, editScope)}
            allTags={allTags}
            onTagAdd={() => {}}
            title="투두 수정"
            onlyTitleAndTag={editScope === 'THIS'}
          />
        </>
      )}

      {/* 루틴 수정 범위 선택 */}
      <BottomSheet
        isOpen={sheets.isEditScopeSheetOpen}
        onClose={() => sheets.setIsEditScopeSheetOpen(false)}
      >
        <div className="pt-4 pb-9 px-5 flex flex-col items-center w-full">
          <h3 className="text-xl font-semibold">해당 투두는 반복 투두에요</h3>
          <p className="text-bluegray-darker mt-3 mb-6">
            이번 투두만 수정할까요?
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => handlePickEditScope('THIS')}
              className="flex-1 py-3 rounded-xl bg-bluegray-light text-black font-semibold"
            >
              이번만
            </button>
            <button
              onClick={() => handlePickEditScope('ALL')}
              className="flex-1 py-3 rounded-xl bg-bluegray-light text-black font-semibold"
            >
              모두 수정
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={sheets.isDeleteBottomSheetOpen}
        onClose={() => sheets.setIsDeleteBottomSheetOpen(false)}
      >
        <div className="pt-4 pb-9 px-5 flex flex-col items-center w-full">
          {itemHook.deletingItem?.kind === 'ROUTINE' ? (
            <>
              <h3 className="text-xl font-semibold">
                해당 투두는 반복 투두에요
              </h3>
              <p className="text-bluegray-darker mt-3 mb-6">
                이번 투두만 삭제할까요?
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => runDelete('THIS')}
                  className="flex-1 py-3 rounded-xl bg-bluegray-light text-black font-semibold"
                >
                  이번만
                </button>
                <button
                  onClick={() => runDelete('ALL')}
                  className="flex-1 py-3 rounded-xl bg-bluegray-light text-danger font-semibold"
                >
                  모두 삭제
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold">
                투두를 삭제하시겠습니까?
              </h3>
              <div className="flex gap-3 mt-5 w-full">
                <button
                  onClick={() => sheets.setIsDeleteBottomSheetOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-bluegray-light text-black font-semibold"
                >
                  취소
                </button>
                <button
                  onClick={() => runDelete()}
                  className="flex-1 py-3 rounded-xl bg-bluegray-light text-danger font-semibold"
                >
                  삭제
                </button>
              </div>
            </>
          )}
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
            if (selectedTab === 'week') {
              setWeekViewStart(
                startOfWeek(new Date(year, month - 1, 1), { weekStartsOn: 1 }),
              )
            } else if (selectedTab === 'day') {
              setDayViewStart(
                startOfWeek(new Date(year, month - 1, 1), { weekStartsOn: 1 }),
              )
            }
            sheets.setIsMonthBottomSheetOpen(false)
          }}
        />
      </BottomSheet>

      <AnimatePresence>
        {itemHook.showToast && (
          <Toast type="success" onClose={() => itemHook.setShowToast(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
