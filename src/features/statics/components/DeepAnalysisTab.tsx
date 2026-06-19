import { useState } from 'react'
import ChevronDownStrokeIcon from '@/icons/ChevronDownStrokeIcon'
import BarChartIcon from '@/icons/BarChartIcon'
import PatternIcon from '@/icons/PatternIcon'
import AIIcon from '@/icons/AIIcon'
import InsightLightIcon from '@/icons/InsightLightIcon'
import TodoTag from '@/shared/components/TodoTag'
import BottomSheet from '@/shared/components/BottomSheet'
import MonthPeaker from '@/features/goal/components/MonthPeaker'
import { MonthlyReport } from '@/shared/types/statics'
import SectionHeader from './SectionHeader'
import StatisticsEmptyState from './StatisticsEmptyState'
import ChartViewToggleIcon from '@/icons/ChartViewToggleIcon'
import ChartViewToggle2Icon from '@/icons/ChartViewToggle2Icon'

interface DeepAnalysisTabProps {
  data: MonthlyReport | null
  isLoading: boolean
  year: number
  month: number
  onMonthChange: (year: number, month: number) => void
}

const CAUSE_COLORS = ['#579DEC', '#70B2FC', '#93C6FF', '#AFD5FF']

// ── Bar Chart ─────────────────────────────────────────
function BarRow({
  label,
  pct,
  color,
  isFirst,
}: {
  label: string
  pct: number
  color: string
  isFirst: boolean
}) {
  return (
    <div className="flex items-center justify-end gap-5">
      <p
        className={`text-sm font-bold text-right w-30.75 ${isFirst ? 'text-bluegray-darker' : 'text-bluegray-dark-hover'}`}
      >
        {label}
      </p>
      <div className="relative min-w-52.5 w-[63%] h-7 shrink-0">
        <div className="absolute inset-0 bg-bluegray-light-hover rounded-sm" />
        <div
          className="absolute left-0 top-0 h-7 rounded-sm flex items-center pl-1"
          style={{ width: `${pct}%`, backgroundColor: color }}
        >
          <span className="text-[10px] pl-1 text-white font-semibold leading-[1.2]">
            {pct}%
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Rank List ─────────────────────────────────────────
function RankItem({
  rank,
  label,
  color,
  count,
}: {
  rank: number
  label: string
  color: string
  count: string
}) {
  const isFirst = rank === 1
  return (
    <div
      className={`flex items-center justify-between px-4 rounded-xl ${
        isFirst
          ? 'bg-blue-light border border-blue-light-active py-[10px]'
          : 'bg-blue-light-60 py-2'
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: color }}
        >
          <span className="text-sm font-bold text-white leading-none">
            {rank}
          </span>
        </div>
        <span
          className={`text-sm ${isFirst ? 'font-bold text-bluegray-darker' : 'font-semibold text-bluegray-dark-active'}`}
        >
          {label}
        </span>
      </div>
      <div
        className="flex items-center justify-center border-[1.5px] rounded-full px-3 py-1 shrink-0"
        style={{ borderColor: color }}
      >
        <span style={{ color }}>{count}</span>
      </div>
    </div>
  )
}

// ── Pattern Table ─────────────────────────────────────
function PatternTable({
  highTag,
  lowTag,
  highDay,
  lowDay,
}: {
  highTag: string | null
  lowTag: string | null
  highDay: string | null
  lowDay: string | null
}) {
  return (
    <div className="border border-bluegray-light-active rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex">
        <div className="bg-bluegray-light w-[119px] h-[29px]" />
        <div className="bg-bluegray-light border-l border-bluegray-light-active flex-1 flex items-center justify-center py-1">
          <span className="text-sm font-semibold text-bluegray-black">
            태그
          </span>
        </div>
        <div className="bg-bluegray-light border-l border-bluegray-light-active flex-1 flex items-center justify-center py-1">
          <span className="text-sm font-semibold text-bluegray-black">
            요일
          </span>
        </div>
      </div>
      <div className="h-px bg-bluegray-light-active" />
      {/* 성공률 높은 */}
      <div className="flex">
        <div className="bg-bluegray-light w-[119px] flex items-center justify-center px-3 py-2.5">
          <span className="text-sm font-medium text-bluegray-dark-active text-center leading-[1.5]">
            성공률 높은
          </span>
        </div>
        <div className="border-l border-bluegray-light-active flex-1 flex items-center justify-center py-2.5">
          {highTag ? (
            <TodoTag category={highTag} />
          ) : (
            <span className="text-sm text-bluegray-normal">-</span>
          )}
        </div>
        <div className="border-l border-bluegray-light-active flex-1 flex items-center justify-center py-2.5">
          <span className="text-sm font-bold text-bluegray-dark-active">
            {highDay ?? '-'}
          </span>
        </div>
      </div>
      <div className="h-px bg-bluegray-light-active" />
      {/* 실패율 높은 */}
      <div className="flex">
        <div className="bg-bluegray-light w-[119px] flex items-center justify-center px-3 py-2.5">
          <span className="text-sm font-medium text-bluegray-dark-active text-center leading-[1.5]">
            실패율 높은
          </span>
        </div>
        <div className="border-l border-bluegray-light-active flex-1 flex items-center justify-center py-2.5">
          {lowTag ? (
            <TodoTag category={lowTag} />
          ) : (
            <span className="text-sm text-bluegray-normal">-</span>
          )}
        </div>
        <div className="border-l border-bluegray-light-active flex-1 flex items-center justify-center py-2.5">
          <span className="text-sm font-bold text-bluegray-dark-active">
            {lowDay ?? '-'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── AI Insight Card ───────────────────────────────────
function AIInsightCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-bluegray-light rounded-xl p-4">
      <div className="flex gap-3 items-start">
        <div className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
          <InsightLightIcon color="#A9AFB9" />
        </div>
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <p className="text-sm font-bold text-bluegray-black leading-normal tracking-[-0.01em]">
            {title}
          </p>
          <p className="text-sm font-medium text-bluegray-dark-active leading-normal tracking-[-0.015em]">
            {body}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── DeepAnalysisTab ───────────────────────────────────
export default function DeepAnalysisTab({
  data,
  isLoading,
  year,
  month,
  onMonthChange,
}: DeepAnalysisTabProps) {
  const [chartView, setChartView] = useState<'bar' | 'list'>('bar')
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const analysis = data?.analysisData
  const aiInsight = data?.aiInsight
  const failureCauses = analysis?.failureCauses ?? []
  const topCause = failureCauses[0]?.cause ?? null

  const causesWithColor = failureCauses.map((c, i) => ({
    ...c,
    color: CAUSE_COLORS[i] ?? '#AFD5FF',
  }))

  const isEmpty = !isLoading && !data

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
          {topCause && (
            <p className="mt-4.25 text-2xl font-bold leading-[1.3] tracking-[-0.03em]">
              <span className="text-bluegray-black">
                이번 달 주된 실패 원인은
              </span>
              <br />
              <span className="text-blue-normal">{topCause}</span>
              <span className="text-bluegray-black">였어요</span>
            </p>
          )}

          <div className="mt-7 flex flex-col gap-10">
            {/* 실패 원인 분포 */}
            {causesWithColor.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <SectionHeader
                    icon={<BarChartIcon />}
                    title="실패 원인 분포"
                  />
                  <div className="flex items-center gap-2">
                    <button onClick={() => setChartView('bar')}>
                      <ChartViewToggleIcon
                        color={chartView === 'bar' ? '#202021' : '#E4E6E9'}
                      />
                    </button>
                    <button onClick={() => setChartView('list')}>
                      <ChartViewToggle2Icon
                        color={chartView === 'list' ? '#202021' : '#E4E6E9'}
                      />
                    </button>
                  </div>
                </div>

                {chartView === 'bar' ? (
                  <div className="flex flex-col gap-3">
                    {causesWithColor.map((item, i) => (
                      <BarRow
                        key={item.cause}
                        label={item.cause}
                        pct={item.percentage}
                        color={item.color}
                        isFirst={i === 0}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {causesWithColor.map((item, i) => (
                      <RankItem
                        key={item.cause}
                        rank={i + 1}
                        label={item.cause}
                        color={item.color}
                        count={`${item.count}회`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 패턴 분석 */}
            <div className="flex flex-col gap-4">
              <SectionHeader icon={<PatternIcon />} title="패턴 분석" />
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-bluegray-dark-active">
                    태그+요일
                  </span>
                  <PatternTable
                    highTag={analysis?.highAchievementTag ?? null}
                    lowTag={analysis?.lowAchievementTag ?? null}
                    highDay={analysis?.highAchievementDay ?? null}
                    lowDay={analysis?.lowAchievementDay ?? null}
                  />
                </div>
              </div>
            </div>

            {/* AI 인사이트 */}
            {aiInsight && aiInsight.insights.length > 0 && (
              <div className="flex flex-col gap-4">
                <SectionHeader icon={<AIIcon />} title="AI 인사이트" />
                <div className="flex flex-col gap-3">
                  {aiInsight.insights.map((item, i) => (
                    <AIInsightCard
                      key={i}
                      title={item.title}
                      body={item.body}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
