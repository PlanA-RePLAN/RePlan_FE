import { cn } from '@/shared/utils/cn'

// types
import { type CustomTag, ROUTINE_TO_REPEAT, TAG_COLORS } from '../type/types'
import type { SubTodoDetail, TodoDetail } from '@/shared/types/todo'

// components
import TodoTag from '@/shared/components/TodoTag'
import { getTodoTag } from '@/shared/types/todo'
import DeadlineInput from './DeadlineInput'
import InfoRow from './InfoRow'
import CheckIcon from '@/icons/CheckIcon'
import GoalColoredIcon from '@/icons/GoalColoredIcon'
import BottomSheet from '@/shared/components/BottomSheet'
import CloseButtonIcon from '@/icons/CloseButtonIcon'
import RoundEditIcon from '@/icons/RoundEditIcon'
import CalendarClearSharpIcon from '@/icons/CalendarClearSharpIcon'
import CalendarWithClockIcon from '@/icons/CalendarWithClockIcon'
import { format } from 'date-fns'

interface TodoInfoSheetProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  todo: TodoDetail
  allTags: CustomTag[]
  // 하위 투두 완료 토글. 안 넘기면(온보딩 등) 표시 전용. 제목 수정/삭제는 수정 시트에서 한다
  onSubTodoToggle?: (sub: SubTodoDetail) => void
  onClick?: () => void
  // 루틴 회차의 반복 시간('HH:mm'). 넘어올 때만 "반복 시간" 줄을 그린다.
  repeatTime?: string | null
  // 반복 시간 줄의 라벨 (그날만 시간이 바뀐 회차면 다른 문구로)
  repeatTimeLabel?: string
}

