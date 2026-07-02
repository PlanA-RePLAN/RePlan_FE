import type { Tag } from '@/shared/types/tag'
import { getTags } from '@/shared/api/tags'

export type RepeatType = '없음' | '데일리' | '위클리' | '먼슬리'
export type RoutineType = 'DAILY' | 'WEEKLY' | 'MONTHLY'

export const REPEAT_OPTIONS: RepeatType[] = [
  '없음',
  '데일리',
  '위클리',
  '먼슬리',
]

export const ROUTINE_TO_REPEAT: Record<RoutineType, RepeatType> = {
  DAILY: '데일리',
  WEEKLY: '위클리',
  MONTHLY: '먼슬리',
}

export const REPEAT_TO_ROUTINE: Record<RepeatType, RoutineType | null> = {
  없음: null,
  데일리: 'DAILY',
  위클리: 'WEEKLY',
  먼슬리: 'MONTHLY',
}

// 커스텀 태그 (사용자가 직접 추가한 태그)
export interface CustomTag {
  id: string
  label: string
  bgColor: string
  textColor: string
}

export interface SubTodo {
  id: number
  title: string
}

export interface ProposedTodo {
  id: number
  title: string
  time: string
  dayTag?: 'D' | 'W' | 'M'
  selectedTagId: string
  repeat: RepeatType
  repeatTimeEnabled?: boolean
  repeatTime?: string
  weeklyDay?: string[]
  monthlyDay?: number[]
  routineDate?: number | null
  deadlineDate: Date | null
  deadlineTime: string | null
  subTodos: SubTodo[]
}

export const TAG_COLORS: CustomTag[] = [
  { id: 'coral', label: '', bgColor: '#ffebe7', textColor: '#f76f4d' },
  { id: 'purple', label: '', bgColor: '#f9ecf8', textColor: '#d482d0' },
  { id: 'green', label: '', bgColor: '#e4f5ee', textColor: '#2bad77' },
  { id: 'orange', label: '', bgColor: '#fff0df', textColor: '#ef9b38' },
  { id: 'blue', label: '', bgColor: '#e5edff', textColor: '#7ea4f5' },
  { id: 'pink', label: '', bgColor: '#fff1f1', textColor: '#ffa9a9' },
]

// 서버에서 조회/생성된 태그를 CustomTag 형태로 변환
// color가 없으면 무채색 스타일, color가 있으면 TAG_COLORS에서 bgColor/textColor 쌍을 조회
export function tagToCustomTag(tag: Tag): CustomTag {
  if (!tag.color) {
    return {
      id: String(tag.tagId),
      label: tag.title,
      bgColor: 'transparent',
      textColor: '#A9AFB9',
    }
  }
  const normalized = tag.color.toLowerCase()
  const matched =
    TAG_COLORS.find((c) => c.bgColor === normalized) ??
    TAG_COLORS.find((c) => c.textColor === normalized)
  return {
    id: String(tag.tagId),
    label: tag.title,
    bgColor: matched?.bgColor ?? `${tag.color}1A`,
    textColor: matched?.textColor ?? tag.color,
  }
}

const UNSELECTED_TAG: CustomTag = {
  id: '미선택',
  label: '미선택',
  bgColor: 'transparent',
  textColor: '#a9afb9',
}

// 백엔드에 저장된 커스텀 태그인지 (id가 숫자 문자열인 tagId)
export function isCustomTag(tag: CustomTag): boolean {
  return /^\d+$/.test(tag.id)
}

// CustomTag.id를 API에 보낼 tagId로 변환. 미선택/프리셋처럼 실제 서버 태그가 아니면 null
export function resolveBackendTagId(tagId: string): number | null {
  return /^\d+$/.test(tagId) ? Number(tagId) : null
}

// 서버에 저장된 태그를 조회 (앞에 미선택 옵션 고정)
export async function fetchAllTags(accessToken: string): Promise<CustomTag[]> {
  const res = await getTags(accessToken)
  if (res.success && res.data) {
    return [UNSELECTED_TAG, ...res.data.map(tagToCustomTag)]
  }
  return [UNSELECTED_TAG]
}
