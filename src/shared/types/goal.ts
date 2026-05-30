export interface Goal {
  id: number
  title: string
  dueDate: string | null
  reference: string | null
}

export interface GoalGroup {
  date: string
  goals: Goal[]
}

export interface RefineGoalRequest {
  goal: string
  deadline: string
  currentLevel?: string
  availableTime?: string
  notes?: string
}

export interface RefineField {
  value: string
  reason: string
}

export interface RefineDeadline {
  date: string | null
  time: string | null
  reason: string
}

export interface RefineNoteItem {
  title: string
  content: string
}

export interface RefineNotes {
  value: RefineNoteItem[]
  reason: string
}

export interface RefineGoalData {
  goal: RefineField
  deadline: RefineDeadline
  currentLevel: RefineField
  availableTime: RefineField
  notes: RefineNotes
}

export interface AiTodoRequest {
  goal: string
  deadlineDate?: string | null
  deadlineTime?: string | null
  currentLevel?: string | null
  availableTime?: string | null
  notes?: string | null
}

export interface AiRecommendedTodo {
  type: 'ONE_TIME' | 'RECURRING'
  title: string
  dueDate: string | null
  dueTime: string | null
  routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null
  routineDate: number | null
}

export interface AiTodoRecommendationData {
  overallReason: string
  todos: AiRecommendedTodo[]
}

export interface CreateGoalTodoItem {
  type: 'ONE_TIME' | 'RECURRING'
  title: string
  dueDate?: string | null
  dueTime?: string | null
  routineType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null
  routineDate?: number | null
  tagId?: number | null
  subTodos?: string[]
}

export interface CreateGoalWithTodosRequest {
  title: string
  dueDate?: string | null
  dueTime?: string | null
  reference?: string | null
  todos: CreateGoalTodoItem[]
}

export interface CreatedTodoResult {
  type: 'ONE_TIME' | 'RECURRING'
  title: string
  todoId: number | null
  routineId: number | null
}

export interface CreateGoalWithTodosData {
  goalId: number
  todos: CreatedTodoResult[]
}
