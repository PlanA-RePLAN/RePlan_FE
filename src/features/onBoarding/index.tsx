import { useNavigate } from 'react-router-dom'

// components
import BackHeaderLayout from '@/shared/components/BackHeaderLayout'
import ConfirmBottomSheet from '@/shared/components/ConfirmBottomSheet'
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
  const [isExitSheetOpen, setIsExitSheetOpen] = useState(false)
  const navigate = useNavigate()

  // 뒤로가기 = 이전 단계가 아니라 목표 설정에서 나가기.
  // 실수로 나가면 입력한 내용이 다 사라지므로 확인 시트를 먼저 띄운다.
  // 완료 화면에서는 초기화될 게 없어 바로 나간다.
  const moveBack = () => {
    if (currentStep === TOTAL_STEPS) {
      navigate(-1)
      return
    }
    setIsExitSheetOpen(true)
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
      <ConfirmBottomSheet
        isOpen={isExitSheetOpen}
        onClose={() => setIsExitSheetOpen(false)}
        title="지금 나가면 목표 설정이 초기화돼요"
        description="나가시겠어요?"
        confirmText="나가기"
        onConfirm={() => navigate(-1)}
      />
    </BackHeaderLayout>
  )
}
