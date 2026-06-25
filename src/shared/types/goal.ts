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

export interface GoalExploreRequest {
  goal: string
  deadlineDate?: string | null
  deadlineTime?: string | null
}

export interface ExploreQuestion {
  question: string
  chips: string[]
}

export interface GoalExploreData {
  valid: boolean
  message: string | null
  questions: ExploreQuestion[]
}

export interface QuestionAnswer {
  question: string
  answer: string
}

export interface RefineGoalRequest {
  goal: string
  deadlineDate?: string | null
  deadlineTime?: string | null
  answers: QuestionAnswer[]
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

export interface RefineSolution {
  question: string
  items: RefineNoteItem[]
  reason: string
}

export interface RefineGoalData {
  goal: RefineField
  deadline: RefineDeadline
  solutions: RefineSolution[]
}

export interface SolutionInput {
  question: string
  items: RefineNoteItem[]
}

export interface AiTodoRequest {
  goal: string
  deadlineDate?: string | null
  deadlineTime?: string | null
  solutions?: SolutionInput[]
  refreshCount?: number
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
