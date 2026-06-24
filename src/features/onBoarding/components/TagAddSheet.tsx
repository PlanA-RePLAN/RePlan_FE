import BottomSheet from '@/shared/components/BottomSheet'
import BottomSheetHeader from '@/shared/components/BottomSheetHeader'
import Input from '@/shared/components/Input'
import { useState } from 'react'
import { type CustomTag, TAG_COLORS } from '../type/types'
import { cn } from '@/shared/utils/cn'
import { createTag } from '@/shared/api/tags'

interface TagAddSheetProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (tag: CustomTag) => void
}

export default function TagAddSheet({
  isOpen,
  onClose,
  onConfirm,
}: TagAddSheetProps) {
  const [tagName, setTagName] = useState('')
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setTagName('')
    setSelectedColorId(null)
    onClose()
  }

  const handleConfirm = async () => {
    if (!tagName.trim() || !selectedColorId || loading) return
    const color = TAG_COLORS.find((c) => c.id === selectedColorId)!
    setLoading(true)
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const res = await createTag(accessToken, {
        title: tagName.trim(),
        color: color.textColor,
      })
      if (res.success && res.data) {
        onConfirm({
          id: String(res.data.tagId),
          label: res.data.title,
          bgColor: color.bgColor,
          textColor: color.textColor,
        })
        setTagName('')
        setSelectedColorId(null)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <div className="px-5 pt-2 pb-4">
        <BottomSheetHeader
          title="태그 추가"
          onClose={handleClose}
          onConfirm={handleConfirm}
          confirmDisabled={!tagName.trim() || !selectedColorId || loading}
        />

        <p className="text-sm font-medium text-bluegray-black mb-2">
          태그 이름
        </p>
        <Input
          value={tagName}
          setValue={setTagName}
          maxLength={7}
          showCount="always"
        >
          <Input.Field height={49} placeholder="태그 이름을 입력해주세요" />
          <Input.Bottom>
            <div />
            <Input.Count />
          </Input.Bottom>
        </Input>

        <p className="text-sm font-medium text-bluegray-black mt-5 mb-3">
          색상 선택
        </p>
        <div className="flex gap-3 mb-100">
          {TAG_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColorId(color.id)}
              className={cn(
                'w-10 h-10 rounded-full transition-all',
                selectedColorId === color.id && 'ring-4 ring-bluegray-normal',
              )}
              style={{ backgroundColor: color.textColor }}
            />
          ))}
        </div>
      </div>
    </BottomSheet>
  )
}
