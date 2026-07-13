import { useState, useEffect } from 'react'
import {
  getItems,
  getItemDetail,
  completeItem,
  pinItem,
  orderItem,
  updateItemContent,
  deleteItem,
} from '@/shared/api/items'
import {
  createTodo as createTodoApi,
  createSubTodo as createSubTodoApi,
} from '@/shared/api/todo'
import { createRoutine } from '@/shared/api/routine'
import type { Item, ItemDetail, RoutineItemScope } from '@/shared/types/item'
import { toTarget, itemKey } from '@/shared/types/item'
import type { ProposedTodo } from '@/features/onBoarding/type/types'
import {
  REPEAT_TO_ROUTINE,
  resolveBackendTagId,
} from '@/features/onBoarding/type/types'
import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'

const WEEKDAY_NAME_TO_INDEX: Record<string, number> = {
  월: 0,
  화: 1,
  수: 2,
  목: 3,
  금: 4,
  토: 5,
  일: 6,
}

// ProposedTodo의 마감일/시각 → 'YYYY-MM-DDTHH:mm:ss'
function buildDueDate(
  deadlineDate: Date | null,
  deadlineTime: string | null,
): string | null {
  if (!deadlineDate) return null
  const date = new Date(deadlineDate)
  if (deadlineTime) {
    const [timePart, meridiem] = deadlineTime.split(' ')
    const [h, m] = timePart.split(':').map(Number)
    const hours24 =
      meridiem === 'PM' && h !== 12
        ? h + 12
        : meridiem === 'AM' && h === 12
          ? 0
          : h
    date.setHours(hours24, m, 0, 0)
  }
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

// ProposedTodo의 반복 시각 → 'HH:mm:ss'
// TimePicker가 '22:00 PM'처럼 24시간 시각에 AM/PM을 붙여 주는 경우가 있어, 13 이상이면 이미 24시간제로 본다
function buildRoutineTime(repeatTime?: string): string | null {
  if (!repeatTime) return null
  const [timePart, meridiem] = repeatTime.split(' ')
  const [h, m] = timePart.split(':').map(Number)
  const hours24 =
    h > 12
      ? h
      : meridiem === 'PM' && h !== 12
        ? h + 12
        : meridiem === 'AM' && h === 12
          ? 0
          : h
  return `${String(hours24).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
}

// ProposedTodo의 요일/날짜 선택 → routineDays 배열
function buildRoutineDays(
  routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null,
  proposed: ProposedTodo,
): number[] | null {
  if (routineType === 'WEEKLY' && proposed.weeklyDay?.length) {
    return proposed.weeklyDay.map((d) => WEEKDAY_NAME_TO_INDEX[d] ?? 0)
  }
  if (routineType === 'MONTHLY' && proposed.monthlyDay?.length) {
    return proposed.monthlyDay
  }
  return null
}

interface UseItemsParams {
  selectedTab: 'all' | 'day' | 'week' | 'month'
  sort: 'priority' | 'dueDate' | 'latest'
  selectedDate: Date | null
  selectedYear: number
  selectedMonth: number
}

export function useItems({
  selectedTab,
  sort,
  selectedDate,
  selectedYear,
  selectedMonth,
}: UseItemsParams) {
  const [items, setItems] = useState<Item[]>([])
  const [calendarItems, setCalendarItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [selectedDetail, setSelectedDetail] = useState<ItemDetail | null>(null)
  const [deletingItem, setDeletingItem] = useState<Item | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [isCompletedOpen, setIsCompletedOpen] = useState(false)

  const toDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const refetchItems = async () => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    const apiSort = sort === 'latest' ? 'priority' : sort
    const baseDate = selectedDate
      ? toDateStr(selectedDate)
      : toDateStr(new Date())

    let apiFilter: 'all' | 'day' | 'week' | 'month'
    let apiDate: string | undefined

    switch (selectedTab) {
      case 'day':
        apiFilter = 'day'
        apiDate = baseDate
        break
      case 'week':
        apiFilter = 'week'
        apiDate = baseDate
        break
      case 'month':
        apiFilter = 'month'
        apiDate = baseDate
        break
      default:
        apiFilter = 'all'
        apiDate = undefined
    }

    const res = await getItems(accessToken, apiFilter, apiSort, apiDate)
    if (res.success) setItems(res.data ?? [])
  }

  const refetchCalendarItems = async () => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    const monthDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`
    const res = await getItems(accessToken, 'month', 'dueDate', monthDate)
    if (res.success) setCalendarItems(res.data ?? [])
  }

  useEffect(() => {
    refetchItems()
  }, [selectedTab, sort, selectedYear, selectedMonth, selectedDate])

  useEffect(() => {
    refetchCalendarItems()
  }, [selectedYear, selectedMonth])

  const patchLocal = (key: string, patch: Partial<Item>) =>
    setItems((prev) =>
      prev.map((it) => (itemKey(it) === key ? { ...it, ...patch } : it)),
    )

  const fetchDetail = async (item: Item) => {
    const target = toTarget(item)
    if (!target) return
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const res = await getItemDetail(accessToken, target)
      if (res.success && res.data) {
        setSelectedItem(item)
        setSelectedDetail(res.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddSubTodo = async (parentId: number, title: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const res = await createSubTodoApi(accessToken, parentId, title)
      if (res.success && res.data) {
        const created = res.data
        setSelectedDetail((prev) =>
          prev
            ? {
                ...prev,
                subItems: [
                  ...prev.subItems,
                  {
                    todoId: created.todoId,
                    title: created.title,
                    isCompleted: created.isCompleted,
                  },
                ],
              }
            : prev,
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreate = async (proposed: ProposedTodo) => {
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const routineType = REPEAT_TO_ROUTINE[proposed.repeat]
      const dueDate = buildDueDate(proposed.deadlineDate, proposed.deadlineTime)
      const tagId = resolveBackendTagId(proposed.selectedTagId)

      if (routineType) {
        const res = await createRoutine(accessToken, {
          title: proposed.title,
          routineType,
          dueDate,
          routineTime: buildRoutineTime(proposed.repeatTime),
          routineDays: buildRoutineDays(routineType, proposed),
          tagId,
          goalId: null,
        })
        if (res.success) await refetchItems()
      } else {
        const res = await createTodoApi(accessToken, {
          title: proposed.title,
          dueDate,
          tagId,
          goalId: null,
        })
        if (res.success) await refetchItems()
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 루틴이면 scope(THIS/ALL)에 따라 회차만 / 반복 전체 수정
  const handleUpdate = async (
    item: Item,
    scope: RoutineItemScope | undefined,
    updated: ProposedTodo,
  ) => {
    const target = toTarget(item)
    if (!target) return
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const dueDate = buildDueDate(updated.deadlineDate, updated.deadlineTime)
      const routineType = REPEAT_TO_ROUTINE[updated.repeat]
      const tagId = resolveBackendTagId(updated.selectedTagId)

      if (target.kind === 'TODO') {
        await updateItemContent(accessToken, target, undefined, {
          title: updated.title,
          dueDate,
          tagId,
          routineType,
          routineDays: buildRoutineDays(routineType, updated),
          routineTime: buildRoutineTime(updated.repeatTime),
        })
      } else if (scope === 'ALL') {
        await updateItemContent(accessToken, target, 'ALL', {
          title: updated.title,
          tagId,
          routineType,
          routineDays: buildRoutineDays(routineType, updated),
          routineTime: buildRoutineTime(updated.repeatTime),
          repeatEndDate: dueDate,
        })
      } else {
        await updateItemContent(accessToken, target, 'THIS', {
          title: updated.title,
          tagId,
          // 그 회차만의 마감시간 (null = 루틴 기본 시간으로 복귀)
          routineTime: buildRoutineTime(updated.repeatTime),
        })
      }
      await refetchItems()
    } catch (error) {
      console.error(error)
    }
  }

  // 루틴 THIS=그날 건너뛰기 / ALL=반복 전체 삭제, 투두=삭제
  const handleDelete = async (item: Item, scope?: RoutineItemScope) => {
    const target = toTarget(item)
    if (!target) return
    const key = itemKey(item)
    setItems((prev) => prev.filter((it) => itemKey(it) !== key))
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await deleteItem(accessToken, target, scope)
    } catch (error) {
      console.error(error)
      await refetchItems()
    }
  }

  const handleToggleComplete = async (item: Item) => {
    const target = toTarget(item)
    if (!target) return
    const key = itemKey(item)

    if (!item.isCompleted) {
      const todayStr = toDateStr(new Date())
      const todayItems = items.filter((it) => it.date === todayStr)
      const willAllComplete =
        todayItems.length > 0 &&
        todayItems
          .filter((it) => !it.isCompleted)
          .every((it) => itemKey(it) === key)
      if (willAllComplete) setShowToast(true)
    }

    patchLocal(key, { isCompleted: !item.isCompleted })
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await completeItem(accessToken, target, !item.isCompleted)
    } catch (error) {
      patchLocal(key, { isCompleted: item.isCompleted })
      console.error(error)
    }
  }

  const handleTogglePin = async (item: Item, isPinned: boolean) => {
    const target = toTarget(item)
    if (!target) return
    const key = itemKey(item)
    patchLocal(key, { isPinned })
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await pinItem(accessToken, target, isPinned)
    } catch (error) {
      patchLocal(key, { isPinned: !isPinned })
      console.error(error)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const ordered = [...regularActiveItems]
    const oldIndex = ordered.findIndex((it) => itemKey(it) === active.id)
    const newIndex = ordered.findIndex((it) => itemKey(it) === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const moved = ordered[oldIndex]
    const target = toTarget(moved)
    if (!target) return

    const reordered = arrayMove(ordered, oldIndex, newIndex)
    const pos = reordered.findIndex((it) => itemKey(it) === active.id)
    const prev = pos > 0 ? reordered[pos - 1].sortOrder : null
    const next =
      pos < reordered.length - 1 ? reordered[pos + 1].sortOrder : null
    const newSort =
      prev != null && next != null
        ? (prev + next) / 2
        : prev != null
          ? prev + 10000
          : next != null
            ? next / 2
            : moved.sortOrder

    patchLocal(itemKey(moved), { sortOrder: newSort })
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await orderItem(accessToken, target, newSort)
    } catch (error) {
      console.error(error)
      await refetchItems()
    }
  }

  const filteredItems =
    selectedTab === 'all'
      ? items.filter((it) => {
          if (!it.dueDate) return true
          const date = new Date(it.dueDate)
          return (
            date.getFullYear() === selectedYear &&
            date.getMonth() + 1 === selectedMonth
          )
        })
      : items

  const sortedItems =
    sort === 'latest'
      ? [...filteredItems].sort((a, b) => (b.todoId ?? 0) - (a.todoId ?? 0))
      : sort === 'priority'
        ? [...filteredItems].sort((a, b) => a.sortOrder - b.sortOrder)
        : filteredItems

  const pinnedItems = sortedItems.filter((it) => it.isPinned && !it.isCompleted)
  const regularActiveItems = sortedItems.filter(
    (it) => !it.isPinned && !it.isCompleted,
  )
  const completedItems = sortedItems.filter((it) => it.isCompleted)

  const calendarDueDates = calendarItems
    .filter((it) => it.dueDate && it.routineType === null)
    .map((it) => new Date(it.dueDate!))

  return {
    calendarDueDates,
    items,
    selectedItem,
    setSelectedItem,
    selectedDetail,
    setSelectedDetail,
    deletingItem,
    setDeletingItem,
    showToast,
    setShowToast,
    isCompletedOpen,
    setIsCompletedOpen,
    fetchDetail,
    handleCreate,
    handleAddSubTodo,
    handleUpdate,
    handleDelete,
    handleToggleComplete,
    handleTogglePin,
    handleDragEnd,
    filteredItems,
    pinnedItems,
    regularActiveItems,
    completedItems,
  }
}
