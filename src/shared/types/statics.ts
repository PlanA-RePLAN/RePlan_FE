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

export interface AiInsight {
  insights: AiInsightItem[]
  writingTip: string | null
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

// ── 팁노트 (GET /api/tip-notes) ──────────────────────

export type TipNoteAction = 'ADD_TODO' | 'ADD_ROUTINE' | 'MODIFY_ROUTINE'

export type RoutineType = 'DAILY' | 'WEEKLY' | 'MONTHLY'

export interface TipNoteChangedField {
  field: string // title | routineType | routineDays | routineTime | routineEndAt | tag
  before: string | null
  after: string
}

export interface TipNoteItem {
  id: number
  action: TipNoteAction
  title: string
  tagName: string | null
  tagColor: string | null
  todoDueAt: string | null // ADD_TODO 전용, ISO 8601
  routineEndAt: string | null // 루틴 카드 전용, 무기한이면 null
  routineTime: string | null // 루틴 카드 전용, "HH:mm:ss"
  routineType: RoutineType | null
  routineDays: number[] | null // WEEKLY: 요일 인덱스(월=0…일=6), MONTHLY: 일자(1~31)
  changedFields: TipNoteChangedField[]
}

export interface TipNote {
  noteId: number
  year: number
  month: number
  tip: string
  items: TipNoteItem[] // 최신 팁노트가 아니면(지난 달) 항상 빈 배열
}
