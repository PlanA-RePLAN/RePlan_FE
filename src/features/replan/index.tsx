import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeaderLayout from '@/shared/components/BackHeaderLayout'
import { StepType } from './replanData'
import RePlan from './RePlan'

export default function ReplanPage() {
  const navigate = useNavigate()
  const [stepHistory, setStepHistory] = useState<StepType[]>([1])

  const currentStep = stepHistory[stepHistory.length - 1]

  const handleNextStep = (next: StepType) => {
    setStepHistory((prev) => [...prev, next])
  }

  const handleBack = () => {
    if (stepHistory.length <= 1) {
      navigate(-1)
    } else {
      setStepHistory((prev) => prev.slice(0, -1))
    }
  }

  return (
    <BackHeaderLayout title="RePlan" onBack={handleBack}>
      <RePlan step={currentStep} onNextStep={handleNextStep} />
    </BackHeaderLayout>
  )
}
