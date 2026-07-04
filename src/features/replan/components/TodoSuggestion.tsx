import { useEffect, useState } from 'react'

// components
import MainButton from '@/shared/components/MainButton'
import Title from '@/shared/components/Title'
import TodoCard from '@/shared/components/TodoCard'
import MenuIcon from '@/icons/MenuIcon'
import RestLeftFillIcon from '@/icons/RestLeftFillIcon'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import ChevronLeftIcon from '@/icons/ChevronLeftIcon'
import ChevronRightIcon from '@/icons/ChevronRightIcon'
import ReplanSurveyIcon from '@/icons/ReplanSurveyIcon'
import LoopLeftIcon from '@/icons/LoopLeftIcon'
import CheckBoxIcon from '@/icons/CheckBoxIcon'

// utils
import { cn } from '@/shared/utils/cn'
import { getDayTag, formatHHmm } from '../utils'

// api / types
import { getTags } from '@/shared/api/tags'
import type { Tag } from '@/shared/types/tag'
import type { ChangedField, ReplanOperation } from '@/shared/types/replan'

const MAX_REFRESH_COUNT = 3

const FIELD_LABELS: Record<string, string> = {
  title: '내용',
  dueTime: '시간',
  tag: '태그',
  routineType: '반복',
}

interface TodoSuggestionProps {
  reasonLabels: string[] | null
  operations: ReplanOperation[]
  refreshCount: number
  isSubmitting: boolean
  onRefresh: () => void
  onFinishWithoutAdd: () => void
  onAccept: (selectedOperations: ReplanOperation[]) => void
}

function ChangedFieldRow({ field }: { field: ChangedField }) {
  return (
    <div className="flex gap-3 items-start w-full">
      <span className="flex items-center gap-1 shrink-0 w-11 text-bluegray-normal text-xs font-medium">
        <LoopLeftIcon />
        {FIELD_LABELS[field.field] ?? field.field}
      </span>
      <p className="text-xs text-blue-normal">
        {field.before ?? '없음'} →{' '}
        <span className="font-bold">{field.after}</span>
      </p>
    </div>
  )
}

