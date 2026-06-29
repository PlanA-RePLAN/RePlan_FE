export interface Routine {
    routineId: number
    todoId: number | null
    title: string
    dueDate: string | null
    routineTime: string | null
    routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY'
    routineDate: number | null
    tagId: number | null
    tagTitle: string | null
    tagColor: string | null
    goalId: number | null
}

export interface CreateRoutineRequest {
  title: string
  routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  dueDate?: string | null
  routineTime?: string | null
  routineDate?: number | null
  tagId?: number | null
  goalId?: number | null
}