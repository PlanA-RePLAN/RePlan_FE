import CircleCheckButtonIcon from '@/icons/CircleCheckButtonIcon'
import ReplanSurveyIcon from '@/icons/ReplanSurveyIcon'
import { cn } from '@/shared/utils/cn'
import Input from '@/shared/components/Input'

interface DirectInputOptionProps {
  isSelected: boolean
  onChange: () => void
  text: string
  onTextChange: (text: string) => void
}

export default function DirectInputOption({
  isSelected,
  onChange,
  text,
  onTextChange,
}: DirectInputOptionProps) {
  return (
    <div
      className={cn(
        'rounded-xl mb-3 overflow-hidden transition-colors',
        isSelected
          ? 'bg-white border border-bluegray-light-active'
          : 'bg-bluegray-light border border-bluegray-light',
      )}
    >
      <button
        onClick={onChange}
        className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-bluegray-light-hover/30 transition-colors"
      >
        <div className="flex-shrink-0">
          <ReplanSurveyIcon width={18} height={18} />
        </div>
        <div className="flex-1 font-medium text-sm text-bluegray-darker">
          직접 입력
        </div>
        {isSelected && (
          <CircleCheckButtonIcon color="#A9AFB9" width={24} height={22} />
        )}
      </button>

      {isSelected && (
        <>
          <div className="border-t border-bluegray-light" />
          <div className="px-4 py-3">
            <Input
              maxLength={128}
              showCount="focus"
              value={text}
              setValue={onTextChange}
            >
              <Input.Field placeholder="놓친 이유를 입력하세요" />
              <Input.Bottom>
                <Input.Count />
              </Input.Bottom>
            </Input>
          </div>
        </>
      )}
    </div>
  )
}
