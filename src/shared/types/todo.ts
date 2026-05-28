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
