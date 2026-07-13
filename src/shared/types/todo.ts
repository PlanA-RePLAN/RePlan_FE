export interface SubTodoDetail {
  todoId: number | null // 행이 없는 회차의 하위(예약분·예정분)는 null
  title: string
  isCompleted: boolean
  reservedIndex?: number | null // 예약 하위의 배열 위치 (수정/삭제 지목용)
  subRoutineId?: number | null // 하위 루틴 ID (반복 전체 수정/삭제 지목용)
}

export interface TodoDetail {
  todoId: number
  title: string
  dueDate: string | null
  dueTime: string | null
  isCompleted: boolean
  tagId: number | null
  tagTitle: string | null
  tagColor: string | null
  routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null
  routineDays: number[] | null
  subTodos: SubTodoDetail[]
}

export interface Todo {
  todoId: number
  title: string
  dueDate: string | null
  isPinned: boolean
  sortOrder: number
  isCompleted: boolean
  tagId: number | null
  tagTitle: string | null
  tagColor: string | null
  routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null
  isOverdue: boolean
}

export interface CreateTodoRequest {
  title: string
  dueDate?: string | null
  tagId?: number | null
  goalId?: number | null
}

export interface CreateTodoResponse {
  todoId: number
  title: string
  dueDate: string | null
  tagId: number | null
  parentId: number | null
  completed: boolean
}

export interface CreateSubTodoResponse {
  todoId: number
  title: string
  dueDate: string | null
  isCompleted: boolean
  tagId: number | null
  parentId: number
}

export interface UpdateTodoRequest {
  title: string
  dueDate: string | null
  tagId: number | null
  routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null
  routineDays: number[] | null
  routineTime?: string | null
}

export type TodoTagId = '미선택' | 'Study' | 'Project' | 'Health' | 'Other'

export interface TodoTagDef {
  id: TodoTagId
  label: string
  bgColor: string
  textColor: string
  dashed?: boolean
}

export const TODO_TAGS: TodoTagDef[] = [
  {
    id: '미선택',
    label: '미선택',
    bgColor: 'transparent',
    textColor: '#a9afb9',
    dashed: true,
  },
  { id: 'Study', label: 'Study', bgColor: '#ffebe7', textColor: '#f76f4d' },
  { id: 'Project', label: 'Project', bgColor: '#f9ecf8', textColor: '#d482d0' },
  { id: 'Health', label: 'Health', bgColor: '#e4f5ee', textColor: '#2bad77' },
  { id: 'Other', label: 'Other', bgColor: '#e5edff', textColor: '#7ea4f5' },
]

export function getTodoTag(id: string): TodoTagDef | undefined {
  return TODO_TAGS.find((t) => t.id === id)
}
