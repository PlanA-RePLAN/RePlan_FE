import { create } from 'zustand'
import type {
  ExploreQuestion,
  RefineGoalData,
  AiTodoRecommendationData,
} from '@/shared/types/goal'

// 종료 날짜를 선택하지 않았을 때 deadline 필드가 빈 값으로 API에 전송되는 것을
// 막기 위한 기본값 (먼 미래로 설정해 "마감 없음"을 의미)
export const NO_DEADLINE_DATE = new Date(2099, 11, 31)

interface OnboardingState {
  // raw API response
  questions: ExploreQuestion[]
  refineData: RefineGoalData | null
  aiRecommendation: AiTodoRecommendationData | null

  // parsed values
  goalValue: string
  deadlineDate: Date | null
  deadlineTime: string | null

  setQuestions: (questions: ExploreQuestion[]) => void
  setRefineData: (data: RefineGoalData) => void
  setAiRecommendation: (data: AiTodoRecommendationData) => void
  setGoalValue: (v: string) => void
  setDeadlineDate: (d: Date | null) => void
  setDeadlineTime: (t: string | null) => void
}

function parseTime24to12(time: string | null): string | null {
  if (!time) return null
  const [hStr, mStr] = time.split(':')
  const h = parseInt(hStr)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${String(h12).padStart(2, '0')}:${mStr} ${period}`
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  questions: [],
  refineData: null,
  aiRecommendation: null,
  goalValue: '',
  deadlineDate: NO_DEADLINE_DATE,
  deadlineTime: null,

  setQuestions: (questions) => set({ questions }),

  setRefineData: (data) => {
    set({
      refineData: data,
      deadlineDate: data.deadline.date ? new Date(data.deadline.date) : null,
      deadlineTime: parseTime24to12(data.deadline.time),
    })
  },

  setAiRecommendation: (data) => set({ aiRecommendation: data }),
  setGoalValue: (v) => set({ goalValue: v }),
  setDeadlineDate: (d) => set({ deadlineDate: d }),
  setDeadlineTime: (t) => set({ deadlineTime: t }),
}))
