export type ItemKind = 'TODO' | 'ROUTINE'

// 루틴 조작 범위: THIS=이 회차만, ALL=반복 전체
export type RoutineItemScope = 'THIS' | 'ALL'

// GET /api/items — 목록 아이템 (투두 + 루틴 회차 병합)
export interface Item {
  kind: ItemKind
  todoId: number | null // 미래 루틴 회차면 null
  routineId: number | null
  date: string | null // 'YYYY-MM-DD' (filter=all의 루틴은 null일 수 있음)
  title: string
  dueDate: string | null
  repeatEndDate: string | null // 루틴 반복 종료일
  routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null
  routineDays: number[] | null
  tagId: number | null
  tagTitle: string | null
  tagColor: string | null
  goalId: number | null
  sortOrder: number
  isPinned: boolean
  isCompleted: boolean
  isOverdue: boolean
  hasOverride: boolean
}

// GET /api/items/detail — 상세
export interface SubItem {
  todoId: number
  title: string
  isCompleted: boolean
}

export interface ItemDetail {
  kind: ItemKind
  todoId: number | null
  routineId: number | null
  date: string | null
  title: string
  dueDate: string | null
  isCompleted: boolean
  isPinned: boolean | null
  isSkipped: boolean
  hasOverride: boolean
  tagId: number | null
  tagTitle: string | null
  tagColor: string | null
  routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null // ⚠️ TODO 상세에서만 값 있음
  routineDays: number[] | null // ⚠️ TODO 상세에서만 값 있음
  subItems: SubItem[]
}

// 아이템 "주소" — 조작 API에 싣는 식별자
export type ItemTarget =
  | { kind: 'TODO'; todoId: number }
  | { kind: 'ROUTINE'; routineId: number; date: string }

// Item → 주소. 조작 불가한 아이템(todoId 없는 all-루틴 등)이면 null
export function toTarget(item: Item): ItemTarget | null {
  if (item.kind === 'TODO') {
    return item.todoId != null ? { kind: 'TODO', todoId: item.todoId } : null
  }
  return item.routineId != null && item.date != null
    ? { kind: 'ROUTINE', routineId: item.routineId, date: item.date }
    : null
}

// React key & dnd id (투두/루틴 회차 안 겹치게)
export function itemKey(item: Item): string {
  return item.kind === 'TODO'
    ? `T-${item.todoId}`
    : `R-${item.routineId}-${item.date}`
}
