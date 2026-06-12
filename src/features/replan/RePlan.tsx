import { useState } from 'react'
import { MAIN_OPTIONS, MainOptionKey, StepType } from './replanData'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import TodoSuggestion from './components/TodoSuggestion'

interface ReplanProps {
  step: StepType
  onNextStep: (next: StepType) => void
}

export default function RePlan({ step, onNextStep }: ReplanProps) {
  const [selectedOption, setSelectedOption] = useState<MainOptionKey | null>(
    null,
  )
  const [selectedSubOption, setSelectedSubOption] = useState<string | null>(
    null,
  )
  const [selectedSubSubOption, setSelectedSubSubOption] = useState<
    string | null
  >(null)
  const selectedOptionData = MAIN_OPTIONS.find((o) => o.key === selectedOption)
  const selectedSubOptionData = selectedOptionData?.subOptions.find(
    (o) => o.key === selectedSubOption,
  )
  const selectedSubSubOptionData = selectedSubOptionData?.subSubOptions?.find(
    (o) => o.key === selectedSubSubOption,
  )

  const handleNext = () => {
    if (step === 1 && selectedOption) {
      setSelectedSubOption(null)
      onNextStep(2)
    } else if (step === 2 && selectedSubOption) {
      const hasStep3 =
        selectedSubOptionData?.subSubOptions &&
        selectedSubOptionData.subSubOptions.length > 0
      setSelectedSubSubOption(null)
      onNextStep(hasStep3 ? 3 : 'todo')
    } else if (step === 3 && selectedSubSubOption) {
      onNextStep('todo')
    }
  }

  if (step === 1) {
    return (
      <Step1
        selectedOption={selectedOption}
        onOptionChange={setSelectedOption}
        onNext={handleNext}
      />
    )
  }

  if (step === 2 && selectedOptionData) {
    return (
      <Step2
        selectedOptionData={selectedOptionData}
        selectedSubOption={selectedSubOption}
        onSubOptionChange={setSelectedSubOption}
        onNext={handleNext}
      />
    )
  }

  if (step === 3 && selectedOptionData && selectedSubOptionData) {
    return (
      <Step3
        selectedOptionData={selectedOptionData}
        selectedSubOptionData={selectedSubOptionData}
        selectedSubSubOption={selectedSubSubOption}
        onSubSubOptionChange={setSelectedSubSubOption}
        onNext={handleNext}
      />
    )
  }

  if (step === 'todo' && selectedOptionData && selectedSubOptionData) {
    return (
      <TodoSuggestion
        selectedOptionData={selectedOptionData}
        selectedSubOptionData={selectedSubOptionData}
        selectedSubSubOptionData={selectedSubSubOptionData}
        onFinishWithoutAdd={() => console.log('finish without add')}
        onAddTodos={(ids) => console.log('add todos:', ids)}
      />
    )
  }

  return null
}
