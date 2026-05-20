import { useNavigate } from 'react-router-dom'

// components
import BackHeaderLayout from '@/shared/components/BackHeaderLayout'
import ProposeGoal from './ProposeGoal'
import WritingGoal from './WritingGoal'

// utils
import { useState } from 'react'

export default function OnBoarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const moveBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate(-1)
    }
  }

  const moveNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const steps = [
    <WritingGoal key={0} />,
    <ProposeGoal moveNext={moveNext} key={1} />,
  ]
  return (
    <BackHeaderLayout title="목표 설정" onBack={moveBack}>
      <div className="font-light px-5 pt-8">{steps[currentStep - 1]}</div>
    </BackHeaderLayout>
  )
}
