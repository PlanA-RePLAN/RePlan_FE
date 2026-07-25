import ArrowUpIcon from '@/icons/ArrowUpIcon'
import BandageIcon from '@/icons/BandageIcon'
import BatteryIcon from '@/icons/BatteryIcon'
import BlockIcon from '@/icons/BlockIcon'
import BrainIcon from '@/icons/BrainIcon'
import CalendarXIcon from '@/icons/CalendarXIcon'
import ClockPlusIcon from '@/icons/ClockPlusIcon'
import FireIcon from '@/icons/FireIcon'
import HourglassIcon from '@/icons/HourglassIcon'
import PlayIcon from '@/icons/PlayIcon'
import PoorConditionIcon from '@/icons/PoorConditionIcon'
import PowerIcon from '@/icons/PowerIcon'
import ReplanSurveyIcon from '@/icons/ReplanSurveyIcon'
import ResetIcon from '@/icons/ResetIcon'
import SleepIcon from '@/icons/SleepIcon'
import AlertTriangleIcon from '@/icons/AlertTriangleIcon'
import MenuListIcon from '@/icons/MenuListIcon'
import XIcon from '@/icons/XIcon'
import QuestionIcon from '@/icons/replan/QuestionIcon'
import HealthIcon from '@/icons/HealthIcon'
import PerfectIcon from '@/icons/replan/PerfectIcon'

export type MainOptionKey =
  | 'psychologicalState'
  | 'conditionNacho'
  | 'goalImprovement'
  | 'unexpectedObstacle'
  | 'directInput'

export type StepType = 1 | 2 | 3 | 'question' | 'result'

export interface SubSubOptionItem {
  key: string
  icon?: React.ReactNode
  label: string
  code: string
}

export interface SubOptionItem {
  key: string
  icon: React.ReactNode
  label: string
  code: string
  step3Title?: string[]
  subSubOptions?: SubSubOptionItem[]
}

export interface MainOptionItem {
  key: MainOptionKey
  icon: React.ReactNode
  label: string
  code: string
  subOptions: SubOptionItem[]
}

export const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 10.5C12.3 12.3 10.6 13.5 8.7 13.5C6 13.5 3.8 11.3 3.8 8.6C3.8 6.6 5 4.9 6.7 4C6.2 4.9 5.9 5.9 5.9 7C5.9 9.9 8.3 12.3 11.2 12.3C11.8 12.3 12.4 12.2 13 12V10.5Z"
      fill="#A9AFB9"
    />
  </svg>
)

const SortPriorityIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="3" width="9" height="1.5" rx="0.75" fill="#A9AFB9" />
    <rect x="1" y="7" width="6.5" height="1.5" rx="0.75" fill="#A9AFB9" />
    <rect x="1" y="11" width="4" height="1.5" rx="0.75" fill="#A9AFB9" />
    <rect x="12.25" y="3.5" width="1.5" height="9" rx="0.75" fill="#A9AFB9" />
    <path d="M10.5 6.5L13 2.5L15.5 6.5Z" fill="#A9AFB9" />
  </svg>
)

const FocusScanIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 5V1H5V2.5H2.5V5H1Z" fill="#A9AFB9" />
    <path d="M11 1H15V5H13.5V2.5H11V1Z" fill="#A9AFB9" />
    <path d="M1 11H2.5V13.5H5V15H1V11Z" fill="#A9AFB9" />
    <path d="M13.5 11H15V15H11V13.5H13.5V11Z" fill="#A9AFB9" />
    <circle cx="8" cy="8" r="2" fill="#A9AFB9" />
  </svg>
)

const LightningBoltIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="7" fill="#A9AFB9" />
    <path d="M9 3.5L5.5 9H8L7 12.5L10.5 7H8L9 3.5Z" fill="white" />
  </svg>
)

const directInputSubSubOption = (): SubSubOptionItem => ({
  key: 'directInput',
  icon: <ReplanSurveyIcon width={18} height={18} />,
  label: '직접 입력',
  code: '',
})

