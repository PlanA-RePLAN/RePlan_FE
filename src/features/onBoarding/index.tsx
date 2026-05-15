// components
import BackHeader from '@/shared/components/BackHeader'
import ProgressBar from './components/ProgressBar'
import ProposeGoal from './ProposeGoal'
import { useState } from 'react'

export default function OnBoarding() {
  const [currentStep, setCurrentStep] = useState(2)
  const moveBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const moveNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const steps = [
    <div key={0}>목표 입력</div>,
    <ProposeGoal moveNext={moveNext} key={1} />,
    <div key={2}>목표 설정 완료</div>,
  ]
  return (
    <div className="font-light px-5">
      <BackHeader onBack={moveBack} title="온보딩" />
      <ProgressBar totalSteps={3} currentStep={currentStep} />
      {steps[currentStep - 1]}
    </div>
  )
}
