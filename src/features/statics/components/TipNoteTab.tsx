import { useState } from 'react'
import TipStarIcon from '@/icons/TipStarIcon'
import TodoTag from '@/shared/components/TodoTag'
import ClockIcon from '@/icons/ClockIcon'
import { cn } from '@/shared/utils/cn'
import { MonthlyReport, SuggestedTodo } from '@/shared/types/statics'
import StatisticsEmptyState from './StatisticsEmptyState'

interface TipNoteTabProps {
  data: MonthlyReport | null
  isLoading: boolean
}

// ── Day Label colors ──────────────────────────────────
const DAY_LABEL_COLORS: Record<string, string> = {
  D: 'text-[#7EA4F5]',
  M: 'text-[#FFA9A9]',
}

// ── Suggested Todo Item ───────────────────────────────
interface SuggestedTodoProps {
  title: string
  time: string
  category: string
  dayType?: 'D' | 'M'
  checked: boolean
  onToggle: () => void
}

function SuggestedTodoItem({
  title,
  time,
  category,
  dayType,
  checked,
  onToggle,
}: SuggestedTodoProps) {
  return (
    <div className="flex items-center gap-[17px]">
      {/* Checkbox */}
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

      {/* Todo Card */}
      <div className="flex-1 bg-white border border-bluegray-light-hover rounded-2xl p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-bluegray-black">
                {title}
              </span>
              {dayType && (
                <span
                  className={cn(
                    'text-sm font-semibold shrink-0',
                    DAY_LABEL_COLORS[dayType],
                  )}
                >
                  {dayType}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon />
              <span className="text-xs text-bluegray-normal-hover">{time}</span>
            </div>
          </div>
          <div className="shrink-0">
            <TodoTag category={category} />
          </div>
        </div>
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
export default function TipNoteTab({ data, isLoading }: TipNoteTabProps) {
  const aiInsight = data?.aiInsight
  const todos: SuggestedTodo[] = aiInsight?.suggestedTodos ?? []
  const tipMessage = aiInsight?.tipMessage ?? null

  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set())

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

  const isEmpty = !isLoading && !data

  if (isEmpty) {
    return (
      <div className="px-5">
        <StatisticsEmptyState />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* 상단 고정 영역 */}
      <div className="px-5 pt-7">
        {/* Title */}
        <h1 className="text-2xl font-bold leading-[1.3] tracking-[-0.03em]">
          <span className="text-blue-normal">Todo 리스트</span>
          <span className="text-bluegray-black"> 제안</span>
        </h1>

        {/* Tip Card */}
        {tipMessage && (
          <div className="mt-6">
            <TipCard message={tipMessage} />
          </div>
        )}
      </div>

      {/* Todo List */}
      {todos.length > 0 && (
        <div className="px-5 mt-6 flex flex-col gap-4">
          {todos.map((todo, i) => (
            <SuggestedTodoItem
              key={i}
              title={todo.title}
              time={todo.time}
              category={todo.category}
              dayType={todo.dayType}
              checked={checkedIds.has(i)}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="px-5 mt-6 pb-32">
        <div className="flex gap-2">
          <button className="flex-1 h-14 bg-bluegray-light-hover rounded-xl text-sm font-semibold text-bluegray-black">
            추가 없이 끝내기
          </button>
          <button className="flex-1 h-14 bg-bluegray-black rounded-xl text-sm font-semibold text-white">
            투두 추가하기
          </button>
        </div>
      </div>
    </div>
  )
}
