import { TODO_TAGS, type TodoTagDef } from '@/shared/types/todo'

export type RepeatType = '없음' | '데일리' | '위클리' | '먼슬리'

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
  dayTag: 'D' | 'M'
  selectedTagId: string
  repeat: RepeatType
  repeatTimeEnabled?: boolean
  repeatTime?: string
  weeklyDay?: string
  monthlyDay?: number
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

export const TAG_COLORS: CustomTag[] = [
  { id: 'coral', label: '', bgColor: '#ffebe7', textColor: '#f76f4d' },
  { id: 'purple', label: '', bgColor: '#f9ecf8', textColor: '#d482d0' },
  { id: 'green', label: '', bgColor: '#e4f5ee', textColor: '#2bad77' },
  { id: 'orange', label: '', bgColor: '#fff0df', textColor: '#ef9b38' },
  { id: 'blue', label: '', bgColor: '#e5edff', textColor: '#7ea4f5' },
  { id: 'pink', label: '', bgColor: '#fff1f1', textColor: '#ffa9a9' },
]
