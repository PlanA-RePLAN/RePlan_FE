export interface FailureCause {
  reason: string
  count: number
  rate: number
}

export interface DayAchievement {
  day: string
  rate: number
}

export interface TagAchievement {
  title: string
  color: string | null
  rate: number
}

export interface PatternCombination {
  reason: string
  tag: string
  day: string | null
  count: number
}

export interface AnalysisData {
  topFailureReason: string | null
  failureDistribution: FailureCause[]
  bestAchievementTag: TagAchievement | null
  worstAchievementTag: TagAchievement | null
  bestAchievementDay: DayAchievement | null
  worstAchievementDay: DayAchievement | null
  patternCombinations: PatternCombination[]
}

export interface AiInsightItem {
  summary: string
  detail: string
}

export interface SuggestedTodo {
  title: string
  time: string
  category: string
  dayType?: 'D' | 'M'
}

export interface AiInsight {
  insights: AiInsightItem[]
  writingTip: string | null
  suggestedTodos?: SuggestedTodo[]
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