// 'HH:mm' → 'hh:MM AM/PM'
function to12Hour(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':')
  const h = parseInt(hStr)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${String(h12).padStart(2, '0')}:${mStr} ${period}`
}

// 요일 인덱스(0=월 … 6=일) → 라벨
const WEEKDAY_LABEL: Record<number, string> = {
  0: '월',
  1: '화',
  2: '수',
  3: '목',
  4: '금',
  5: '토',
  6: '일',
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[16px] font-medium text-bluegray-black mb-2">
      {children}
    </p>
  )
}

export default function TodoInfoSheet({
  isOpen,
  onClose,
  onEdit,
  todo,
  allTags,
  onSubTodoToggle,
  onClick,
  repeatTime,
  repeatTimeLabel = '반복 시간',
}: TodoInfoSheetProps) {
  const renderTag = () => {
    const tagTitle = todo.tagTitle ?? ''
    if (!tagTitle || tagTitle === '미선택') return null

    if (getTodoTag(tagTitle)) {
      return <TodoTag category={tagTitle} />
    }

    if (todo.tagColor) {
      const colorDef = TAG_COLORS.find(
        (c) => c.id === todo.tagColor!.toLowerCase(),
      )
      if (colorDef) {
        return (
          <div
            style={{
              backgroundColor: colorDef.bgColor,
              color: colorDef.textColor,
            }}
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold"
          >
            {tagTitle}
          </div>
        )
      }
    }

    const custom = allTags.find((t) => t.label === tagTitle)
    if (!custom) return null
    return (
      <div
        style={{ backgroundColor: custom.bgColor, color: custom.textColor }}
        className="inline-block px-4 py-1 rounded-full text-xs font-semibold"
      >
        {custom.label}
      </div>
    )
  }

  const repeatLabel = todo.routineType
    ? ROUTINE_TO_REPEAT[todo.routineType]
    : '없음'

  const deadlineDate = todo.dueDate ? new Date(todo.dueDate) : null
  const deadlineTime = todo.dueTime ? to12Hour(todo.dueTime) : null
  const repeatTimeValue = repeatTime ? to12Hour(repeatTime) : null

  const isRoutine = todo.routineType !== null
  const endDateLabel = deadlineDate
    ? format(deadlineDate, 'yyyy년 MM월 dd일')
    : null
  const repeatDaysLabel =
    todo.routineType === 'WEEKLY' && todo.routineDays?.length
      ? todo.routineDays
          .map((i) => WEEKDAY_LABEL[i])
          .filter(Boolean)
          .join(', ')
      : todo.routineType === 'MONTHLY' && todo.routineDays?.length
        ? `${todo.routineDays.join(', ')}일`
        : null

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        {/* 헤더는 고정, 아래 내용만 스크롤 */}
        <div className="max-h-[80vh] flex flex-col">
          <div className="px-5 pt-2 shrink-0">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-5">
              <button onClick={onClose}>
                <CloseButtonIcon />
              </button>
              <span className="text-lg font-bold text-bluegray-black">
                투두 정보
              </span>
              <button
                onClick={onEdit}
                className="w-7 h-7 bg-bluegray-black rounded-full flex items-center justify-center"
              >
                <RoundEditIcon />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto">
            <div className="px-5 pb-6">
              {/* 타이틀 */}
              <SectionLabel>타이틀</SectionLabel>
              <div className="bg-bluegray-light rounded-xl px-4 py-3 text-sm font-medium text-bluegray-black mb-6">
                {todo.title}
              </div>

              {/* 태그 분류 */}
              <SectionLabel>태그 분류</SectionLabel>
              <div className="mb-6">{renderTag()}</div>

              {/* 반복 여부 */}
              <SectionLabel>반복 여부</SectionLabel>
              <div className="flex gap-2 mb-5">
                <div
                  className={cn(
                    'text-sm font-medium px-5 py-2 rounded-full',
                    'bg-bluegray-black text-white',
                  )}
                >
                  {repeatLabel}
                </div>
              </div>

              {isRoutine ? (
                <>
                  {/* 반복 설정 (루틴 전체) — 보여줄 값이 하나도 없으면 섹션 통째로 숨긴다 */}
                  {(repeatDaysLabel || repeatTimeValue) && (
                    <>
                      <SectionLabel>반복 설정</SectionLabel>
                      <div className="flex flex-col border-t border-bluegray-light-hover mb-6">
                        {repeatDaysLabel && (
                          <InfoRow
                            icon={<CalendarClearSharpIcon fill="white" />}
                            label="반복 날짜"
                            value={repeatDaysLabel}
                          />
                        )}
                        {repeatTimeValue && (
                          <InfoRow
                            icon={<CalendarWithClockIcon fill="white" />}
                            label={repeatTimeLabel}
                            value={repeatTimeValue}
                          />
                        )}
                      </div>
                    </>
                  )}

                  {/* 종료 일정 (루틴 전체) */}
                  <SectionLabel>종료 일정</SectionLabel>
                  <div className="flex flex-col border-t border-bluegray-light-hover">
                    <InfoRow
                      icon={<CalendarClearSharpIcon fill="white" />}
                      label="종료 날짜"
                      value={endDateLabel}
                    />
                    <InfoRow
                      icon={<CalendarWithClockIcon fill="white" />}
                      label="종료 시간"
                      value={deadlineTime}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* 마감 일정 (일회성 투두) */}
                  <SectionLabel>마감 일정</SectionLabel>
                  <DeadlineInput
                    date={deadlineDate}
                    time={deadlineTime}
                    useDate={deadlineDate !== null}
                    useTime={deadlineTime !== null}
                    notUseToggle={true}
                    onUseDateChange={() => {}}
                    onUseTimeChange={() => {}}
                  />
                </>
              )}

              {/* 하위 투두 (추가는 수정 시트에서, 여기서는 조회·수정·삭제만) */}
              <div className="flex items-center justify-between mt-6">
                <SectionLabel>하위 투두</SectionLabel>
              </div>
              <div className="flex flex-col gap-2">
                {todo.subTodos.length === 0 ? (
                  <span className="text-sm text-bluegray-normal">없음</span>
                ) : (
                  todo.subTodos.map((sub, i) => (
                    <div
                      key={sub.todoId ?? `sub-${i}`}
                      className="flex items-center gap-3 p-4 border border-bluegray-light-hover rounded-2xl"
                    >
                      {/* 완료 토글 — 부모 투두가 완료된 상태면 버튼 자체를 숨긴다 */}
                      {!todo.isCompleted && (
                        <div
                          onClick={
                            onSubTodoToggle
                              ? (e) => {
                                  e.stopPropagation()
                                  onSubTodoToggle(sub)
                                }
                              : undefined
                          }
                        >
                          {sub.isCompleted ? (
                            <GoalColoredIcon />
                          ) : (
                            <CheckIcon />
                          )}
                        </div>
                      )}
                      <span className="flex-1 text-sm font-medium text-bluegray-black">
                        {sub.title}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {onClick && (
              <div className="px-5 mt-10 pb-6">
                <button
                  onClick={onClick}
                  className="w-full h-13 bg-bluegray-light flex justify-center items-center rounded-xl text-danger font-semibold text-[14px]"
                >
                  투두 삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </BottomSheet>
    </>
  )
}
