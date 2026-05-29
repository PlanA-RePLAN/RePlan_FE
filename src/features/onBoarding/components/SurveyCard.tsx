import { useState } from 'react'
import InfoIcon from '@/icons/InfoIcon'
import ReplanSurveyIcon from '@/icons/ReplanSurveyIcon'
import WandStar from '@/icons/WandStar'
import BottomSheet from '@/shared/components/BottomSheet'
import BottomSheetHeader from '@/shared/components/BottomSheetHeader'
import Input from '@/shared/components/Input'
import ChecvronRightIcon from '@/icons/ChevronLeftIcon'

export type ContentItem = { title: string; description: string }
export type SurveyContent = string | ContentItem[]

interface SurveyCardProps {
  icon: React.ReactNode
  label: string
  content: SurveyContent
  reason?: string
  onEdit?: (newContent: SurveyContent) => void
}

const INITIAL_VISIBLE = 3

export default function SurveyCard({
  icon,
  label,
  content,
  reason,
  onEdit,
}: SurveyCardProps) {
  const [infoOpen, setInfoOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [editStringValue, setEditStringValue] = useState('')
  const [editItemValues, setEditItemValues] = useState<ContentItem[]>([])

  const isArray = Array.isArray(content)
  const hiddenCount = isArray
    ? Math.max(0, content.length - INITIAL_VISIBLE)
    : 0
  const visibleItems = isArray
    ? expanded
      ? content
      : content.slice(0, INITIAL_VISIBLE)
    : []

  const handleEditOpen = () => {
    if (isArray) {
      setEditItemValues(content.map((item) => ({ ...item })))
    } else {
      setEditStringValue(content)
    }
    setEditOpen(true)
  }

  const handleEditConfirm = () => {
    onEdit?.(isArray ? editItemValues : editStringValue)
    setEditOpen(false)
  }

  const isConfirmDisabled = isArray
    ? editItemValues.some((item) => item.description.trim() === '')
    : editStringValue.trim() === ''

  return (
    <>
      <div className="mt-8">
        <div className="flex items-center justify-between py-3 px-4 rounded-t-xl bg-blue-light">
          <div className="flex gap-2 items-center">
            {icon}
            <div className="text-sm font-medium">{label}</div>
            {reason && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setInfoOpen(true)
                }}
              >
                <InfoIcon />
              </button>
            )}
          </div>
          <button
            onClick={handleEditOpen}
            className="flex gap-1 items-center text-sm font-medium text-bluegray-normal-hover"
          >
            <ReplanSurveyIcon />
            수정
          </button>
        </div>

        {isArray ? (
          <div className="rounded-b-xl border border-blue-light overflow-hidden">
            {visibleItems.map((item, i) => (
              <div
                key={i}
                className="py-3 px-4 border-b border-blue-light last:border-b-0"
              >
                <div className="text-sm text-bluegray-normal-active font-bold mb-1">
                  {item.title}
                </div>
                <div className="text-sm font-medium">{item.description}</div>
              </div>
            ))}
            {hiddenCount > 0 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center gap-2 py-3 px-4 text-sm font-medium text-bluegray-dark-active border-t bg-blue-light border-blue-light"
              >
                <ChecvronRightIcon
                  width={18}
                  height={18}
                  className={expanded ? 'rotate-90' : 'rotate-270'}
                />
                {expanded ? '접기' : `${hiddenCount}개 더보기`}
              </button>
            )}
          </div>
        ) : (
          <div className="py-3 px-4 text-sm font-medium rounded-b-xl border border-blue-light">
            {content}
          </div>
        )}
      </div>

      {reason && (
        <BottomSheet isOpen={infoOpen} onClose={() => setInfoOpen(false)}>
          <div className="flex flex-col gap-2 px-5 pt-2 pb-4">
            <div className="flex items-center gap-1.5 bg-bluegray-light px-3 py-1.5 rounded-full self-start">
              <WandStar width={16} height={16} />
              <span className="text-sm font-semibold text-blue-normal">
                솔루션 근거
              </span>
            </div>
            <div className="text-2xl font-bold pb-2">
              이렇게 제안한 이유예요
            </div>
            <p className="text-sm font-medium leading-relaxed p-4 rounded-xl bg-blue-light/60 text-[13px]">
              {reason}
            </p>
          </div>
        </BottomSheet>
      )}

      <BottomSheet isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <div className="px-5 pt-2 pb-4">
          <BottomSheetHeader
            title={`${label} 수정`}
            onClose={() => setEditOpen(false)}
            onConfirm={handleEditConfirm}
            confirmDisabled={isConfirmDisabled}
          />
          <p className="text-sm text-bluegray-normal mb-3">
            내용을 수정해주세요. 수정된 내용에 따라 투두가 생성됩니다.
          </p>
          {isArray ? (
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
              {editItemValues.map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-xs text-bluegray-normal px-1">
                    {item.title}
                  </span>
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...editItemValues]
                      updated[i] = {
                        ...updated[i],
                        description: e.target.value,
                      }
                      setEditItemValues(updated)
                    }}
                    className="w-full p-3 rounded-xl bg-blue-light text-sm font-medium leading-relaxed resize-none outline-none"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Input value={editStringValue} setValue={setEditStringValue}>
              <Input.Field height={159} placeholder="" />
            </Input>
          )}
        </div>
      </BottomSheet>
    </>
  )
}
