import Title from '@/shared/components/Title'
import Description from '@/shared/components/Description'
import MainButton from '@/shared/components/MainButton'
import MenuIcon from '@/icons/MenuIcon'
import ListItem from '@/shared/components/ListItem'
import RestLeftFillIcon from '@/icons/ResetLeftFillIcon'
import TodoCard from '@/shared/components/TodoCard'
import CheckBoxIcon from '@/icons/CheckBoxIcon'
import TodoInfoSheet from './components/TodoInfoSheet'
import TodoEditSheet from './components/TodoEditSheet'
import AiLoadingOverlay from './components/AiLoadingOverlay'
import { useState, useMemo, useEffect, useRef } from 'react'
import ChevronLeftIcon from '@/icons/ChevronLeftIcon'
import ChevronRightIcon from '@/icons/ChevronRightIcon'
import { format } from 'date-fns'
import { cn } from '@/shared/utils/cn'
import {
  type ProposedTodo,
  type CustomTag,
  ROUTINE_TO_REPEAT,
  REPEAT_TO_ROUTINE,
  fetchAllTags,
  resolveBackendTagId,
  isCustomTag,
} from './type/types'
import { useOnboardingStore } from '@/store/onboardingStore'
import type { AiRecommendedTodo } from '@/shared/types/goal'
import type { TodoDetail } from '@/shared/types/todo'
import {
  createGoalWithTodos,
  getAiTodoRecommendations,
} from '@/shared/api/goal'
import InfoIcon from '@/icons/InfoIcon'

const MAX_REFRESH_COUNT = 3
const BATCH_ID_STEP = 1000

interface ProposeGoalProps {
  moveNext: () => void
}

const WEEKDAY_NAME_TO_INDEX: Record<string, number> = {
  월: 0,
  화: 1,
  수: 2,
  목: 3,
  금: 4,
  토: 5,
  일: 6,
}

const WEEKDAY_INDEX_TO_NAME: Record<number, string> = {
  0: '월',
  1: '화',
  2: '수',
  3: '목',
  4: '금',
  5: '토',
  6: '일',
}

