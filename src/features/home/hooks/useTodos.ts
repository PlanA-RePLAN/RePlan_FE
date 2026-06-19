import { useState, useEffect } from 'react'
import {
  getTodos,
  getTodoDetail,
  deleteTodo,
  toggleTodoComplete,
  updateTodoOrder,
  createTodo as createTodoApi,
  pinTodo,
  updateTodo as updateTodoApi,
} from '@/shared/api/todo'
import { createRoutine } from '@/shared/api/routine'
import type { Todo, TodoDetail } from '@/shared/types/todo'
import type { ProposedTodo } from '@/features/onBoarding/type/types'
import { REPEAT_TO_ROUTINE } from '@/features/onBoarding/type/types'
import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'

const WEEKDAY_NAME_TO_NUM: Record<string, number> = {
  월: 1, 화: 2, 수: 4, 목: 8, 금: 16, 토: 32, 일: 64,
}

interface UseTodosParams {
  selectedTab: 'all' | 'day' | 'week' | 'month'
  sort: 'priority' | 'dueDate' | 'latest'
  selectedDate: Date | null
  selectedYear: number
  selectedMonth: number
}

export function useTodos({ selectedTab, sort, selectedDate, selectedYear, selectedMonth }: UseTodosParams) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [calendarTodos, setCalendarTodos] = useState<Todo[]>([])
  const [selectedTodo, setSelectedTodo] = useState<TodoDetail | null>(null)
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [isCompletedOpen, setIsCompletedOpen] = useState(false)

  const toDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const refetchTodos = async () => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    const apiSort = sort === 'latest' ? 'priority' : sort
    const baseDate = selectedDate ? toDateStr(selectedDate) : toDateStr(new Date())

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

    const res = await getTodos(accessToken, apiFilter, apiSort, apiDate)
    if (res.success) setTodos(res.data ?? [])
  }


  const refetchCalendarTodos = async () => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    const monthDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`
    const res = await getTodos(accessToken, 'month', 'dueDate', monthDate)
    if (res.success) setCalendarTodos(res.data ?? [])
  }

  useEffect(() => {
    refetchTodos()
  }, [selectedTab, sort, selectedYear, selectedMonth, selectedDate])

  useEffect(() => {
    refetchCalendarTodos()
  }, [selectedYear, selectedMonth])

  const fetchTodo = async (todoId: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const res = await getTodoDetail(accessToken, todoId)
      if (res.success && res.data) setSelectedTodo(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateTodo = async (proposed: ProposedTodo) => {
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const routineType = REPEAT_TO_ROUTINE[proposed.repeat]

      let dueDate: string | null = null
      if (proposed.deadlineDate) {
        const date = new Date(proposed.deadlineDate)
        if (proposed.deadlineTime) {
          const [timePart, meridiem] = proposed.deadlineTime.split(' ')
          const [h, m] = timePart.split(':').map(Number)
          const hours24 =
            meridiem === 'PM' && h !== 12 ? h + 12 : meridiem === 'AM' && h === 12 ? 0 : h
          date.setHours(hours24, m, 0, 0)
        }
        dueDate = date.toISOString()
      }

      if (routineType) {
        let routineDate: number | null = null
        if (routineType === 'WEEKLY' && proposed.weeklyDay) {
          routineDate = WEEKDAY_NAME_TO_NUM[proposed.weeklyDay] ?? null
        } else if (routineType === 'MONTHLY' && proposed.monthlyDay) {
          routineDate = proposed.monthlyDay
        }

        let routineTime: string | null = null
        if (proposed.repeatTime) {
          const [timePart, meridiem] = proposed.repeatTime.split(' ')
          const [h, m] = timePart.split(':').map(Number)
          const hours24 =
            meridiem === 'PM' && h !== 12 ? h + 12 : meridiem === 'AM' && h === 12 ? 0 : h
          routineTime = `${String(hours24).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
        }

        const res = await createRoutine(accessToken, {
          title: proposed.title,
          routineType,
          dueDate,
          routineTime,
          routineDate,
          tagId: null,
          goalId: null,
        })
        if (res.success) await refetchTodos()
      } else {
        const res = await createTodoApi(accessToken, {
          title: proposed.title,
          dueDate,
          tagId: null,
          goalId: null,
        })
        if (res.success) await refetchTodos()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateTodo = async (updated: ProposedTodo) => {
    if (!selectedTodo) return
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''

      let dueDate: string | null = null
      if (updated.deadlineDate) {
        const date = new Date(updated.deadlineDate)
        if (updated.deadlineTime) {
          const [timePart, meridiem] = updated.deadlineTime.split(' ')
          const [h, m] = timePart.split(':').map(Number)
          const hours24 =
            meridiem === 'PM' && h !== 12 ? h + 12 : meridiem === 'AM' && h === 12 ? 0 : h
          date.setHours(hours24, m, 0, 0)
        }
        const pad = (n: number) => String(n).padStart(2, '0')
        dueDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
      }

      const routineType = REPEAT_TO_ROUTINE[updated.repeat]
      let routineDate: number | null = null
      if (routineType === 'WEEKLY' && updated.weeklyDay) {
        routineDate = WEEKDAY_NAME_TO_NUM[updated.weeklyDay] ?? null
      } else if (routineType === 'MONTHLY' && updated.monthlyDay) {
        routineDate = updated.monthlyDay
      }

      await updateTodoApi(accessToken, selectedTodo.todoId, {
        title: updated.title,
        dueDate,
        tagId: selectedTodo.tagId,
        routineType,
        routineDate,
      })

      await refetchTodos()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteById = async (todoId: number) => {
    setTodos((prev) => prev.filter((t) => t.todoId !== todoId))
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await deleteTodo(accessToken, todoId)
    } catch (error) {
      console.error(error)
    }
  }

  const handleToggleComplete = async (todoId: number, isCompleted: boolean) => {
    if (!isCompleted) {      const todayStr = toDateStr(new Date())
      const todayTodos = todos.filter((t) => t.dueDate?.startsWith(todayStr))
      const willAllTodayComplete =
        todayTodos.length > 0 &&
        todayTodos.filter((t) => !t.isCompleted).every((t) => t.todoId === todoId)
      if (willAllTodayComplete) setShowToast(true)
    }

    setTodos((prev) =>
      prev.map((t) => (t.todoId === todoId ? { ...t, isCompleted: !isCompleted } : t))
    )
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await toggleTodoComplete(accessToken, todoId, !isCompleted)
    } catch (error) {
      setTodos((prev) =>
        prev.map((t) => (t.todoId === todoId ? { ...t, isCompleted } : t))
      )
      console.error(error)
    }
  }

  const handleTogglePin = async (todoId: number, isPinned: boolean) => {
    setTodos((prev) =>
      prev.map((t) => (t.todoId === todoId ? { ...t, isPinned } : t))
    )
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await pinTodo(accessToken, todoId, isPinned)
    } catch (error) {
      setTodos((prev) =>
        prev.map((t) => (t.todoId === todoId ? { ...t, isPinned: !isPinned } : t))
      )
      console.error(error)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = todos.findIndex((t) => t.todoId === active.id)
    const newIndex = todos.findIndex((t) => t.todoId === over.id)
    const newTodos = arrayMove(todos, oldIndex, newIndex)
    setTodos(newTodos)

    const newRegularTodos = newTodos.filter((t) => !t.isPinned)
    const movedIndex = newRegularTodos.findIndex((t) => t.todoId === active.id)
    const prevTodoId = movedIndex > 0 ? newRegularTodos[movedIndex - 1].todoId : null
    const nextTodoId =
      movedIndex < newRegularTodos.length - 1 ? newRegularTodos[movedIndex + 1].todoId : null

    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await updateTodoOrder(accessToken, active.id as number, prevTodoId, nextTodoId)
    } catch (error) {
      console.error(error)
      setTodos(todos)
    }
  }

  const filteredTodos = selectedDate && selectedTab !== 'week' && selectedTab !== 'month'
    ? todos.filter((t) => t.dueDate?.startsWith(toDateStr(selectedDate)) ?? false)
    : selectedTab === 'all'
    ? todos.filter((t) => {
        if (!t.dueDate) return true
        const date = new Date(t.dueDate)
        return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth
      })
    : todos

  const sortedTodos =
    sort === 'latest' ? [...filteredTodos].sort((a, b) => b.todoId - a.todoId) : filteredTodos

  const pinnedTodos = sortedTodos.filter((t) => t.isPinned && !t.isCompleted)
  const regularActiveTodos = sortedTodos.filter((t) => !t.isPinned && !t.isCompleted)
  const completedTodos = sortedTodos.filter((t) => t.isCompleted)

  const calendarDueDates = calendarTodos
    .filter((t) => t.dueDate)
    .map((t) => new Date(t.dueDate!))

  return {
    calendarDueDates,
    todos,
    selectedTodo,
    setSelectedTodo,
    deletingTodoId,
    setDeletingTodoId,
    showToast,
    setShowToast,
    isCompletedOpen,
    setIsCompletedOpen,
    fetchTodo,
    handleCreateTodo,
    handleUpdateTodo,
    deleteById,
    handleToggleComplete,
    handleTogglePin,
    handleDragEnd,
    filteredTodos,
    pinnedTodos,
    regularActiveTodos,
    completedTodos,
  }
}
