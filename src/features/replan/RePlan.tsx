import { useEffect, useState } from 'react'
import { getTodoDetail } from '@/shared/api/todo'
import { recommendReplan, saveReplan } from '@/shared/api/replan'
import type { TodoDetail } from '@/shared/types/todo'
import type {
  RecommendData,
  ReplanAnswer,
  ReplanOperation,
} from '@/shared/types/replan'
import {
  MAIN_OPTIONS,
  MainOptionKey,
  StepType,
  buildReasonCodes,
} from './replanData'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import QuestionStep from './components/QuestionStep'
import TodoSuggestion from './components/TodoSuggestion'

interface ReplanProps {
  anchorTodoId: number
  step: StepType
  onNextStep: (next: StepType) => void
  onComplete: () => void
}

const MAX_REFRESH_COUNT = 3

export default function RePlan({
  anchorTodoId,
  step,
  onNextStep,
  onComplete,
}: ReplanProps) {
  const [selectedOption, setSelectedOption] = useState<MainOptionKey | null>(
    null,
  )
  const [selectedSubOption, setSelectedSubOption] = useState<string | null>(
    null,
  )
  const [selectedSubSubOption, setSelectedSubSubOption] = useState<
    string | null
  >(null)
  const [directInputText, setDirectInputText] = useState('')
  const [answers, setAnswers] = useState<Record<string, ReplanAnswer>>({})
  const [recommendData, setRecommendData] = useState<RecommendData | null>(null)
  const [finalReasonCodes, setFinalReasonCodes] = useState<string[]>([])
  const [refreshCount, setRefreshCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [anchorTodo, setAnchorTodo] = useState<TodoDetail | null>(null)

  const selectedOptionData = MAIN_OPTIONS.find((o) => o.key === selectedOption)
  const selectedSubOptionData = selectedOptionData?.subOptions.find(
    (o) => o.key === selectedSubOption,
  )
  const selectedSubSubOptionData = selectedSubOptionData?.subSubOptions?.find(
    (o) => o.key === selectedSubSubOption,
  )

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    getTodoDetail(accessToken, anchorTodoId).then((res) => {
      setAnchorTodo(res.data)
    })
  }, [anchorTodoId])

  const submitRecommend = async (
    reasonCodes: string[],
    withAnswers: boolean,
    refresh?: number,
  ) => {
    setIsSubmitting(true)
    const accessToken = localStorage.getItem('accessToken') ?? ''
    const res = await recommendReplan(accessToken, {
      anchorTodoId,
      reasonCodes,
      answers: withAnswers ? Object.values(answers) : undefined,
      refreshCount: refresh,
    })
    setIsSubmitting(false)
    if (!res.data) return
    setRecommendData(res.data)
    onNextStep(res.data.needsMoreInfo ? 'question' : 'result')
  }

  const resetDirectInputIfNotSelected = (key: string) => {
    if (key !== 'directInput') setDirectInputText('')
  }

  const handleOptionChange = (key: MainOptionKey) => {
    setSelectedOption(key)
    resetDirectInputIfNotSelected(key)
  }

  const handleSubOptionChange = (key: string) => {
    setSelectedSubOption(key)
    resetDirectInputIfNotSelected(key)
  }

  const handleSubSubOptionChange = (key: string) => {
    setSelectedSubSubOption(key)
    resetDirectInputIfNotSelected(key)
  }

  const handleNext = () => {
    if (step === 1 && selectedOption && selectedOptionData) {
      if (selectedOption === 'directInput') {
        if (!directInputText.trim()) return
        const reasonCodes = buildReasonCodes(
          selectedOptionData,
          undefined,
          undefined,
          directInputText,
        )
        setFinalReasonCodes(reasonCodes)
        submitRecommend(reasonCodes, false)
        return
      }

      setSelectedSubOption(null)
      setSelectedSubSubOption(null)
      onNextStep(2)
      return
    }

    if (step === 2 && selectedSubOption && selectedOptionData) {
      if (selectedSubOption === 'directInput' && !directInputText.trim()) {
        return
      }

      const hasStep3 =
        selectedSubOptionData?.subSubOptions &&
        selectedSubOptionData.subSubOptions.length > 0

      if (hasStep3 && selectedSubOption !== 'directInput') {
        setSelectedSubSubOption(null)
        onNextStep(3)
        return
      }

      const reasonCodes = buildReasonCodes(
        selectedOptionData,
        selectedSubOptionData,
        undefined,
        directInputText,
      )
      setFinalReasonCodes(reasonCodes)
      submitRecommend(reasonCodes, false)
      return
    }

    if (
      step === 3 &&
      selectedSubSubOption &&
      selectedOptionData &&
      selectedSubOptionData
    ) {
      if (selectedSubSubOption === 'directInput' && !directInputText.trim()) {
        return
      }

      const reasonCodes = buildReasonCodes(
        selectedOptionData,
        selectedSubOptionData,
        selectedSubSubOptionData,
        directInputText,
      )
      setFinalReasonCodes(reasonCodes)
      submitRecommend(reasonCodes, false)
    }
  }

  const handleAnswerChange = (key: string, value: Partial<ReplanAnswer>) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: { ...prev[key], key, ...value },
    }))
  }

  const handleQuestionSubmit = () => {
    submitRecommend(finalReasonCodes, true)
  }

  const handleRefresh = () => {
    if (refreshCount >= MAX_REFRESH_COUNT || isSubmitting) return
    const next = refreshCount + 1
    setRefreshCount(next)
    submitRecommend(finalReasonCodes, false, next)
  }

  const handleAccept = async (selectedOperations: ReplanOperation[]) => {
    setIsSubmitting(true)
    const accessToken = localStorage.getItem('accessToken') ?? ''
    await saveReplan(accessToken, {
      anchorTodoId,
      reasonCodes: finalReasonCodes,
      acceptedOperations: selectedOperations,
    })
    setIsSubmitting(false)
    onComplete()
  }

  if (step === 1) {
    return (
      <Step1
        anchorTodo={anchorTodo}
        selectedOption={selectedOption}
        onOptionChange={handleOptionChange}
        directInputText={directInputText}
        onDirectInputTextChange={setDirectInputText}
        onNext={handleNext}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (step === 2 && selectedOptionData) {
    return (
      <Step2
        selectedOptionData={selectedOptionData}
        selectedSubOption={selectedSubOption}
        onSubOptionChange={handleSubOptionChange}
        directInputText={directInputText}
        onDirectInputTextChange={setDirectInputText}
        onNext={handleNext}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (step === 3 && selectedOptionData && selectedSubOptionData) {
    return (
      <Step3
        selectedOptionData={selectedOptionData}
        selectedSubOptionData={selectedSubOptionData}
        selectedSubSubOption={selectedSubSubOption}
        onSubSubOptionChange={handleSubSubOptionChange}
        directInputText={directInputText}
        onDirectInputTextChange={setDirectInputText}
        onNext={handleNext}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (step === 'question' && recommendData?.anchorTodo) {
    return (
      <QuestionStep
        anchorTodo={recommendData.anchorTodo}
        questions={recommendData.questions}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onNext={handleQuestionSubmit}
        excludeTodoId={anchorTodoId}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (step === 'result' && recommendData) {
    return (
      <TodoSuggestion
        reasonLabels={recommendData.reasonLabels}
        operations={recommendData.operations}
        refreshCount={refreshCount}
        isSubmitting={isSubmitting}
        onRefresh={handleRefresh}
        onFinishWithoutAdd={onComplete}
        onAccept={handleAccept}
      />
    )
  }

  return null
}
