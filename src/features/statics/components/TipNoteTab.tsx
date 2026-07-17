import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TipStarIcon from '@/icons/TipStarIcon'
import ChevronDownStrokeIcon from '@/icons/ChevronDownStrokeIcon'
import TodoTag from '@/shared/components/TodoTag'
import ClockIcon from '@/icons/ClockIcon'
import BottomSheet from '@/shared/components/BottomSheet'
import MonthPeaker from '@/features/goal/components/MonthPeaker'
import { cn } from '@/shared/utils/cn'
import {
  RoutineType,
  TipNote,
  TipNoteChangedField,
  TipNoteItem,
} from '@/shared/types/statics'
import { applyTipNote, dismissTipNote } from '@/shared/api/statics'
import { useProfileStore } from '@/store/profileStore'
import StatisticsEmptyState from './StatisticsEmptyState'

interface TipNoteTabProps {
  data: TipNote | null
  isLoading: boolean
  year: number
  month: number
  onMonthChange: (year: number, month: number) => void
  onRefresh: () => void
}

// ── 표시 포맷 헬퍼 ─────────────────────────────────────

const DAY_LABEL_COLORS: Record<string, string> = {
  D: 'text-[#7EA4F5]',
  W: 'text-[#8AC2A2]',
  M: 'text-[#FFA9A9]',
}

const ROUTINE_TYPE_BADGE: Record<RoutineType, 'D' | 'W' | 'M'> = {
  DAILY: 'D',
  WEEKLY: 'W',
  MONTHLY: 'M',
}

const ROUTINE_TYPE_LABEL: Record<string, string> = {
  DAILY: '데일리',
  WEEKLY: '위클리',
  MONTHLY: '먼슬리',
}

const WEEKDAY_NAMES = ['월', '화', '수', '목', '금', '토', '일']

/** "23:00:00" 또는 "23:00" → "11:00 PM" */
function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const suffix = h < 12 ? 'AM' : 'PM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`
}

/** ISO 일시("2026-07-20T23:00:00") → "11:00 PM" */
function formatDateTime(iso: string): string {
  return formatTime(iso.split('T')[1] ?? '00:00')
}

/** 카드에 표시할 시간: 새 투두는 마감일시, 루틴은 반복 시각 */
function itemTime(item: TipNoteItem): string | null {
  if (item.action === 'ADD_TODO')
    return item.todoDueAt ? formatDateTime(item.todoDueAt) : null
  return item.routineTime ? formatTime(item.routineTime) : null
}

/** 반복 날짜 배열 문자열("[0, 2, 4]")을 타입에 맞게 사람 말로 ("월·수·금" / "3일·20일") */
function formatDays(raw: string, type: RoutineType | null): string {
  const nums = raw.match(/\d+/g)?.map(Number)
  if (!nums || nums.length === 0) return raw
  if (type === 'WEEKLY') return nums.map((n) => WEEKDAY_NAMES[n] ?? n).join('·')
  if (type === 'MONTHLY') return nums.map((n) => `${n}일`).join('·')
  return nums.join('·')
}

const DIFF_LABELS: Record<string, string> = {
  title: '내용',
  routineTime: '시간',
  tag: '태그',
  routineType: '반복',
  routineDays: '반복 날짜',
  routineEndAt: '종료일',
}

/** diff 값(before/after)을 필드 종류에 맞게 표시용으로 변환 */
function formatDiffValue(
  field: string,
  value: string | null,
  daysType: RoutineType | null,
): string {
  if (value === null || value === '없음') return '없음'
  switch (field) {
    case 'routineType':
      return ROUTINE_TYPE_LABEL[value] ?? value
    case 'routineTime':
      return formatTime(value)
    case 'routineDays':
      return formatDays(value, daysType)
    case 'routineEndAt':
      return value.split('-').join('.')
    default:
      return value
  }
}

