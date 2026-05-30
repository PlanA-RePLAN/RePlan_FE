import Title from '@/shared/components/Title'
import Description from '@/shared/components/Description'
import MainButton from '@/shared/components/MainButton'
import ListItem from '@/shared/components/ListItem'
import GoalIcon from '@/icons/GoalIcon'
import CalendarClearSharpIcon from '@/icons/CalendarClearSharpIcon'
import ClockIcon from '@/icons/ClockIcon'
import SurveyCard, {
  type SurveyContent,
} from '@/features/onBoarding/components/SurveyCard'
import TrendingUpIcon from '@/icons/TrendingUpIcon'
import MenuIcon from '@/icons/MenuIcon'
import DeadlineInput from '@/features/onBoarding/components/DeadlineInput'
import { useState } from 'react'
import { format } from 'date-fns'
import { useOnboardingStore } from '@/store/onboardingStore'
import { getAiTodoRecommendations } from '@/shared/api/goal'

function surveyContentToString(content: SurveyContent): string | undefined {
  if (typeof content === 'string') return content.trim() || undefined
  if (content.length === 0) return undefined
  return content.map((item) => `${item.title}: ${item.description}`).join('\n')
}

function timeToHHmm(time: string | null): string | null {
  if (!time) return null
  const [timePart, period] = time.trim().split(' ')
  if (!period) return timePart
  const [hStr, mStr] = timePart.split(':')
  let h = parseInt(hStr)
  if (h > 12) return `${String(h).padStart(2, '0')}:${mStr}`
  if (period === 'AM') {
    h = h === 12 ? 0 : h
  } else {
    h = h === 12 ? 12 : h + 12
  }
  return `${String(h).padStart(2, '0')}:${mStr}`
}

export default function AskQuestion({ moveNext }: { moveNext: () => void }) {
  const store = useOnboardingStore()

  const [deadlineDate, setDeadlineDate] = useState<Date | null>(
    store.deadlineDate,
  )
  const [deadlineTime, setDeadlineTime] = useState<string | null>(
    store.deadlineTime,
  )
  const [useDeadLineDate, setUseDeadLineDate] = useState(
    store.deadlineDate !== null,
  )
  const [useDeadLineTime, setUseDeadLineTime] = useState(
    store.deadlineTime !== null,
  )
  const [currLevel, setCurrLevel] = useState<SurveyContent>(store.currentLevel)
  const [canUseTime, setCanUseTime] = useState<SurveyContent>(
    store.availableTime,
  )
  const [specialNote, setSpecialNote] = useState<SurveyContent>(store.notes)
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    setLoading(true)
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const res = await getAiTodoRecommendations(accessToken, {
        goal: store.goalValue,
        deadlineDate:
          useDeadLineDate && deadlineDate
            ? format(deadlineDate, 'yyyy-MM-dd')
            : null,
        deadlineTime:
          useDeadLineTime && deadlineTime ? timeToHHmm(deadlineTime) : null,
        currentLevel: surveyContentToString(currLevel),
        availableTime: surveyContentToString(canUseTime),
        notes: surveyContentToString(specialNote),
      })
      if (res.success && res.data) {
        store.setAiRecommendation(res.data)
        moveNext()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3">
        <Title>이렇게 정리했어요!</Title>
        <Description>수정하고 싶은 항목을 눌러주세요.</Description>
      </div>
      <div className="flex gap-2 mt-8">
        <GoalIcon colored={false} />
        <div className="font-medium">목표</div>
      </div>
      <ListItem className="mt-2 mb-8 text-bluegray-black">
        {store.goalValue}
      </ListItem>
      <div className="flex gap-2 text-bluegray-black items-center font-medium">
        <CalendarClearSharpIcon width={20} height={20} color="#3B3D41" />
        마감기한
      </div>

      <DeadlineInput
        date={deadlineDate}
        time={deadlineTime}
        useDate={useDeadLineDate}
        useTime={useDeadLineTime}
        onUseDateChange={setUseDeadLineDate}
        onUseTimeChange={setUseDeadLineTime}
        onDateChange={(d) => setDeadlineDate(d)}
        onTimeChange={(t) => setDeadlineTime(t)}
      />

      <SurveyCard
        icon={<TrendingUpIcon />}
        label="현재 수준"
        content={currLevel}
        reason={store.refineData?.currentLevel.reason ?? ''}
        onEdit={(newContent) => setCurrLevel(newContent)}
      />
      <SurveyCard
        icon={<ClockIcon />}
        label="투자 가능 시간"
        content={canUseTime}
        reason={store.refineData?.availableTime.reason ?? ''}
        onEdit={(newContent) => setCanUseTime(newContent)}
      />
      <SurveyCard
        icon={<MenuIcon />}
        label="특이사항"
        content={specialNote}
        reason={store.refineData?.notes.reason ?? ''}
        onEdit={(newContent) => setSpecialNote(newContent)}
      />

      <div className="h-45" />
      <div className="fixed pb-13 pt-10 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <MainButton
          option={loading ? 'disabled' : 'primary'}
          onClick={handleNext}
          title={loading ? '분석 중...' : '다음으로'}
          className="mt-10"
        />
      </div>
    </div>
  )
}