export default function TodoSuggestion({
  reasonLabels,
  operations,
  refreshCount,
  isSubmitting,
  onRefresh,
  onFinishWithoutAdd,
  onAccept,
}: TodoSuggestionProps) {
  const [tagMap, setTagMap] = useState<Map<number, Tag>>(new Map())
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set())

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    getTags(accessToken).then((res) => {
      setTagMap(new Map((res.data ?? []).map((tag) => [tag.tagId, tag])))
    })
  }, [])

  const allSelected =
    operations.length > 0 && selectedIndexes.size === operations.length

  const toggleAll = () => {
    setSelectedIndexes(
      allSelected ? new Set() : new Set(operations.map((_, i) => i)),
    )
  }

  const toggleOne = (index: number) => {
    setSelectedIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <div className="px-5 pt-8 pb-36">
      <div className="flex flex-col gap-3 mb-8">
        <Title>
          <div>다음과 같은 투두리스트를</div>
          <div>제안드려요.</div>
        </Title>
      </div>

      {reasonLabels && reasonLabels.length > 0 && (
        <div className="bg-blue-light rounded-xl px-4 py-3 mb-4 flex items-start gap-2.5">
          <ReplanSurveyIcon color="#579DEC" />
          <div className="flex flex-col gap-1">
            {reasonLabels.map((label, i) => (
              <p key={i} className="font-medium text-sm text-blue-normal">
                {label}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center mb-4">
        <ChevronDownIcon color="#E6F0FC" width={30} height={30} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MenuIcon />
          <span className="font-bold text-base text-bluegray-darker">
            추천 투두리스트
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshCount >= MAX_REFRESH_COUNT || isSubmitting}
          className={cn(
            'ml-auto flex items-center gap-1 rounded-full px-2 py-1 bg-bluegray-light-hover text-sm font-semibold text-bluegray-normal',
            refreshCount >= MAX_REFRESH_COUNT && 'opacity-40',
          )}
        >
          <RestLeftFillIcon />
          {MAX_REFRESH_COUNT - refreshCount}
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button onClick={toggleAll} className="flex items-center gap-4">
          <span
            className={cn(
              'w-5.5 h-5.5 shrink-0 border-bluegray-light-active border rounded-[5px] flex items-center justify-center',
              allSelected && 'border-none',
            )}
          >
            {allSelected && <CheckBoxIcon color="#579DEC" />}
          </span>
          <span className="text-sm font-medium text-bluegray-dark">
            전체 선택
          </span>
        </button>
        <div className="flex items-center gap-0.5 text-bluegray-normal text-sm font-semibold">
          <ChevronLeftIcon color="#A9AFB9" width={20} height={20} />
          <span>1 / 1</span>
          <ChevronRightIcon />
        </div>
      </div>

      <div className="flex flex-col gap-4 max-h-[391px] overflow-y-auto">
        {operations.map((operation, index) => {
          const changedFields = operation.changedFields
          const hasChanges = changedFields.length > 0
          const changed = new Set(changedFields.map((f) => f.field))
          const tag =
            operation.tagId !== null ? tagMap.get(operation.tagId) : undefined
          const selected = selectedIndexes.has(index)

          return (
            <div key={index} className="flex gap-4 items-center w-full">
              <button
                onClick={() => toggleOne(index)}
                className={cn(
                  'w-5.5 h-5.5 shrink-0 border-bluegray-light-active border rounded-[5px] flex items-center justify-center',
                  selected && 'border-none',
                )}
              >
                {selected && <CheckBoxIcon color="#579DEC" />}
              </button>

              {hasChanges ? (
                <div
                  className="flex-1 min-w-0 rounded-2xl border border-bluegray-light bg-white p-4 flex flex-col gap-2.5 cursor-pointer"
                  onClick={() => toggleOne(index)}
                >
                  <div className="flex items-start justify-between w-full gap-3">
                    <TodoCard.Content>
                      <TodoCard.Title dayTag={getDayTag(operation.routineType)}>
                        {operation.title}
                      </TodoCard.Title>
                      {operation.dueTime && (
                        <TodoCard.Time>
                          {formatHHmm(operation.dueTime)}
                        </TodoCard.Time>
                      )}
                    </TodoCard.Content>
                    {tag && (
                      <TodoCard.Category
                        category={tag.title}
                        color={changed.has('tag') ? '#579DEC' : tag.color}
                      />
                    )}
                  </div>
                  <div className="h-px bg-bluegray-light w-full" />
                  <div className="flex flex-col gap-2">
                    {changedFields.map((field, i) => (
                      <ChangedFieldRow key={i} field={field} />
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="flex-1 min-w-0"
                  onClick={() => toggleOne(index)}
                >
                  <TodoCard status="default">
                    <TodoCard.Content>
                      <TodoCard.Title dayTag={getDayTag(operation.routineType)}>
                        {operation.title}
                      </TodoCard.Title>
                      {operation.dueTime && (
                        <TodoCard.Time>
                          {formatHHmm(operation.dueTime)}
                        </TodoCard.Time>
                      )}
                    </TodoCard.Content>
                    {tag && (
                      <TodoCard.Category
                        category={tag.title}
                        color={tag.color}
                      />
                    )}
                  </TodoCard>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="fixed pb-10 pt-6 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <div className="flex gap-3">
          <MainButton
            option="secondary"
            onClick={onFinishWithoutAdd}
            title="반영 없이 끝내기"
            className="flex-1"
          />
          <MainButton
            option={
              isSubmitting || selectedIndexes.size === 0
                ? 'disabled'
                : 'primary'
            }
            onClick={() =>
              onAccept(operations.filter((_, i) => selectedIndexes.has(i)))
            }
            title={isSubmitting ? '반영하는 중...' : '투두 반영하기'}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