// ── 변경 내역 한 줄 (수정 카드의 "변경된 사항만 표시") ──
function ChangedFieldRow({
  change,
  item,
}: {
  change: TipNoteChangedField
  item: TipNoteItem
}) {
  // 반복 날짜는 변경 전후의 반복 타입이 다를 수 있어 각각의 타입 기준으로 변환한다.
  const beforeType =
    item.changedFields.find((c) => c.field === 'routineType')?.before ?? null
  const before = formatDiffValue(
    change.field,
    change.before,
    change.field === 'routineDays'
      ? ((beforeType as RoutineType | null) ?? item.routineType)
      : null,
  )
  const after = formatDiffValue(
    change.field,
    change.after,
    change.field === 'routineDays' ? item.routineType : null,
  )
  return (
    <div className="flex items-center gap-2 text-xs">
      <svg
        width="12"
        height="12"
        viewBox="0 0 22 22"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M7.66667 17.6667L5 15L7.66667 12.3333L8.6 13.3L7.56667 14.3333H14.3333V11.6667H15.6667V15.6667H7.56667L8.6 16.7L7.66667 17.6667ZM6.33333 10.3333V6.33333H14.4333L13.4 5.3L14.3333 4.33333L17 7L14.3333 9.66667L13.4 8.7L14.4333 7.66667H7.66667V10.3333H6.33333Z"
          fill="#A9AFB9"
        />
      </svg>
      <span className="text-bluegray-normal shrink-0 w-13">
        {DIFF_LABELS[change.field] ?? change.field}
      </span>
      <span className="text-blue-normal font-medium min-w-0">
        {before} → {after}
      </span>
    </div>
  )
}

