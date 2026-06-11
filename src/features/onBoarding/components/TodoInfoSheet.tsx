import { useState } from 'react'
import { cn } from '@/shared/utils/cn'

// types
import {
  type CustomTag,
  ROUTINE_TO_REPEAT,
  REPEAT_OPTIONS,
  TAG_COLORS,
} from '../type/types'
import type { TodoDetail } from '@/shared/types/todo'

// components
import TodoTag from '@/shared/components/TodoTag'
import { getTodoTag } from '@/shared/types/todo'
import DeadlineInput from './DeadlineInput'
import CheckIcon from '@/icons/CheckIcon'
import SubTodoSheet from './SubTodoSheet'
import BottomSheet from '@/shared/components/BottomSheet'
import CloseButtonIcon from '@/icons/CloseButtonIcon'
import RoundEditIcon from '@/icons/RoundEditIcon'
import AddItemIcon from '@/icons/AddItemIcon'

interface TodoInfoSheetProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  todo: TodoDetail
  allTags: CustomTag[]
  onSubTodoAdd: (title: string) => void
  onClick?: () => void
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
  onSubTodoAdd,
  onClick,
}: TodoInfoSheetProps) {
  const [openUnderTodoSheet, setOpenUnderTodoSheet] = useState(false)
  const [openDeleteConfirmSheet, setOpenDeleteConfirmSheet] = useState(false)

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
            style={{ backgroundColor: colorDef.bgColor, color: colorDef.textColor }}
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
  const deadlineTime = todo.dueDate
    ? new Date(todo.dueDate).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : null

  return (
    <>
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="px-5 pt-2 pb-6">
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
          {REPEAT_OPTIONS.map((option) => (
            <div
              key={option}
              className={cn(
                'text-sm font-medium px-5 py-2 rounded-full',
                option === repeatLabel
                  ? 'bg-bluegray-black text-white'
                  : 'bg-bluegray-light text-bluegray-dark',
              )}
            >
              {option}
            </div>
          ))}
        </div>

        {/* 마감 일정 */}
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

        {/* 하위 투두 */}
        <div className="flex items-center justify-between mt-6">
          <SectionLabel>하위 투두</SectionLabel>
          <button onClick={() => setOpenUnderTodoSheet(true)}>
            <AddItemIcon height={24} width={24} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {todo.subTodos.length === 0 ? (
            <span className="text-sm text-bluegray-normal">없음</span>
          ) : (
            todo.subTodos.map((sub) => (
              <div
                key={sub.todoId}
                className="flex items-center gap-3 p-4 border border-bluegray-light-hover rounded-2xl"
              >
                <CheckIcon />
                <span className="text-sm font-medium text-bluegray-black">
                  {sub.title}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <SubTodoSheet
        isOpen={openUnderTodoSheet}
        onClose={() => setOpenUnderTodoSheet(false)}
        onConfirm={(title) => {
          onSubTodoAdd(title)
          setOpenUnderTodoSheet(false)
        }}
        mode="추가"
      />
      {onClick && (
        <div className="px-5 mt-10">
          <button
            onClick={() => setOpenDeleteConfirmSheet(true)}
            className="w-full h-13 bg-bluegray-light flex justify-center items-center rounded-xl text-danger font-semibold text-[14px]"
          >
            투두 삭제
          </button>
        </div>
      )}
    </BottomSheet>

    <BottomSheet
      isOpen={openDeleteConfirmSheet}
      onClose={() => setOpenDeleteConfirmSheet(false)}
    >
      <div className="pt-4 pb-9 px-5 flex flex-col items-center w-full">
        <h3 className="text-xl font-semibold">투두를 삭제하시겠습니까?</h3>
        <div className="flex gap-3 mt-5 w-full">
          <button
            onClick={() => setOpenDeleteConfirmSheet(false)}
            className="flex-1 py-3 rounded-xl bg-bluegray-light text-black font-semibold"
          >
            취소
          </button>
          <button
            onClick={() => {
              setOpenDeleteConfirmSheet(false)
              onClick?.()
            }}
            className="flex-1 py-3 rounded-xl bg-bluegray-light text-danger font-semibold"
          >
            삭제
          </button>
        </div>
      </div>
    </BottomSheet>
    </>
  )
}
