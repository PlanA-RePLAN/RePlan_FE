import { useState, useEffect } from 'react'
import BottomSheet from '@/shared/components/BottomSheet'
import BottomSheetHeader from '@/shared/components/BottomSheetHeader'
import Input from '@/shared/components/Input'
import AddItemIcon from '@/icons/AddItemIcon'
import { cn } from '@/shared/utils/cn'
import {
  type ProposedTodo,
  type CustomTag,
  type RepeatType,
  type SubTodo,
} from '../type/types'
import TagAddSheet from './TagAddSheet'
import DeadlineInput from './DeadlineInput'
import TodoTag from '@/shared/components/TodoTag'
import CheckIcon from '@/icons/CheckIcon'
import ClearIcon from '@/icons/ClearIcon'
import DailyTimeSetting from './DailyTimeSetting'
import WeeklyDaySetting from './WeeklyDaySetting'
import MonthlySetting from './MonthlySetting'
import SubTodoSheet from './SubTodoSheet'

const REPEAT_OPTIONS: RepeatType[] = ['없음', '데일리', '위클리', '먼슬리']

interface TodoEditSheetProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (updated: ProposedTodo) => void
  todo: ProposedTodo
  allTags: CustomTag[]
  onTagAdd: (tag: CustomTag) => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[16px] font-medium text-bluegray-black mb-2">
      {children}
    </p>
  )
}

