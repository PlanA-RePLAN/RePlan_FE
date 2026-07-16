import { useEffect, useRef, useState } from 'react'

// components
import MainButton from '@/shared/components/MainButton'
import Title from '@/shared/components/Title'
import TodoCard from '@/shared/components/TodoCard'
import MenuIcon from '@/icons/MenuIcon'
import RestLeftFillIcon from '@/icons/ResetLeftFillIcon'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import ChevronLeftIcon from '@/icons/ChevronLeftIcon'
import ChevronRightIcon from '@/icons/ChevronRightIcon'
import ReplanSurveyIcon from '@/icons/ReplanSurveyIcon'
import CheckBoxIcon from '@/icons/CheckBoxIcon'
import LoofIcon from '@/icons/LoofIcon'

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
  dueDate: '기간',
  tag: '태그',
  routineType: '반복',
}

interface TodoSuggestionProps {
  reasonLabels: string[] | null
  operationBatches: ReplanOperation[][]
  currentPage: number
  onPageChange: (page: number) => void
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
        <LoofIcon width={16} height={16} color="#A9AFB9" />
        {FIELD_LABELS[field.field] ?? field.field}
      </span>
      <p className="text-xs text-blue-normal">
        {field.before ?? '없음'} →{' '}
        <span className="font-bold">{field.after}</span>
      </p>
    </div>
  )
}

function operationKey(pageIndex: number, index: number) {
  return `${pageIndex}-${index}`
}

export default function TodoSuggestion({
  reasonLabels,
  operationBatches,
  currentPage,
  onPageChange,
  refreshCount,
  isSubmitting,
  onRefresh,
  onFinishWithoutAdd,
  onAccept,
}: TodoSuggestionProps) {
  const [tagMap, setTagMap] = useState<Map<number, Tag>>(new Map())
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalPages = operationBatches.length
  const currentPageOperations = operationBatches[currentPage] ?? []

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    getTags(accessToken).then((res) => {
      setTagMap(new Map((res.data ?? []).map((tag) => [tag.tagId, tag])))
    })
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const target = container.children[currentPage] as HTMLElement | undefined
    target?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    })
  }, [currentPage])

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current)
    scrollEndTimeoutRef.current = setTimeout(() => {
      const pageWidth = container.clientWidth
      if (pageWidth === 0) return
      const page = Math.round(container.scrollLeft / pageWidth)
      onPageChange(page)
    }, 100)
  }

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages) return
    onPageChange(page)
  }

  const currentPageKeys = currentPageOperations.map((_, i) =>
    operationKey(currentPage, i),
  )
  const allSelected =
    currentPageKeys.length > 0 &&
    currentPageKeys.every((key) => selectedKeys.has(key))

  const toggleAll = () => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        currentPageKeys.forEach((key) => next.delete(key))
      } else {
        currentPageKeys.forEach((key) => next.add(key))
      }
      return next
    })
  }

  const toggleOne = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
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
        {totalPages > 1 && (
          <div className="flex items-center gap-0.5 text-bluegray-normal text-sm font-semibold">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="disabled:opacity-40"
            >
              <ChevronLeftIcon color="#A9AFB9" width={20} height={20} />
            </button>
            <span className="w-8 text-center">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="disabled:opacity-40"
            >
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex min-w-0 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {operationBatches.map((batch, pageIndex) => (
          <div
            key={pageIndex}
            className="flex flex-col gap-4 w-full shrink-0 snap-start max-h-[391px] overflow-y-auto"
          >
            {batch.map((operation, index) => {
              const changedFields = operation.changedFields
              const hasChanges = changedFields.length > 0
              const changed = new Set(changedFields.map((f) => f.field))
              const tag =
                operation.tagId !== null
                  ? tagMap.get(operation.tagId)
                  : undefined
              const key = operationKey(pageIndex, index)
              const selected = selectedKeys.has(key)

              return (
                <div key={key} className="flex gap-4 items-center w-full">
                  <button
                    onClick={() => toggleOne(key)}
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
                      onClick={() => toggleOne(key)}
                    >
                      <div className="flex items-start justify-between w-full gap-3">
                        <TodoCard.Content>
                          <TodoCard.Title
                            dayTag={getDayTag(operation.routineType)}
                          >
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
                      onClick={() => toggleOne(key)}
                    >
                      <TodoCard status="default">
                        <TodoCard.Content>
                          <TodoCard.Title
                            dayTag={getDayTag(operation.routineType)}
                          >
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
        ))}
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
              isSubmitting || selectedKeys.size === 0 ? 'disabled' : 'primary'
            }
            onClick={() =>
              onAccept(
                operationBatches.flatMap((batch, pageIndex) =>
                  batch.filter((_, index) =>
                    selectedKeys.has(operationKey(pageIndex, index)),
                  ),
                ),
              )
            }
            title={isSubmitting ? '반영하는 중...' : '투두 반영하기'}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
