import ChevronDownStrokeIcon from '@/icons/ChevronDownStrokeIcon'
import BarChartIcon from '@/icons/BarChartIcon'
import PatternIcon from '@/icons/PatternIcon'
import AIIcon from '@/icons/AIIcon'
import InsightLightIcon from '@/icons/InsightLightIcon'
import TodoTag from '@/shared/components/TodoTag'
import StarCircleIcon from '@/icons/StarCircleIcon'
import SectionHeader from './SectionHeader'

// ── Bar Chart ─────────────────────────────────────────
const FAILURE_CAUSES = [
  { label: '컨디션 난조', pct: 37, color: '#579DEC' },
  { label: '목표 개선 필요', pct: 25, color: '#70B2FC' },
  { label: '기타', pct: 20, color: '#93C6FF' },
  { label: '심리적 저항', pct: 18, color: '#AFD5FF' },
]

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

// ── Pattern Table ─────────────────────────────────────
function PatternTable() {
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
          <TodoTag category="Study" />
        </div>
        <div className="border-l border-bluegray-light-active flex-1 flex items-center justify-center py-2.5">
          <span className="text-sm font-bold text-bluegray-dark-active">
            월요일
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
          <TodoTag category="Project" />
        </div>
        <div className="border-l border-bluegray-light-active flex-1 flex items-center justify-center py-2.5">
          <span className="text-sm font-bold text-bluegray-dark-active">
            수요일
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Cause Chip ────────────────────────────────────────
function CauseChip({
  title,
  tag,
  day,
  cause,
}: {
  title: string
  tag: string
  day?: string
  cause: string
}) {
  return (
    <div className="border border-bluegray-light-active rounded-xl px-4 py-4 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <StarCircleIcon />
          <span className="text-sm font-medium text-bluegray-dark-active">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <TodoTag category={tag} />
          {day && (
            <span className="text-sm font-bold text-bluegray-dark-active">
              {day}
            </span>
          )}
          <span className="text-sm font-bold text-bluegray-dark-active">
            {cause}
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
export default function DeepAnalysisTab() {
  return (
    <div className="px-5 pb-32">
      {/* Month Selector */}
      <button className="flex items-center gap-1 mt-5">
        <span className="text-base font-bold text-bluegray-black">
          2026년 5월
        </span>
        <ChevronDownStrokeIcon width={24} height={24} color="#202021" />
      </button>

      {/* Headline */}
      <p className="mt-4.25 text-2xl font-bold leading-[1.3] tracking-[-0.03em]">
        <span className="text-bluegray-black">이번 달 주된 실패 원인은</span>
        <br />
        <span className="text-blue-normal">컨디션 난조</span>
        <span className="text-bluegray-black">였어요</span>
      </p>

      <div className="mt-7 flex flex-col gap-10">
        {/* 실패 원인 분포 */}
        <div className="flex flex-col gap-4">
          <SectionHeader icon={<BarChartIcon />} title="실패 원인 분포" />
          <div className="flex flex-col gap-3">
            {FAILURE_CAUSES.map((item, i) => (
              <BarRow
                key={item.label}
                label={item.label}
                pct={item.pct}
                color={item.color}
                isFirst={i === 0}
              />
            ))}
          </div>
        </div>

        {/* 패턴 분석 */}
        <div className="flex flex-col gap-4">
          <SectionHeader icon={<PatternIcon />} title="패턴 분석" />
          <div className="flex flex-col gap-6">
            {/* 태그+요일 */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-bluegray-dark-active">
                태그+요일
              </span>
              <PatternTable />
            </div>
            {/* 원인 조합 */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-bluegray-dark-active">
                원인 조합
              </span>
              <div className="flex flex-col gap-3">
                <CauseChip
                  title="실패율 높은 원인 + 태그"
                  tag="Study"
                  cause="심리적 저항"
                />
                <CauseChip
                  title="실패율 높은 원인 + 요일 + 태그"
                  tag="Study"
                  day="수요일"
                  cause="심리적 저항"
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI 인사이트 */}
        <div className="flex flex-col gap-4">
          <SectionHeader icon={<AIIcon />} title="AI 인사이트" />
          <div className="flex flex-col gap-3">
            <AIInsightCard
              title="Study 태그와 Study 태그 투두를 함께 진행 시 성공률이 하락해요"
              body="한 가지 분류의 태그를 몰아서 하기 보다, 하루 계획에 다양한 종류의 투두를 구성해보는 거 어떨까요?"
            />
            <AIInsightCard
              title="수요일에는 3개 이상의 투두를 달성하지 못했어요"
              body="수요일에 정기적으로 스케줄이 바쁘거나 일정이 있는 것으로 추측돼요. 수요일이 데드라인이더라도 목표 달성률이 높은 월요일에 미리 할 일을 처리해 보는 거 어떨까요?"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
