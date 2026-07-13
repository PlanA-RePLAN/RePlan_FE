export type ItemKind = 'TODO' | 'ROUTINE'

// 루틴 조작 범위: THIS=이 회차만, ALL=반복 전체
export type RoutineItemScope = 'THIS' | 'ALL'

// GET /api/items — 목록 아이템 (투두 + 루틴 회차 병합)
// 카드 표시·조작에 필요한 최소 정보만. 나머지는 상세(getItemDetail)로 받는다.
export interface Item {
  kind: ItemKind
  todoId: number | null // 미래 루틴 회차면 null
  routineId: number | null
  date: string | null // 'YYYY-MM-DD' (filter=all의 루틴은 null일 수 있음)
  title: string
  dueDate: string | null // 루틴이면 그 회차의 실제 마감일시
  routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null
  tagId: number | null
  tagTitle: string | null
  tagColor: string | null
  sortOrder: number
  isPinned: boolean
  isCompleted: boolean
  isOverdue: boolean
}

// GET /api/items/detail — 상세
// 하위 3종 구분: todoId 있음=행 하위(그날만 조작) / reservedIndex 있음=예약(그날만, 미래 회차) /
// subRoutineId만 있음=하위 루틴 예정분(반복 전체로만 조작). 행 하위인데 subRoutineId도 있으면 하위 루틴 출신.
export interface SubItem {
  todoId: number | null
  title: string
  isCompleted: boolean
  reservedIndex: number | null
  subRoutineId: number | null
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
  routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null
  routineDays: number[] | null
  routineTime: string | null // 루틴 기본 반복시간 'HH:mm:ss'. dueDate와 다르면 그날만 시간이 바뀐 것
  repeatEndDate: string | null // 루틴 반복 종료일
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
