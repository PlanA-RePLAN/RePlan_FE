import { useEffect, useState } from 'react'

// components
import MainButton from '@/shared/components/MainButton'
import Title from '@/shared/components/Title'
import TodoCard from '@/shared/components/TodoCard'
import MenuIcon from '@/icons/MenuIcon'
import RestLeftFillIcon from '@/icons/RestLeftFillIcon'

// utils
import { cn } from '@/shared/utils/cn'
import { getDayTag, formatHHmm } from '../utils'

// api / types
import { getTags } from '@/shared/api/tags'
import type { Tag } from '@/shared/types/tag'
import type { ReplanOperation } from '@/shared/types/replan'

const MAX_REFRESH_COUNT = 3

interface TodoSuggestionProps {
  reasonLabels: string[] | null
  operations: ReplanOperation[]
  refreshCount: number
  isSubmitting: boolean
  onRefresh: () => void
  onFinishWithoutAdd: () => void
  onAccept: () => void
}

const ACTION_LABEL: Record<ReplanOperation['action'], string> = {
  ADD: '추가',
  CREATE_ROUTINE: '추가',
  MODIFY_TODO: '수정',
  MODIFY_ROUTINE: '수정',
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

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    getTags(accessToken).then((res) => {
      setTagMap(new Map((res.data ?? []).map((tag) => [tag.tagId, tag])))
    })
  }, [])

  return (
    <div className="px-5 pt-8 pb-36">
      <div className="flex flex-col gap-3 mb-8">
        <Title>
          <div>다음과 같이</div>
          <div>투두를 제안드려요.</div>
        </Title>
      </div>

      {reasonLabels && reasonLabels.length > 0 && (
        <div className="bg-blue-light rounded-xl p-4 mb-8 flex flex-col gap-1">
          {reasonLabels.map((label, i) => (
            <p key={i} className="font-medium text-sm text-blue-normal">
              {label}
            </p>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MenuIcon />
          <span className="font-semibold text-sm text-bluegray-darker">
            추천 투두
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshCount >= MAX_REFRESH_COUNT || isSubmitting}
          className={cn(
            'ml-auto flex items-center justify-center rounded-full p-1 bg-bluegray-light-hover',
            refreshCount >= MAX_REFRESH_COUNT && 'opacity-40',
          )}
        >
          <RestLeftFillIcon />
        </button>
      </div>

      {operations.map((operation, index) => {
        const changed = new Set(operation.changedFields.map((f) => f.field))
        const tag =
          operation.tagId !== null ? tagMap.get(operation.tagId) : undefined

        return (
          <TodoCard key={index} status="default">
            <TodoCard.Content>
              <TodoCard.Title dayTag={getDayTag(operation.routineType)}>
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-light text-blue-normal">
                    {ACTION_LABEL[operation.action]}
                  </span>
                  {changed.has('title') ? (
                    <span className="text-blue-normal font-semibold">
                      {operation.title}
                    </span>
                  ) : (
                    operation.title
                  )}
                </span>
              </TodoCard.Title>
              {operation.dueTime && (
                <TodoCard.Time>
                  {changed.has('dueTime') ? (
                    <span className="text-blue-normal font-semibold">
                      {formatHHmm(operation.dueTime)}
                    </span>
                  ) : (
                    formatHHmm(operation.dueTime)
                  )}
                </TodoCard.Time>
              )}
            </TodoCard.Content>
            {tag && (
              <TodoCard.Category
                category={tag.title}
                color={changed.has('tag') ? '#579DEC' : tag.color}
              />
            )}
          </TodoCard>
        )
      })}

      <div className="fixed pb-10 pt-6 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <div className="flex gap-3">
          <MainButton
            option="secondary"
            onClick={onFinishWithoutAdd}
            title="반영 없이 끝내기"
            className="flex-1"
          />
          <MainButton
            option={isSubmitting ? 'disabled' : 'primary'}
            onClick={onAccept}
            title={isSubmitting ? '반영하는 중...' : '투두 반영하기'}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