export const MAIN_OPTIONS: MainOptionItem[] = [
  {
    key: 'psychologicalState',
    icon: <BrainIcon />,
    label: '심리적 저항',
    code: 'MENTAL_RESISTANCE',
    subOptions: [
      {
        key: 'hardToStart',
        icon: <PlayIcon width={20} height={20} />,
        label: '시작하기 막막하거나 부담스러웠어요',
        code: 'MENTAL_HARD_TO_START',
        step3Title: ['{{name}}님이', '시작이 막막했던 이유가 뭔가요?'],
        subSubOptions: [
          {
            key: 'dontKnowWhereToStart',
            icon: <QuestionIcon />,
            label: '무엇부터 시작할지 몰라서',
            code: 'MENTAL_START_WHERE',
          },
          {
            key: 'tooMuchTimeOrEnergy',
            icon: <HealthIcon />,
            label: '시간이나 에너지가 많이 들 것 같아서',
            code: 'MENTAL_START_HEAVY',
          },
          {
            key: 'wantToBePerfect',
            icon: <PerfectIcon />,
            label: '완벽하게 해내고 싶어서',
            code: 'MENTAL_PERFECTIONISM',
          },
          directInputSubSubOption(),
        ],
      },
      {
        key: 'lackMotivation',
        icon: <FireIcon />,
        label: '의욕/동기가 부족했어요',
        code: 'MENTAL_NO_MOTIVATION',
      },
      {
        key: 'procrastinated',
        icon: <HourglassIcon />,
        label: '당장 안 해도 돼서 미루다 쌓였어요',
        code: 'MENTAL_PROCRASTINATION',
      },
      {
        key: 'distracted',
        icon: <XIcon />,
        label: '딴짓을 하다가 미뤘어요',
        code: 'MENTAL_DISTRACTION',
      },
      {
        key: 'directInput',
        icon: <ReplanSurveyIcon width={18} height={18} />,
        label: '직접 입력',
        code: '',
      },
    ],
  },
  {
    key: 'conditionNacho',
    icon: <PoorConditionIcon width={20} height={20} />,
    label: '컨디션 난조',
    code: 'BAD_CONDITION',
    subOptions: [
      {
        key: 'energyDrained',
        icon: <BatteryIcon />,
        label: '체력 방전/에너지 모두 소모 상태에요',
        code: 'CONDITION_EXHAUSTED',
      },
      {
        key: 'sleepDeprived',
        icon: <SleepIcon width={16} height={16} />,
        label: '수면부족/피로 누적 상태에요',
        step3Title: ['오늘 {{name}}님의', '수면 시간은 몇 시간 정도였나요?'],
        code: 'CONDITION_SLEEP',
        subSubOptions: [
          {
            key: 'sleep3hUnder',
            icon: <ReplanSurveyIcon />,
            label: '3시간 이하',
            code: 'CONDITION_SLEEP_3H_UNDER',
          },
          {
            key: 'sleep4to5h',
            icon: <ReplanSurveyIcon />,
            label: '4~5시간',
            code: 'CONDITION_SLEEP_4_5H',
          },
          {
            key: 'sleep6to7h',
            icon: <ReplanSurveyIcon />,
            label: '6~7시간',
            code: 'CONDITION_SLEEP_6_7H',
          },
          {
            key: 'sleep8hOver',
            icon: <ReplanSurveyIcon />,
            label: '8시간 이상',
            code: 'CONDITION_SLEEP_8H_OVER',
          },
          directInputSubSubOption(),
        ],
      },
      {
        key: 'physicalPain',
        icon: <BandageIcon />,
        label: '신체적 통증이 있어요',
        code: 'CONDITION_PAIN',
      },
      {
        key: 'burnout',
        icon: <PowerIcon />,
        step3Title: ['많이 지치셨군요.', '어떤 부분이 힘드셨나요?'],
        label: '번아웃이 왔어요',
        code: 'CONDITION_BURNOUT',
        subSubOptions: [
          {
            key: 'noProgress',
            icon: <ReplanSurveyIcon />,
            label: '성과나 변화가 보이지 않아 무기력해요',
            code: 'CONDITION_BURNOUT_NO_PROGRESS',
          },
          {
            key: 'lostDirection',
            icon: <ReplanSurveyIcon />,
            label: '목표의 방향성을 잃었어요',
            code: 'CONDITION_BURNOUT_LOST_DIRECTION',
          },
          directInputSubSubOption(),
        ],
      },
      {
        key: 'directInput',
        icon: <ReplanSurveyIcon width={16} height={16} />,
        label: '직접 입력',
        code: '',
      },
    ],
  },
  {
    key: 'goalImprovement',
    icon: <ResetIcon />,
    label: '목표 개선 필요',
    code: 'GOAL_NEEDS_IMPROVEMENT',
    subOptions: [
      {
        key: 'failedPlan',
        icon: <MenuListIcon width={20} height={20} />,
        label: '구체적 계획 수립을 실패했어요',
        code: 'GOAL_NO_PLAN',
      },
      {
        key: 'tooHigh',
        icon: <ArrowUpIcon width={20} height={20} />,
        label: '목표가 과했어요',
        code: 'GOAL_TOO_MUCH',
        subSubOptions: [
          {
            key: 'tooManyTodos',
            icon: <ReplanSurveyIcon />,
            label: '하루에 계획한 할 일 개수가 많았어요',
            code: 'GOAL_TOO_MANY_TODOS',
          },
          {
            key: 'tooMuchWork',
            icon: <ReplanSurveyIcon />,
            label: '특정 할 일의 분량이 많았어요',
            code: 'GOAL_TOO_MUCH_VOLUME',
          },
          directInputSubSubOption(),
        ],
      },
      {
        key: 'noPriority',
        icon: <SortPriorityIcon />,
        label: '우선 순위를 정하지 못했어요',
        code: 'GOAL_NO_PRIORITY',
      },
      {
        key: 'tookLonger',
        icon: <ClockPlusIcon />,
        label: '시간이 예측보다 더 소요됐어요',
        code: 'GOAL_UNDERESTIMATED',
      },
      {
        key: 'directInput',
        icon: <ReplanSurveyIcon width={16} height={16} />,
        label: '직접 입력',
        code: '',
      },
    ],
  },
  {
    key: 'unexpectedObstacle',
    icon: <BlockIcon />,
    label: '예상치 못한 방해 발생',
    code: 'UNEXPECTED_INTERRUPTION',
    subOptions: [
      {
        key: 'sudden',
        icon: <AlertTriangleIcon />,
        label: '돌발 상황이 발생했어요',
        code: 'INTERRUPT_SUDDEN',
      },
      {
        key: 'environment',
        icon: <FocusScanIcon />,
        label: '집중할 수 있는 환경이 아니었어요',
        code: 'INTERRUPT_ENVIRONMENT',
        subSubOptions: [
          {
            key: 'noisy',
            icon: <ReplanSurveyIcon />,
            label: '주변이 시끄럽거나 작업할 물리적 공간이 마땅치 않았어요',
            code: 'INTERRUPT_ENV_NOISE',
          },
          {
            key: 'interruptions',
            icon: <ReplanSurveyIcon />,
            label: '타인의 요청이나 연락이 계속 들어왔어요',
            code: 'INTERRUPT_CONTACT',
          },
          directInputSubSubOption(),
        ],
      },
      {
        key: 'urgent',
        icon: <LightningBoltIcon />,
        label: '더 급한 일이 생겼어요',
        code: 'INTERRUPT_URGENT',
      },
      {
        key: 'lateSchedule',
        icon: <CalendarXIcon width={20} height={20} />,
        label: '다른 일정이 늦게 끝났어요',
        code: 'INTERRUPT_LATE_END',
      },
      {
        key: 'directInput',
        icon: <ReplanSurveyIcon width={20} height={20} />,
        label: '직접 입력',
        code: '',
      },
    ],
  },
  {
    key: 'directInput',
    icon: <ReplanSurveyIcon width={20} height={20} />,
    label: '직접 입력',
    code: '',
    // 1단계 최상위 직접입력은 Step1에서 바로 recommend를 호출하므로 하위 단계가 없다
    subOptions: [],
  },
]

