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