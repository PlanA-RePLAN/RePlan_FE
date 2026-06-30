import { TODO_TAGS, type TodoTagDef } from '@/shared/types/todo'
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
  weeklyDay?: string
  monthlyDay?: number
  routineDate?: number | null
  deadlineDate: Date | null
  deadlineTime: string | null
  subTodos: SubTodo[]
}

// todo.ts에 정의된 기본 태그를 CustomTag 형태로 변환
export const PRESET_TAGS: CustomTag[] = TODO_TAGS.map(
  (t: TodoTagDef): CustomTag => ({
    id: t.id,
    label: t.label,
    bgColor: t.bgColor,
    textColor: t.textColor,
  }),
)

// 서버에서 조회/생성된 태그를 CustomTag 형태로 변환
// color가 없으면 '미선택' 프리셋과 동일한 무채색 스타일을 사용
export function tagToCustomTag(tag: Tag): CustomTag {
  if (!tag.color) {
    return {
      id: String(tag.tagId),
      label: tag.title,
      bgColor: 'transparent',
      textColor: '#A9AFB9',
    }
  }
  return {
    id: String(tag.tagId),
    label: tag.title,
    bgColor: `${tag.color}1A`,
    textColor: tag.color,
  }
}

// 백엔드에 저장된 커스텀 태그인지 (id가 숫자 문자열인 tagId). 프리셋 태그는 'Study' 등 고정 문자열 id를 씀
export function isCustomTag(tag: CustomTag): boolean {
  return /^\d+$/.test(tag.id)
}

// CustomTag.id를 API에 보낼 tagId로 변환. 미선택/프리셋처럼 실제 서버 태그가 아니면 null
export function resolveBackendTagId(tagId: string): number | null {
  return /^\d+$/.test(tagId) ? Number(tagId) : null
}

// 프리셋 + 서버에 저장된 커스텀 태그를 합쳐서 조회
export async function fetchAllTags(accessToken: string): Promise<CustomTag[]> {
  const res = await getTags(accessToken)
  if (res.success && res.data) {
    return [...PRESET_TAGS, ...res.data.map(tagToCustomTag)]
  }
  return PRESET_TAGS
}

export const TAG_COLORS: CustomTag[] = [
  { id: 'coral', label: '', bgColor: '#ffebe7', textColor: '#f76f4d' },
  { id: 'purple', label: '', bgColor: '#f9ecf8', textColor: '#d482d0' },
  { id: 'green', label: '', bgColor: '#e4f5ee', textColor: '#2bad77' },
  { id: 'orange', label: '', bgColor: '#fff0df', textColor: '#ef9b38' },
  { id: 'blue', label: '', bgColor: '#e5edff', textColor: '#7ea4f5' },
  { id: 'pink', label: '', bgColor: '#fff1f1', textColor: '#ffa9a9' },
]
