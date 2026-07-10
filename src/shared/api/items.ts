import client from './client'
import type { ApiResponse } from '../types/auth'
import type {
  Item,
  ItemDetail,
  ItemTarget,
  RoutineItemScope,
} from '../types/item'

const auth = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
})

// target을 요청 body/파라미터에 실을 형태로 평탄화
function targetBody(target: ItemTarget) {
  return target.kind === 'TODO'
    ? { kind: 'TODO' as const, todoId: target.todoId }
    : {
        kind: 'ROUTINE' as const,
        routineId: target.routineId,
        date: target.date,
      }
}

// 1. 목록 조회
export async function getItems(
  accessToken: string,
  filter: 'all' | 'day' | 'week' | 'month',
  sort: 'priority' | 'dueDate',
  date?: string,
): Promise<ApiResponse<Item[]>> {
  const res = await client.get<ApiResponse<Item[]>>('/api/items', {
    params: { filter, sort, ...(date && { date }) },
    ...auth(accessToken),
  })
  return res.data
}

// 2. 상세 조회
export async function getItemDetail(
  accessToken: string,
  target: ItemTarget,
): Promise<ApiResponse<ItemDetail>> {
  const res = await client.get<ApiResponse<ItemDetail>>('/api/items/detail', {
    params: targetBody(target),
    ...auth(accessToken),
  })
  return res.data
}

// 3. 완료/미완료 (항상 그 회차만)
export async function completeItem(
  accessToken: string,
  target: ItemTarget,
  isCompleted: boolean,
): Promise<ApiResponse<null>> {
  const res = await client.patch<ApiResponse<null>>(
    '/api/items/complete',
    { ...targetBody(target), isCompleted },
    auth(accessToken),
  )
  return res.data
}

// 4. 핀/언핀 (항상 그 회차만)
export async function pinItem(
  accessToken: string,
  target: ItemTarget,
  isPinned: boolean,
): Promise<ApiResponse<null>> {
  const res = await client.patch<ApiResponse<null>>(
    '/api/items/pin',
    { ...targetBody(target), isPinned },
    auth(accessToken),
  )
  return res.data
}

// 5. 정렬 (프론트가 앞뒤 sortOrder 중간값을 계산해서 전송)
export async function orderItem(
  accessToken: string,
  target: ItemTarget,
  sortOrder: number,
): Promise<ApiResponse<null>> {
  const res = await client.patch<ApiResponse<null>>(
    '/api/items/order',
    { ...targetBody(target), sortOrder },
    auth(accessToken),
  )
  return res.data
}

// 6. 내용 수정 (ROUTINE이면 scope 필수, TODO면 scope 없이)
export interface UpdateItemContentBody {
  title?: string
  dueDate?: string | null // TODO 전용, 'YYYY-MM-DDTHH:mm:ss'
  tagId?: number | null
  routineType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null
  routineDays?: number[] | null
  routineTime?: string | null // 'HH:mm:ss'
  repeatEndDate?: string | null // ROUTINE scope=ALL 전용
}

export async function updateItemContent(
  accessToken: string,
  target: ItemTarget,
  scope: RoutineItemScope | undefined, // TODO=undefined, ROUTINE=필수
  body: UpdateItemContentBody,
): Promise<ApiResponse<null>> {
  const res = await client.patch<ApiResponse<null>>(
    '/api/items/content',
    { ...targetBody(target), ...(scope && { scope }), ...body },
    auth(accessToken),
  )
  return res.data
}

// 7. 삭제 (DELETE + body → axios는 config.data로 전달)
export async function deleteItem(
  accessToken: string,
  target: ItemTarget,
  scope?: RoutineItemScope, // ROUTINE이면 필수
): Promise<ApiResponse<null>> {
  const res = await client.delete<ApiResponse<null>>('/api/items', {
    ...auth(accessToken),
    data: { ...targetBody(target), ...(scope && { scope }) },
  })
  return res.data
}