// ── 추천 카드 1장 ─────────────────────────────────────
function SuggestedTodoItem({
  item,
  checked,
  onToggle,
  readonly,
}: {
  item: TipNoteItem
  checked?: boolean
  onToggle?: () => void
  readonly?: boolean
}) {
  const badge = item.routineType ? ROUTINE_TYPE_BADGE[item.routineType] : null
  const time = itemTime(item)

  return (
    <div className="flex items-center gap-[17px]">
      {/* Checkbox (완료 화면에서는 숨김) */}
      {!readonly && (
        <button
          onClick={onToggle}
          className={cn(
            'shrink-0 w-[22px] h-[22px] rounded-[5px] border border-bluegray-light-active flex items-center justify-center',
            checked && 'bg-blue-normal border-blue-normal',
          )}
        >
          {checked && (
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
              <path
                d="M1 4L4.5 7.5L11 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}

      {/* Todo Card */}
      <div className="flex-1 bg-white border border-bluegray-light-hover rounded-2xl p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-bluegray-black">
                {item.title}
              </span>
              {badge && (
                <span
                  className={cn(
                    'text-sm font-semibold shrink-0',
                    DAY_LABEL_COLORS[badge],
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
            {time && (
              <div className="flex items-center gap-1">
                <ClockIcon />
                <span className="text-xs text-bluegray-normal-hover">
                  {time}
                </span>
              </div>
            )}
          </div>
          {item.tagName && (
            <div className="shrink-0">
              <TodoTag category={item.tagName} color={item.tagColor} />
            </div>
          )}
        </div>

        {/* 변경된 사항만 표시 (루틴 수정 카드) */}
        {item.changedFields.length > 0 && (
          <div className="mt-3 pt-3 border-t border-bluegray-light-hover flex flex-col gap-1.5">
            {item.changedFields.map((change) => (
              <ChangedFieldRow key={change.field} change={change} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Tip Card ──────────────────────────────────────────
function TipCard({ message }: { message: string }) {
  return (
    <div className="bg-bluegray-light rounded-xl p-4">
      <div className="flex gap-3 items-start">
        <div className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
          <TipStarIcon color="#579DEC" />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="text-sm font-bold text-bluegray-black leading-[1.5] tracking-[-0.01em]">
            투두리스트 작성 팁
          </p>
          <p className="text-sm font-medium text-bluegray-dark-active leading-[1.5] tracking-[-0.015em]">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── TipNoteTab ────────────────────────────────────────
type Mode = 'view' | 'applied' | 'dismissed'

export default function TipNoteTab({
  data,
  isLoading,
  year,
  month,
  onMonthChange,
  onRefresh,
}: TipNoteTabProps) {
  const navigate = useNavigate()
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set())
  const { name: nickname } = useProfileStore()
  const [mode, setMode] = useState<Mode>('view')
  const [resultItems, setResultItems] = useState<TipNoteItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 월을 바꾸면 처음 상태로
  useEffect(() => {
    setMode('view')
    setCheckedIds(new Set())
  }, [year, month])

  const items = data?.items ?? []

  const toggle = (id: number) =>
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  const handleApply = async () => {
    if (!data || checkedIds.size === 0 || isSubmitting) return
    setIsSubmitting(true)
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const res = await applyTipNote(accessToken, data.noteId, [...checkedIds])
      setResultItems(res.data?.appliedItems ?? [])
      setMode('applied')
      onRefresh() // 남은 카드 목록 갱신 (완료 화면은 mode로 유지됨)
    } catch {
      alert('반영에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDismiss = async () => {
    if (!data || isSubmitting) return
    setIsSubmitting(true)
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      await dismissTipNote(accessToken, data.noteId)
      setResultItems(items)
      setMode('dismissed')
      onRefresh()
    } catch {
      alert('처리에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEmpty = !isLoading && !data

  // ── 완료 화면 (반영함 / 반영 없이 끝냄) ──
  if (mode !== 'view') {
    return (
      <div className="flex flex-col px-5">
        <h1 className="pt-7 text-2xl font-bold leading-[1.4] tracking-[-0.03em] text-bluegray-black">
          {mode === 'applied' ? (
            <>
              내 <span className="text-blue-normal">Todo 리스트</span>에
              추가했어요.
              <br />
              다음 달도 응원할게요!
            </>
          ) : (
            <>
              투두를 추가하지 않았어요.
              <br />
              앞으로의 투두도 응원할게요!
            </>
          )}
        </h1>

        <div className="mt-8 flex flex-col gap-4">
          {resultItems.map((item) => (
            <SuggestedTodoItem key={item.id} item={item} readonly />
          ))}
        </div>

        <div className="mt-10 pb-32">
          <button
            onClick={() => navigate('/')}
            className="w-full h-14 bg-bluegray-normal rounded-xl text-sm font-semibold text-white"
          >
            홈화면으로
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col px-5 pb-32">
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

      {!isEmpty && data && (
        <>
          {/* Title */}
          <h1 className="pt-4 text-2xl font-bold leading-[1.3] tracking-[-0.03em]">
            {nickname && (
              <span className="text-bluegray-black">{nickname}님을 위한 </span>
            )}
            <span className="text-blue-normal">Todo 리스트</span>
            <span className="text-bluegray-black"> 제안</span>
          </h1>

          {/* Tip Card */}
          <div className="mt-6">
            <TipCard message={data.tip} />
          </div>

          {/* 추천 카드 목록 — 최신 팁노트에서 남은 카드만 내려온다 */}
          {items.length > 0 && (
            <div className="mt-6 flex flex-col gap-4">
              {items.map((item) => (
                <SuggestedTodoItem
                  key={item.id}
                  item={item}
                  checked={checkedIds.has(item.id)}
                  onToggle={() => toggle(item.id)}
                />
              ))}
            </div>
          )}

          {/* Buttons — 반영할 카드가 있을 때만 */}
          {items.length > 0 && (
            <div className="mt-6">
              <div className="flex gap-2">
                <button
                  onClick={handleDismiss}
                  disabled={isSubmitting}
                  className="flex-1 h-14 bg-bluegray-light-hover rounded-xl text-sm font-semibold text-bluegray-black disabled:opacity-50"
                >
                  반영 없이 끝내기
                </button>
                <button
                  onClick={handleApply}
                  disabled={isSubmitting || checkedIds.size === 0}
                  className="flex-1 h-14 bg-bluegray-black rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                >
                  투두 반영하기
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
