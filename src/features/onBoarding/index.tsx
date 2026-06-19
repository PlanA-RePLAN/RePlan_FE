import { useNavigate } from 'react-router-dom'

// components
import BackHeaderLayout from '@/shared/components/BackHeaderLayout'
import ProposeGoal from './ProposeGoal'
import WritingGoal from './WritingGoal'
import WritingGoalDetails from './WritingGoalDetails'
import AskQuestion from './AskQuestion'
import ProgressBar from './components/ProgressBar'

// utils
import { useState } from 'react'
import OnboardingComplete from './OnboardingComplete'

const TOTAL_STEPS = 4

export default function OnBoarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const moveBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate(-1)
    }
  }

  const moveNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const steps = [
    <WritingGoal moveNext={moveNext} key={0} />,
    <WritingGoalDetails moveNext={moveNext} key={1} />,
    <AskQuestion moveNext={moveNext} key={2} />,
    <ProposeGoal moveNext={moveNext} key={3} />,
  ]
  return (
    <BackHeaderLayout
      title="목표 설정"
      onBack={moveBack}
      className="border-none"
    >
      {currentStep < TOTAL_STEPS && (
        <div className="font-light px-5">
          <ProgressBar totalSteps={TOTAL_STEPS} currentStep={currentStep + 1} />
          <div className="pt-8">{steps[currentStep]}</div>
        </div>
      )}
      {currentStep === TOTAL_STEPS && <OnboardingComplete />}
    </BackHeaderLayout>
  )
}
