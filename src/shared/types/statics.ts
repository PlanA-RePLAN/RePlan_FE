export interface FailureCause {
  cause: string
  percentage: number
  count: number
}

export interface AnalysisData {
  failureCauses: FailureCause[]
  highAchievementTag: string | null
  lowAchievementTag: string | null
  highAchievementDay: string | null
  lowAchievementDay: string | null
}

export interface AiInsightItem {
  title: string
  body: string
}

export interface SuggestedTodo {
  title: string
  time: string
  category: string
  dayType?: 'D' | 'M'
}

export interface AiInsight {
  tipMessage: string | null
  insights: AiInsightItem[]
  suggestedTodos: SuggestedTodo[]
}

export interface MonthlyReport {
  year: number
  month: number
  totalTodos: number
  completedTodos: number
  achievementRate: number
  prevMonthDiff: number | null
  replanCount: number
  replanAchievementEffect: number | null
  analysisData: AnalysisData | null
  aiInsight: AiInsight | null
}