// 트리에서 고른 결과로 reasonCodes 만들기
// - 정석 잎: [잎코드] / - 직접입력: 최상위=[텍스트], 하위=[부모코드, 텍스트]
export function buildReasonCodes(
  selectedOptionData: MainOptionItem,
  selectedSubOptionData: SubOptionItem | undefined,
  selectedSubSubOptionData: SubSubOptionItem | undefined,
  directInputText: string,
): string[] {
  if (selectedOptionData.key === 'directInput') return [directInputText]

  if (selectedSubSubOptionData?.key === 'directInput') {
    return [selectedSubOptionData!.code, directInputText]
  }

  if (selectedSubOptionData?.key === 'directInput') {
    return [selectedOptionData.code, directInputText]
  }

  if (selectedSubSubOptionData) return [selectedSubSubOptionData.code]

  return [selectedSubOptionData!.code]
}

export interface SelectionPathItem {
  icon: React.ReactNode
  label: string
}

// 결과 화면 상단에 보여줄 선택 경로(단계별 아이콘+라벨). reasonCodes와 같은 트리를 따라가되
// 직접입력 구간은 ReplanSurveyIcon + 입력한 텍스트로 대체한다
export function buildSelectionPath(
  selectedOptionData: MainOptionItem,
  selectedSubOptionData: SubOptionItem | undefined,
  selectedSubSubOptionData: SubSubOptionItem | undefined,
  directInputText: string,
): SelectionPathItem[] {
  const directInputItem = (): SelectionPathItem => ({
    icon: <ReplanSurveyIcon width={18} height={18} />,
    label: directInputText,
  })

  if (selectedOptionData.key === 'directInput') return [directInputItem()]

  const path: SelectionPathItem[] = [
    { icon: selectedOptionData.icon, label: selectedOptionData.label },
  ]

  if (selectedSubOptionData?.key === 'directInput') {
    path.push(directInputItem())
    return path
  }

  if (selectedSubOptionData) {
    path.push({
      icon: selectedSubOptionData.icon,
      label: selectedSubOptionData.label,
    })
  }

  if (selectedSubSubOptionData?.key === 'directInput') {
    path.push(directInputItem())
  } else if (selectedSubSubOptionData) {
    path.push({
      icon: selectedSubSubOptionData.icon ?? <MoonIcon />,
      label: selectedSubSubOptionData.label,
    })
  }

  return path
}
