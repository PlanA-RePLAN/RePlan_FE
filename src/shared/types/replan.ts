export type QuestionType = 'TEXT' | 'TODO_SELECT'

export type ReplanActionType =
  | 'ADD'
  | 'MODIFY_TODO'
  | 'MODIFY_ROUTINE'
  | 'CREATE_ROUTINE'

export interface ReplanQuestion {
  key: string
  type: QuestionType
  title: string
}

export interface ReplanAnchorTodo {
  todoId: number
  title: string
  dueDate: string | null
  tagId: number | null
  tagTitle: string | null
  tagColor: string | null
  routineType: string | null
}

export interface ChangedField {
  field: string
  before: string | null
  after: string
}

export interface ReplanOperation {
  action: ReplanActionType
  targetTodoId: number | null
  title: string | null
  dueDate: string | null
  dueTime: string | null
  tagId: number | null
  routineType: string | null
  routineDate: number | null
  changedFields: ChangedField[]
}

export interface ReplanAnswer {
  key: string
  text?: string | null
  selectedTodoIds?: number[] | null
}

export interface RecommendRequest {
  anchorTodoId: number
  reasonCodes: string[]
  answers?: ReplanAnswer[]
  refreshCount?: number
}

export interface RecommendData {
  needsMoreInfo: boolean
  anchorTodo: ReplanAnchorTodo | null
  questions: ReplanQuestion[]
  reasonLabels: string[] | null
  operations: ReplanOperation[]
}

export interface SaveReplanRequest {
  anchorTodoId: number
  reasonCodes: string[]
  acceptedOperations: ReplanOperation[]
}
