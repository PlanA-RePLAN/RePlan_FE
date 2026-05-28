import { useState } from 'react'

// types
import { type ProposedTodo, type CustomTag } from '../type/types'

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
  todo: ProposedTodo
  allTags: CustomTag[]
  onSubTodoAdd: (title: string) => void
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
}: TodoInfoSheetProps) {
  const [openUnderTodoSheet, setOpenUnderTodoSheet] = useState(false)

  const renderTag = () => {
    if (getTodoTag(todo.selectedTagId)) {
      return <TodoTag category={todo.selectedTagId} />
    }
    const custom = allTags.find((t) => t.id === todo.selectedTagId)
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

  return (
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
        <div className="mb-5">
          <div className="inline-block bg-bluegray-black text-white text-sm font-medium px-5 py-2 rounded-full">
            {todo.repeat}
          </div>
        </div>

        {/* 마감 일정 */}
        <SectionLabel>마감 일정</SectionLabel>
        <DeadlineInput
          date={todo.deadlineDate}
          time={todo.deadlineTime}
          useDate={todo.deadlineDate !== null}
          useTime={todo.deadlineTime !== null}
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
                key={sub.id}
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
    </BottomSheet>
  )
}
