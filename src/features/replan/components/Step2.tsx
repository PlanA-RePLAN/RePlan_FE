import MainButton from '@/shared/components/MainButton'
import Title from '@/shared/components/Title'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { MainOptionItem } from '../replanData'
import DirectInputOption from './DirectInputOption'
import ReplanOption from './ReplanOption'
import SelectionCard from './SelectionCard'

interface Step2Props {
  selectedOptionData: MainOptionItem
  selectedSubOption: string | null
  onSubOptionChange: (key: string) => void
  onNext: () => void
}

export default function Step2({
  selectedOptionData,
  selectedSubOption,
  onSubOptionChange,
  onNext,
}: Step2Props) {
  return (
    <div className="px-5 pt-8">
      <div className="flex flex-col gap-3 mb-8">
        <Title>
          <div>내일 더 잘 도와드리기 위해,</div>
          <div>조금만 더 알려주세요.</div>
        </Title>
      </div>

      <SelectionCard
        step={2}
        icon={selectedOptionData.icon}
        label={selectedOptionData.label}
      />

      <div className="flex justify-center mb-2">
        <ChevronDownIcon color="#E6F0FC" width={30} height={30} />
      </div>

      {selectedOptionData.subOptions.map((subOption) =>
        subOption.key === 'directInput' ? (
          <DirectInputOption
            key={subOption.key}
            isSelected={selectedSubOption === 'directInput'}
            onChange={() => onSubOptionChange('directInput')}
          />
        ) : (
          <ReplanOption
            key={subOption.key}
            icon={subOption.icon}
            label={subOption.label}
            onChange={() => onSubOptionChange(subOption.key)}
            isSelected={selectedSubOption === subOption.key}
          />
        ),
      )}

      <div className="fixed pb-10 pt-10 bottom-0 left-0 right-0 w-full px-5 bg-linear-to-b from-transparent from-0% to-white to-20%">
        <MainButton
          option="primary"
          onClick={onNext}
          title="다음으로"
          className="mt-10"
        />
      </div>
    </div>
  )
}