function formatTime24to12(time: string | null): string {
  if (!time) return ''
  const [hStr, mStr] = time.split(':')
  const h = parseInt(hStr)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${String(h12).padStart(2, '0')}:${mStr} ${period}`
}

// dueTime만 있고 dueDate가 없으면 백엔드가 TODO_DUE_TIME_WITHOUT_DATE로 거부하므로 임시 날짜를 채운다
const FALLBACK_DUE_DATE = '2099-12-31'
function resolveDueDate(dueDate: string | null, dueTime: string | null) {
  if (dueDate) return dueDate
  return dueTime ? FALLBACK_DUE_DATE : null
}

// "HH12:mm AM/PM" 또는 "HH24:mm AM/PM" → "HH:mm" (24h)
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

function toTodoDetail(t: ProposedTodo, allTags: CustomTag[]): TodoDetail {
  const tag = allTags.find((tag) => tag.id === t.selectedTagId)
  return {
    todoId: t.id,
    title: t.title,
    dueDate: t.deadlineDate ? format(t.deadlineDate, 'yyyy-MM-dd') : null,
    dueTime: t.deadlineTime ? timeToHHmm(t.deadlineTime) : null,
    isCompleted: false,
    tagId: null,
    tagTitle: tag && tag.id !== '미선택' ? tag.label : null,
    tagColor: tag && isCustomTag(tag) ? tag.textColor : null,
    routineType: REPEAT_TO_ROUTINE[t.repeat],
    routineDays:
      t.repeat === '위클리'
        ? (t.weeklyDay ?? []).map((d) => WEEKDAY_NAME_TO_INDEX[d] ?? 0)
        : t.repeat === '먼슬리'
          ? (t.monthlyDay ?? null)
          : null,
    subTodos: t.subTodos.map((s) => ({
      todoId: s.id,
      title: s.title,
      isCompleted: false,
    })),
  }
}

function mapAiTodo(
  todo: AiRecommendedTodo,
  index: number,
  idOffset = 0,
): ProposedTodo {
  const repeat = todo.routineType
    ? (ROUTINE_TO_REPEAT[todo.routineType] ?? '없음')
    : '없음'
  const dayTag: 'D' | 'W' | 'M' | undefined =
    todo.routineType === 'MONTHLY'
      ? 'M'
      : todo.routineType === 'WEEKLY'
        ? 'W'
        : todo.routineType === 'DAILY'
          ? 'D'
          : undefined

  const routineDays = todo.routineDays ?? []
  const isRecurring = todo.type === 'RECURRING'
  // RECURRING: routineTime=반복시간, dueDate/dueTime=반복 종료 일정 / ONE_TIME: dueDate/dueTime=마감
  const repeatTime =
    isRecurring && todo.routineTime
      ? formatTime24to12(todo.routineTime)
      : undefined
  return {
    id: idOffset + index + 1,
    title: todo.title,
    time: isRecurring ? (repeatTime ?? '') : formatTime24to12(todo.dueTime),
    dayTag,
    selectedTagId: todo.tagId != null ? String(todo.tagId) : '미선택',
    repeat,
    repeatTime,
    repeatTimeEnabled: repeatTime != null,
    weeklyDay:
      todo.routineType === 'WEEKLY'
        ? routineDays
            .map((i) => WEEKDAY_INDEX_TO_NAME[i])
            .filter((n): n is string => !!n)
        : undefined,
    monthlyDay: todo.routineType === 'MONTHLY' ? routineDays : undefined,
    deadlineDate: todo.dueDate ? new Date(todo.dueDate) : null,
    deadlineTime: todo.dueTime ? formatTime24to12(todo.dueTime) : null,
    subTodos: [],
  }
}

export default function ProposeGoal({ moveNext }: ProposeGoalProps) {
  const aiRecommendation = useOnboardingStore((s) => s.aiRecommendation)
  const goalValue = useOnboardingStore((s) => s.goalValue)
  const deadlineDate = useOnboardingStore((s) => s.deadlineDate)
  const deadlineTime = useOnboardingStore((s) => s.deadlineTime)
  const refineData = useOnboardingStore((s) => s.refineData)
  const setAiRecommendation = useOnboardingStore((s) => s.setAiRecommendation)

  const initialTodos = useMemo(
    () => (aiRecommendation?.todos ?? []).map((t, i) => mapAiTodo(t, i)),
    [aiRecommendation],
  )

  const [todoBatches, setTodoBatches] = useState<ProposedTodo[][]>([
    initialTodos,
  ])
  const [currentPage, setCurrentPage] = useState(0)
  const todos = todoBatches[currentPage] ?? []
  const totalPages = todoBatches.length
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [allTags, setAllTags] = useState<CustomTag[]>([])

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    fetchAllTags(accessToken).then(setAllTags)
  }, [])

  const handleTagDelete = (tagId: string) => {
    setAllTags((prev) => prev.filter((t) => t.id !== tagId))
  }
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [selectedTodo, setSelectedTodo] = useState<ProposedTodo | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const [refreshLoading, setRefreshLoading] = useState(false)
  const refreshRemaining = MAX_REFRESH_COUNT - refreshCount

  const handleRefresh = async () => {
    if (refreshRemaining <= 0 || refreshLoading) return
    setRefreshLoading(true)
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const nextRefreshCount = refreshCount + 1
      const res = await getAiTodoRecommendations(accessToken, {
        goal: goalValue,
        deadlineDate: deadlineDate ? format(deadlineDate, 'yyyy-MM-dd') : null,
        deadlineTime: deadlineTime ? timeToHHmm(deadlineTime) : null,
        solutions: (refineData?.solutions ?? []).map((s) => ({
          question: s.question,
          items: s.items,
        })),
        refreshCount: nextRefreshCount,
      })
      if (res.success && res.data) {
        setAiRecommendation(res.data)
        const newPageIndex = todoBatches.length
        const newBatch = res.data.todos.map((t, i) =>
          mapAiTodo(t, i, newPageIndex * BATCH_ID_STEP),
        )
        setTodoBatches((prev) => [...prev, newBatch])
        setCurrentPage(newPageIndex)
        setRefreshCount(nextRefreshCount)
      }
    } finally {
      setRefreshLoading(false)
    }
  }

  const handleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleTodoClick = (todo: ProposedTodo) => {
    setSelectedTodo(todo)
    setInfoOpen(true)
  }

  const handleEditOpen = () => {
    setInfoOpen(false)
    setEditOpen(true)
  }

  const handleEditConfirm = (updated: ProposedTodo) => {
    setTodoBatches((prev) =>
      prev.map((batch, idx) =>
        idx === currentPage
          ? batch.map((t) => (t.id === updated.id ? updated : t))
          : batch,
      ),
    )
    setSelectedTodo(updated)
    setEditOpen(false)
    setInfoOpen(true)
  }

  const handleTagAdd = (tag: CustomTag) => {
    setAllTags((prev) => [...prev, tag])
  }

  const currentPageIds = todos.map((t) => t.id)
  const isAllSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id))

  const handleSelectAll = () => {
    setSelectedIds((prev) =>
      isAllSelected
        ? prev.filter((id) => !currentPageIds.includes(id))
        : Array.from(new Set([...prev, ...currentPageIds])),
    )
  }

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages) return
    setCurrentPage(page)
  }

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

  const scrollEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleTodoListScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current)
    scrollEndTimeoutRef.current = setTimeout(() => {
      const pageWidth = container.clientWidth
      if (pageWidth === 0) return
      const page = Math.round(container.scrollLeft / pageWidth)
      setCurrentPage((prev) => (prev === page ? prev : page))
    }, 100)
  }

  // 요일 → 인덱스: 월=0, 화=1, 수=2, 목=3, 금=4, 토=5, 일=6
  const DAY_TO_INDEX: Record<string, number> = {
    월: 0,
    화: 1,
    수: 2,
    목: 3,
    금: 4,
    토: 5,
    일: 6,
  }

  const handleSubmit = async () => {
    if (selectedIds.length === 0 || loading) return
    setLoading(true)
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const selectedTodos = todoBatches
        .flat()
        .filter((t) => selectedIds.includes(t.id))
      const isRecurring = (t: ProposedTodo) => t.repeat !== '없음'

      const goalDueDate = deadlineDate
        ? format(deadlineDate, 'yyyy-MM-dd')
        : null
      const goalDueTime = deadlineTime ? timeToHHmm(deadlineTime) : null

      const res = await createGoalWithTodos(accessToken, {
        title: goalValue,
        dueDate: resolveDueDate(goalDueDate, goalDueTime),
        dueTime: goalDueTime,
        todos: selectedTodos.map((t) => {
          const todoDueDate = t.deadlineDate
            ? format(t.deadlineDate, 'yyyy-MM-dd')
            : null
          // 마감(ONE_TIME)/종료(RECURRING) 시간은 deadlineTime만. 반복시간은 routineTime으로 따로 보낸다
          const todoDueTime = timeToHHmm(t.deadlineTime)

          return {
            type: isRecurring(t) ? 'RECURRING' : 'ONE_TIME',
            title: t.title,
            dueDate: resolveDueDate(todoDueDate, todoDueTime),
            dueTime: todoDueTime,
            routineType: isRecurring(t) ? REPEAT_TO_ROUTINE[t.repeat] : null,
            routineTime: isRecurring(t)
              ? timeToHHmm(t.repeatTime ?? null)
              : null,
            routineDays: isRecurring(t)
              ? t.repeat === '위클리'
                ? (t.weeklyDay ?? []).map((d) => DAY_TO_INDEX[d] ?? 0)
                : t.repeat === '먼슬리'
                  ? (t.monthlyDay ?? [1])
                  : null
              : null,
            tagId: resolveBackendTagId(t.selectedTagId),
            subTodos: !isRecurring(t) ? t.subTodos.map((s) => s.title) : null,
            subRoutines: isRecurring(t) ? t.subTodos.map((s) => s.title) : null,
          }
        }),
      })
      if (res.success) {
        moveNext()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col max-h-full overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-3">
        <Title>
          <div>목표에 맞는</div>
          <div>투두리스트를 제안드릴게요.</div>
        </Title>
        <Description>
          <div>마음에 드는 리스트를 골라주세요.</div>
          <div>
            마음에 들지 않는다면{' '}
            <span className="text-blue-normal font-bold">
              투두를 클릭해서 수정
            </span>
            할 수 있어요!
          </div>
        </Description>
      </div>

      <div className="my-4 flex gap-2 items-center">
        <InfoIcon />
        <div className="text-xs font-medium text-bluegray-normal-active">
          <span className="font-bold text-blue-normal">D</span> ·
          <span className="font-bold text-tag2-text">W</span> ·
          <span className="font-bold text-tag6-text">M</span>은
          <span className="font-bold"> 데일리 · 위클리 · 먼슬리</span> 반복
          주기예요
        </div>
      </div>
      <ListItem className="mb-8 border-none">{goalValue}</ListItem>

      <div className="mb-30 min-w-0">
        <div className="flex items-center gap-2 w-full">
          <MenuIcon />
          <div className="font-bold text-[16px] text-bluegray-black">
            추천 투두
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshRemaining <= 0 || refreshLoading}
            className="ml-auto flex gap-1 items-center justify-center rounded-full p-1 bg-bluegray-light-hover disabled:opacity-50"
          >
            <RestLeftFillIcon />
            <div className="text-bluegray-normal font-semibold text-[14px] pr-1 pl-0.5">
              {refreshRemaining}
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between mt-4 mb-3">
          <button onClick={handleSelectAll} className="flex items-center gap-4">
            <span
              className={cn(
                'w-5.5 h-5.5 shrink-0 border-bluegray-light-active border rounded-[5px] flex items-center justify-center',
                isAllSelected && 'border-none',
              )}
            >
              {isAllSelected && <CheckBoxIcon color="#579DEC" />}
            </span>
            <span className="text-sm font-medium text-bluegray-dark-hover">
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
          onScroll={handleTodoListScroll}
          className="flex min-w-0 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {todoBatches.map((batch, pageIndex) => (
            <div
              key={pageIndex}
              className="flex flex-col gap-4 w-full shrink-0 snap-start"
            >
              {batch.map((todo) => {
                const selectedTag = allTags.find(
                  (t) => t.id === todo.selectedTagId,
                )
                return (
                  <div
                    className="flex gap-4.25 items-center max-w-full overflow-hidden"
                    key={todo.id}
                  >
                    <button
                      onClick={(e) => handleSelect(todo.id, e)}
                      className={cn(
                        'w-5.5 h-5.5 shrink-0 border-bluegray-light-active border rounded-[5px] flex items-center justify-center',
                        selectedIds.includes(todo.id) && 'border-none',
                      )}
                    >
                      {selectedIds.includes(todo.id) && (
                        <CheckBoxIcon color="#579DEC" />
                      )}
                    </button>
                    <div
                      className="flex-1"
                      onClick={() => handleTodoClick(todo)}
                    >
                      <TodoCard
                        status={
                          selectedIds.includes(todo.id) ? 'focused' : 'default'
                        }
                      >
                        <TodoCard.Content>
                          <TodoCard.Title dayTag={todo.dayTag}>
                            {todo.title}
                          </TodoCard.Title>
                          <TodoCard.Time>{todo.time}</TodoCard.Time>
                        </TodoCard.Content>
                        <TodoCard.Category
                          category={selectedTag?.label ?? ''}
                          color={selectedTag?.textColor}
                        />
                      </TodoCard>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed left-0 bottom-0 w-full">
        <div className="h-10 bg-linear-to-t from-white to-transparent" />
        <div className="bg-white pb-10 flex gap-2 px-5">
          <MainButton
            option={
              selectedIds.length === 0 || loading ? 'disabled' : 'primary'
            }
            onClick={handleSubmit}
            title={loading ? '저장 중...' : '선택한 투두 추가하기'}
          />
        </div>
      </div>

      {selectedTodo && (
        <>
          <TodoInfoSheet
            isOpen={infoOpen}
            onClose={() => setInfoOpen(false)}
            onEdit={handleEditOpen}
            todo={toTodoDetail(selectedTodo, allTags)}
            repeatTime={
              selectedTodo.repeatTimeEnabled && selectedTodo.repeatTime
                ? timeToHHmm(selectedTodo.repeatTime)
                : null
            }
            allTags={allTags}
          />
          <TodoEditSheet
            isOpen={editOpen}
            onClose={() => {
              setEditOpen(false)
              setInfoOpen(true)
            }}
            onConfirm={handleEditConfirm}
            todo={selectedTodo}
            allTags={allTags}
            onTagAdd={handleTagAdd}
            onTagsLoaded={setAllTags}
            onTagDelete={handleTagDelete}
          />
        </>
      )}

      {refreshLoading && (
        <AiLoadingOverlay message="추천 투두를 다시 준비하고 있어요!" />
      )}
    </div>
  )
}
