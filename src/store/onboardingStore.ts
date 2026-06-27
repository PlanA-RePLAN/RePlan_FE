import { create } from 'zustand'
import type {
  RefineGoalData,
  AiTodoRecommendationData,
} from '@/shared/types/goal'
import type { SurveyContent } from '@/features/onBoarding/components/SurveyCard'

// 종료 날짜를 선택하지 않았을 때 deadline 필드가 빈 값으로 API에 전송되는 것을
// 막기 위한 기본값 (먼 미래로 설정해 "마감 없음"을 의미)
export const NO_DEADLINE_DATE = new Date(2099, 11, 31)

interface OnboardingState {
  // raw API response
  refineData: RefineGoalData | null
  aiRecommendation: AiTodoRecommendationData | null

  // parsed values for AskQuestion
  goalValue: string
  deadlineDate: Date | null
  deadlineTime: string | null
  currentLevel: SurveyContent
  availableTime: SurveyContent
  notes: SurveyContent

  setRefineData: (data: RefineGoalData) => void
  setAiRecommendation: (data: AiTodoRecommendationData) => void
  setGoalValue: (v: string) => void
  setDeadlineDate: (d: Date | null) => void
  setDeadlineTime: (t: string | null) => void
  setCurrentLevel: (v: SurveyContent) => void
  setAvailableTime: (v: SurveyContent) => void
  setNotes: (v: SurveyContent) => void
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
  refineData: null,
  aiRecommendation: null,
  goalValue: '',
  deadlineDate: NO_DEADLINE_DATE,
  deadlineTime: null,
  currentLevel: '',
  availableTime: '',
  notes: '',

  setRefineData: (data) => {
    set({
      refineData: data,
      deadlineDate: data.deadline.date ? new Date(data.deadline.date) : null,
      deadlineTime: parseTime24to12(data.deadline.time),
      currentLevel: data.currentLevel.value,
      availableTime: data.availableTime.value,
      notes:
        data.notes.value.length > 0
          ? data.notes.value.map((n) => ({
              title: n.title,
              description: n.content,
            }))
          : '',
    })
  },

  setAiRecommendation: (data) => set({ aiRecommendation: data }),
  setGoalValue: (v) => set({ goalValue: v }),
  setDeadlineDate: (d) => set({ deadlineDate: d }),
  setDeadlineTime: (t) => set({ deadlineTime: t }),
  setCurrentLevel: (v) => set({ currentLevel: v }),
  setAvailableTime: (v) => set({ availableTime: v }),
  setNotes: (v) => set({ notes: v }),
}))