export default function TodoEditSheet({
  isOpen,
  onClose,
  onConfirm,
  todo,
  allTags,
  onTagAdd,
}: TodoEditSheetProps) {
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editTagId, setEditTagId] = useState(todo.selectedTagId)
  const [editRepeat, setEditRepeat] = useState<RepeatType>(todo.repeat)
  const [useDeadlineDate, setUseDeadlineDate] = useState(
    todo.deadlineDate !== null,
  )
  const [useDeadlineTime, setUseDeadlineTime] = useState(
    todo.deadlineTime !== null,
  )
  const [editDeadlineDate, setEditDeadlineDate] = useState<Date | null>(
    todo.deadlineDate,
  )
  const [editDeadlineTime, setEditDeadlineTime] = useState<string | null>(
    todo.deadlineTime,
  )
  const [dailyTimeEnabled, setDailyTimeEnabled] = useState(
    todo.repeatTimeEnabled ?? false,
  )
  const [dailyTime, setDailyTime] = useState(todo.repeatTime ?? '08:00 AM')
  const [weeklyDay, setWeeklyDay] = useState(todo.weeklyDay ?? '월')
  const [weeklyTimeEnabled, setWeeklyTimeEnabled] = useState(
    todo.repeatTimeEnabled ?? false,
  )
  const [weeklyTime, setWeeklyTime] = useState(todo.repeatTime ?? '08:00 AM')
  const [monthlyDay, setMonthlyDay] = useState(
    todo.monthlyDay ?? new Date().getDate(),
  )
  const [monthlyTimeEnabled, setMonthlyTimeEnabled] = useState(
    todo.repeatTimeEnabled ?? false,
  )
  const [monthlyTime, setMonthlyTime] = useState(todo.repeatTime ?? '08:00 AM')
  const [editSubTodos, setEditSubTodos] = useState<SubTodo[]>(todo.subTodos)
  const [addingSubTodo, setAddingSubTodo] = useState(false)
  const [tagAddOpen, setTagAddOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setEditTitle(todo.title)
      setEditTagId(todo.selectedTagId)
      setEditRepeat(todo.repeat)
      setUseDeadlineDate(todo.deadlineDate !== null)
      setUseDeadlineTime(todo.deadlineTime !== null)
      setEditDeadlineDate(todo.deadlineDate)
      setEditDeadlineTime(todo.deadlineTime)
      setDailyTimeEnabled(todo.repeatTimeEnabled ?? false)
      setDailyTime(todo.repeatTime ?? '08:00 AM')
      setWeeklyDay(todo.weeklyDay ?? '월')
      setWeeklyTimeEnabled(todo.repeatTimeEnabled ?? false)
      setWeeklyTime(todo.repeatTime ?? '08:00 AM')
      setMonthlyDay(todo.monthlyDay ?? new Date().getDate())
      setMonthlyTimeEnabled(todo.repeatTimeEnabled ?? false)
      setMonthlyTime(todo.repeatTime ?? '08:00 AM')
      setEditSubTodos(todo.subTodos)
      setAddingSubTodo(false)
    }
  }, [isOpen, todo])

  const handleConfirm = () => {
    onConfirm({
      ...todo,
      title: editTitle,
      selectedTagId: editTagId,
      repeat: editRepeat,
      repeatTimeEnabled:
        editRepeat === '데일리'
          ? dailyTimeEnabled
          : editRepeat === '위클리'
            ? weeklyTimeEnabled
            : editRepeat === '먼슬리'
              ? monthlyTimeEnabled
              : undefined,
      repeatTime:
        editRepeat === '데일리' && dailyTimeEnabled
          ? dailyTime
          : editRepeat === '위클리' && weeklyTimeEnabled
            ? weeklyTime
            : editRepeat === '먼슬리' && monthlyTimeEnabled
              ? monthlyTime
              : undefined,
      weeklyDay: editRepeat === '위클리' ? weeklyDay : undefined,
      monthlyDay: editRepeat === '먼슬리' ? monthlyDay : undefined,
      deadlineDate: useDeadlineDate ? editDeadlineDate : null,
      deadlineTime: useDeadlineTime ? editDeadlineTime : null,
      subTodos: editSubTodos,
    })
  }

  const handleTagAdded = (tag: CustomTag) => {
    onTagAdd(tag)
    setEditTagId(tag.id)
    setTagAddOpen(false)
  }

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        <div className="px-5 pt-2 pb-6 overflow-y-auto max-h-[80vh]">
          <BottomSheetHeader
            title="투두 수정"
            onClose={onClose}
            onConfirm={handleConfirm}
            confirmDisabled={!editTitle.trim()}
          />

          {/* 타이틀 */}
          <SectionLabel>타이틀</SectionLabel>
          <Input value={editTitle} setValue={setEditTitle}>
            <Input.Field height={49} placeholder="투두 제목을 입력해주세요" />
          </Input>

          {/* 태그 분류 */}
          <div className="flex items-center justify-between mt-5 mb-2">
            <SectionLabel>태그 분류</SectionLabel>
            <button onClick={() => setTagAddOpen(true)}>
              <AddItemIcon width={24} height={24} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {allTags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-3">
                <button
                  onClick={() => setEditTagId(tag.id)}
                  className="w-5 h-5 rounded-full border-2 border-bluegray-light-active flex items-center justify-center shrink-0"
                >
                  {editTagId === tag.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-bluegray-black" />
                  )}
                </button>
                <TodoTag category={tag.label} />
                {tag.label !== '미선택' && (
                  <button>
                    <ClearIcon />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 반복 여부 */}
          <div className="mt-5">
            <SectionLabel>반복 여부</SectionLabel>
          </div>
          <div className="flex overflow-hidden gap-1">
            {REPEAT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setEditRepeat(opt)}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium rounded-full transition-all',
                  editRepeat === opt
                    ? 'bg-bluegray-black text-white'
                    : 'text-bluegray-dark bg-bluegray-light',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          {editRepeat === '데일리' && (
            <DailyTimeSetting
              checked={dailyTimeEnabled}
              onCheckedChange={setDailyTimeEnabled}
              time={dailyTime}
              onTimeChange={setDailyTime}
            />
          )}
          {editRepeat === '위클리' && (
            <WeeklyDaySetting
              selectedDay={weeklyDay}
              onDayChange={setWeeklyDay}
              timeEnabled={weeklyTimeEnabled}
              onTimeEnabledChange={setWeeklyTimeEnabled}
              time={weeklyTime}
              onTimeChange={setWeeklyTime}
            />
          )}
          {editRepeat === '먼슬리' && (
            <MonthlySetting
              selectedDay={monthlyDay}
              onDayChange={setMonthlyDay}
              timeEnabled={monthlyTimeEnabled}
              onTimeEnabledChange={setMonthlyTimeEnabled}
              time={monthlyTime}
              onTimeChange={setMonthlyTime}
            />
          )}

          {/* 마감 일정 */}
          <div className="mt-5">
            <SectionLabel>마감 일정</SectionLabel>
          </div>
          <DeadlineInput
            date={editDeadlineDate}
            time={editDeadlineTime}
            useDate={useDeadlineDate}
            useTime={useDeadlineTime}
            onUseDateChange={setUseDeadlineDate}
            onUseTimeChange={setUseDeadlineTime}
            onDateChange={setEditDeadlineDate}
            onTimeChange={setEditDeadlineTime}
          />

          {/* 하위 투두 */}
          <div className="flex items-center justify-between mt-5 mb-3">
            <SectionLabel>하위 투두</SectionLabel>
            <button onClick={() => setAddingSubTodo(true)}>
              <AddItemIcon width={24} height={24} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {editSubTodos.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center gap-3 p-4 border border-bluegray-light-hover rounded-2xl"
              >
                <CheckIcon />
                <span className="text-sm font-medium text-bluegray-black">
                  {sub.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>

      <SubTodoSheet
        isOpen={addingSubTodo}
        onClose={() => setAddingSubTodo(false)}
        onConfirm={(title) => {
          setEditSubTodos((prev) => [...prev, { id: Date.now(), title }])
          setAddingSubTodo(false)
        }}
        mode="추가"
      />

      <TagAddSheet
        isOpen={tagAddOpen}
        onClose={() => setTagAddOpen(false)}
        onConfirm={handleTagAdded}
      />
    </>
  )
}
