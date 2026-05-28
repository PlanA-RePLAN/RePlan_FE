export interface Todo {
    todoId: number
    title: string
    dueDate: string | null
    isPinned: boolean
    sortOrder: number
    isCompleted: boolean
    tagId: number | null
    tagTitle: string | null
    tagColor: string | null
    routineType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null
    isOverdue: boolean
}
