import ChevronDownStrokeIcon from '@/icons/ChevronDownStrokeIcon'
import TagIcon from '@/icons/TagIcon'
import CalendarSectionIcon from '@/icons/CalendarSectionIcon'
import ReplanIcon from '@/icons/ReplanIcon'
import TodoTag from '@/shared/components/TodoTag'
import SectionHeader from './SectionHeader'

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
export default function ReportTab() {
  return (
    <div className="px-5 pb-32">
      {/* Month Selector — 19px from tab bar */}
      <button className="flex items-center gap-1 mt-5">
        <span className="text-base font-bold text-bluegray-black">
          2026년 5월
        </span>
        <ChevronDownStrokeIcon width={24} height={24} color="#202021" />
      </button>

      {/* Headline — 17px below month */}
      <p className="mt-4.25 text-2xl font-bold leading-[1.3] tracking-[-0.03em]">
        <span className="text-bluegray-black">지난 달 대비 목표 달성률을</span>
        <br />
        <span className="text-blue-normal">11% 높였어요</span>
      </p>

      {/* Donut Chart — 18px below headline */}
      <div className="mt-4.5 flex flex-col items-center">
        <DonutChart percentage={46} />

        {/* Stats — 30px below chart */}
        <div className="mt-8 flex items-center gap-7">
          <div className="flex flex-col items-center gap-1 w-21">
            <span className="text-xl font-semibold text-blue-normal tracking-[-0.02em]">
              13
            </span>
            <span className="text-sm font-medium text-bluegray-dark-hover">
              달성
            </span>
          </div>
          <div className="w-px h-[23.5px] bg-bluegray-light-active shrink-0" />
          <div className="flex flex-col items-center gap-1 w-[84px]">
            <span className="text-xl font-semibold text-danger tracking-[-0.02em]">
              7
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
              value={<TodoTag category="Study" />}
            />
            <InfoRow
              label="미달성 높은 태그"
              value={<TodoTag category="Project" />}
              isLast
            />
          </div>
        </div>

        {/* 요일별 */}
        <div className="flex flex-col gap-2">
          <SectionHeader icon={<CalendarSectionIcon />} title="요일별" />
          <div>
            <InfoRow label="달성 높은 요일" />
            <InfoRow label="미달성 높은 요일" isLast />
          </div>
        </div>

        {/* RePlan 효과 */}
        <div className="flex flex-col gap-2">
          <SectionHeader icon={<ReplanIcon />} title="RePlan 효과" />
          <div className="flex gap-2">
            <EffectCard label="사용 횟수" value="4회" />
            <EffectCard label="달성률 효과" value="+23% 상승" isBlue />
          </div>
        </div>
      </div>
    </div>
  )
}
