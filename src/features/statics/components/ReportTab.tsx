import { useState } from 'react'
import ChevronDownStrokeIcon from '@/icons/ChevronDownStrokeIcon'
import TagIcon from '@/icons/TagIcon'
import CalendarSectionIcon from '@/icons/CalendarSectionIcon'
import ReplanIcon from '@/icons/ReplanIcon'
import TodoTag from '@/shared/components/TodoTag'
import BottomSheet from '@/shared/components/BottomSheet'
import MonthPeaker from '@/features/goal/components/MonthPeaker'
import { MonthlyReport } from '@/shared/types/statics'
import SectionHeader from './SectionHeader'
import StatisticsEmptyState from './StatisticsEmptyState'

interface ReportTabProps {
  data: MonthlyReport | null
  isLoading: boolean
  year: number
  month: number
  onMonthChange: (year: number, month: number) => void
}

// ── Donut Chart ───────────────────────────────────────
function DonutChart({ percentage }: { percentage: number }) {
  const r = 80
  const cx = 102
  const cy = 102
  const circumference = 2 * Math.PI * r
  const filled = (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center w-[204px] h-[204px]">
      <svg viewBox="0 0 204 204" width={204} height={204} className="absolute">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#F6F7F8"
          strokeWidth={30}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#579DEC"
          strokeWidth={30}
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-[38px] font-bold text-blue-normal leading-[1.3] tracking-[-0.03em]">
          {percentage}%
        </span>
        <span className="text-base font-medium text-bluegray-darker">
          달성률
        </span>
      </div>
    </div>
  )
}

// ── Info Row ──────────────────────────────────────────
function InfoRow({
  label,
  value,
  isLast,
}: {
  label: string
  value?: React.ReactNode
  isLast?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between py-4 border-t border-bluegray-light-hover ${isLast ? 'border-b' : ''}`}
    >
      <span className="text-sm font-medium text-bluegray-dark-active">
        {label}
      </span>
      {value}
    </div>
  )
}

// ── RePlan Effect Card ────────────────────────────────
function EffectCard({
  label,
  value,
  isBlue,
}: {
  label: string
  value: string
  isBlue?: boolean
}) {
  return (
    <div className="flex-1 bg-bluegray-light rounded-xl px-4 py-2.5 h-20 flex flex-col justify-center items-center gap-1.5">
      <span className="text-sm font-semibold text-bluegray-dark leading-normal tracking-[-0.015em]">
        {label}
      </span>
      <span
        className={`text-xl font-semibold leading-[1.3] tracking-[-0.02em] ${isBlue ? 'text-blue-normal' : 'text-bluegray-darker'}`}
      >
        {value}
      </span>
    </div>
  )
}

// ── ReportTab ─────────────────────────────────────────
export default function ReportTab({
  data,
  isLoading,
  year,
  month,
  onMonthChange,
}: ReportTabProps) {
  const achievementRate = data?.achievementRate ?? 0
  const completedTodos = data?.completedTodos ?? 0
  const totalTodos = data?.totalTodos ?? 0
  const uncompletedTodos = totalTodos - completedTodos
  const prevMonthDiff = data?.prevMonthDiff ?? null
  const replanCount = data?.replanCount ?? 0
  const replanEffect = data?.replanAchievementEffect ?? null
  const analysis = data?.analysisData

  const headlineHighlight =
    prevMonthDiff !== null
      ? prevMonthDiff >= 0
        ? `${prevMonthDiff}% 높였어요`
        : `${Math.abs(prevMonthDiff)}% 낮아졌어요`
      : null

  const headlinePrefix =
    prevMonthDiff !== null ? '지난 달 대비 목표 달성률을' : null

  const isEmpty = !isLoading && !data
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <div className="px-5 pb-32">
      {/* Month Selector */}
      <button
        className="flex items-center gap-1 mt-5"
        onClick={() => setIsPickerOpen(true)}
      >
        <span className="text-base font-bold text-bluegray-black">
          {year}년 {month}월
        </span>
        <ChevronDownStrokeIcon width={24} height={24} color="#202021" />
      </button>

      <BottomSheet isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)}>
        <MonthPeaker
          year={year}
          value={month}
          onClose={() => setIsPickerOpen(false)}
          onConfirm={(y, m) => {
            onMonthChange(y, m)
            setIsPickerOpen(false)
          }}
        />
      </BottomSheet>

      {isEmpty && <StatisticsEmptyState />}

      {!isEmpty && (
        <>
          {/* Headline */}
          {headlinePrefix && headlineHighlight && (
            <p className="mt-4.25 text-2xl font-bold leading-[1.3] tracking-[-0.03em]">
              <span className="text-bluegray-black">{headlinePrefix}</span>
              <br />
              <span
                className={
                  prevMonthDiff !== null && prevMonthDiff >= 0
                    ? 'text-blue-normal'
                    : 'text-danger'
                }
              >
                {headlineHighlight}
              </span>
            </p>
          )}

          {/* Donut Chart */}
          <div className="mt-4.5 flex flex-col items-center">
            <DonutChart percentage={achievementRate} />
            <div className="mt-8 flex items-center gap-7">
              <div className="flex flex-col items-center gap-1 w-21">
                <span className="text-xl font-semibold text-blue-normal tracking-[-0.02em]">
                  {completedTodos}
                </span>
                <span className="text-sm font-medium text-bluegray-dark-hover">
                  달성
                </span>
              </div>
              <div className="w-px h-[23.5px] bg-bluegray-light-active shrink-0" />
              <div className="flex flex-col items-center gap-1 w-[84px]">
                <span className="text-xl font-semibold text-danger tracking-[-0.02em]">
                  {uncompletedTodos}
                </span>
                <span className="text-sm font-medium text-bluegray-dark-hover">
                  미달성
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-8">
            {/* 태그별 */}
            <div className="flex flex-col gap-2">
              <SectionHeader icon={<TagIcon />} title="태그별" />
              <div>
                <InfoRow
                  label="달성 높은 태그"
                  value={
                    analysis?.highAchievementTag ? (
                      <TodoTag category={analysis.highAchievementTag} />
                    ) : undefined
                  }
                />
                <InfoRow
                  label="미달성 높은 태그"
                  value={
                    analysis?.lowAchievementTag ? (
                      <TodoTag category={analysis.lowAchievementTag} />
                    ) : undefined
                  }
                  isLast
                />
              </div>
            </div>

            {/* 요일별 */}
            <div className="flex flex-col gap-2">
              <SectionHeader icon={<CalendarSectionIcon />} title="요일별" />
              <div>
                <InfoRow
                  label="달성 높은 요일"
                  value={
                    analysis?.highAchievementDay ? (
                      <span className="text-sm font-bold text-bluegray-dark-active">
                        {analysis.highAchievementDay}
                      </span>
                    ) : undefined
                  }
                />
                <InfoRow
                  label="미달성 높은 요일"
                  value={
                    analysis?.lowAchievementDay ? (
                      <span className="text-sm font-bold text-bluegray-dark-active">
                        {analysis.lowAchievementDay}
                      </span>
                    ) : undefined
                  }
                  isLast
                />
              </div>
            </div>

            {/* RePlan 효과 */}
            <div className="flex flex-col gap-2">
              <SectionHeader icon={<ReplanIcon />} title="RePlan 효과" />
              <div className="flex gap-2">
                <EffectCard label="사용 횟수" value={`${replanCount}회`} />
                <EffectCard
                  label="달성률 효과"
                  value={replanEffect !== null ? `+${replanEffect}% 상승` : '-'}
                  isBlue
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
