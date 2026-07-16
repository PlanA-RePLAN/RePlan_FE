import { useNavigate } from 'react-router-dom'

// components
import BackHeaderLayout from '@/shared/components/BackHeaderLayout'
import BottomSheet from '@/shared/components/BottomSheet'
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
      <BottomSheet
        isOpen={isExitSheetOpen}
        onClose={() => setIsExitSheetOpen(false)}
      >
        <div className="pt-4 pb-9.25 px-5 flex flex-col items-center w-full">
          <h3 className="text-xl font-semibold">지금 나가면 목표 설정이 초기화돼요</h3>
          <p className="mt-5">나가시겠어요?</p>
          <div className="flex gap-3 mt-5 w-full">
            <button
              onClick={() => setIsExitSheetOpen(false)}
              className="flex-1 py-3 rounded-xl bg-bluegray-light text-black font-semibold"
            >
              취소
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl bg-bluegray-light text-danger font-semibold"
            >
              나가기
            </button>
          </div>
        </div>
      </BottomSheet>
    </BackHeaderLayout>
  )
}
