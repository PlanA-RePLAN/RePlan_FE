import MainButton from '@/shared/components/MainButton'
import Title from '@/shared/components/Title'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { MainOptionItem, MoonIcon, SubOptionItem } from '../replanData'
import DirectInputOption from './DirectInputOption'
import ReplanOption from './ReplanOption'
import SelectionCard from './SelectionCard'

interface Step3Props {
  selectedOptionData: MainOptionItem
  selectedSubOptionData: SubOptionItem
  selectedSubSubOption: string | null
  onSubSubOptionChange: (key: string) => void
  onNext: () => void
}

export default function Step3({
  selectedOptionData,
  selectedSubOptionData,
  selectedSubSubOption,
  onSubSubOptionChange,
  onNext,
}: Step3Props) {
  const titleLines = selectedSubOptionData.step3Title ?? ['조금 더 알려주세요.']

  return (
    <div className="px-5 pt-8">
      <div className="flex flex-col gap-3 mb-8">
        <Title>
          {titleLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </Title>
      </div>

      <SelectionCard
        icon={selectedOptionData.icon}
        label={selectedOptionData.label}
        step={2}
      />
      <SelectionCard
        icon={selectedSubOptionData.icon}
        label={selectedSubOptionData.label}
        step={3}
      />

      <div className="flex justify-center mb-2">
        <ChevronDownIcon color="#E6F0FC" width={30} height={30} />
      </div>

      {selectedSubOptionData.subSubOptions?.map((subSubOption) =>
        subSubOption.key === 'directInput' ? (
          <DirectInputOption
            key={subSubOption.key}
            isSelected={selectedSubSubOption === 'directInput'}
            onChange={() => onSubSubOptionChange('directInput')}
          />
        ) : (
          <ReplanOption
            key={subSubOption.key}
            icon={subSubOption.icon ?? <MoonIcon />}
            label={subSubOption.label}
            onChange={() => onSubSubOptionChange(subSubOption.key)}
            isSelected={selectedSubSubOption === subSubOption.key}
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
