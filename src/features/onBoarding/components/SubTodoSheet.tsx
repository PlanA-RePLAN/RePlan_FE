import BottomSheet from '@/shared/components/BottomSheet'
import BottomSheetHeader from '@/shared/components/BottomSheetHeader'
import Input from '@/shared/components/Input'
import { useState, useEffect } from 'react'

interface DownTodoSheetProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (title: string) => void
  mode: '수정' | '추가'
}
export default function SubTodoSheet({
  isOpen,
  onClose,
  onConfirm,
  mode,
}: DownTodoSheetProps) {
  const [todo, setTodo] = useState('')

  useEffect(() => {
    if (isOpen) setTodo('')
  }, [isOpen])

  const handleConfirm = () => {
    const trimmed = todo.trim()
    if (!trimmed) return
    onConfirm(trimmed)
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col px-4 pb-110 gap-4">
        <BottomSheetHeader
          title={`하위 투두 ${mode}`}
          onClose={onClose}
          onConfirm={handleConfirm}
          confirmDisabled={!todo.trim()}
        />
        <Input maxLength={40} showCount="focus" value={todo} setValue={setTodo}>
          <Input.Label option="primary">타이틀</Input.Label>
          <Input.Field height={49} placeholder="하위 투두를 입력해주세요" />
        </Input>
        {mode === '수정' && (
          <button className="w-full flex items-center py-3.5 justify-center rounded-2xl bg-bluegray-light text-danger">
            하위 투두 삭제
          </button>
        )}
      </div>
    </BottomSheet>
  )
}
