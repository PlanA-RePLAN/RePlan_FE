import BatteryIcon from '@/icons/BatteryIcon'
import BlockIcon from '@/icons/BlockIcon'
import BrainIcon from '@/icons/BrainIcon'
import CalendarClearSharpIcon from '@/icons/CalendarClearSharpIcon'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import FireIcon from '@/icons/FireIcon'
import MenuIcon from '@/icons/MenuIcon'
import PoorConditionIcon from '@/icons/PoorConditionIcon'
import ReplanSurveyIcon from '@/icons/ReplanSurveyIcon'
import RestLeftFillIcon from '@/icons/RestLeftFillIcon'
import StreamTimeIcon from '@/icons/StreamTimeIcon'

export type MainOptionKey =
  | 'psychologicalState'
  | 'conditionNacho'
  | 'goalImprovement'
  | 'unexpectedObstacle'
  | 'directInput'

export type StepType = 1 | 2 | 3 | 'todo'

export interface RecommendedTodo {
  id: string
  title: string
  dayTag: 'M' | 'D'
  category: string
  time: string
}

export interface SubSubOptionItem {
  key: string
  icon?: React.ReactNode
  label: string
}

export interface SubOptionItem {
  key: string
  icon: React.ReactNode
  label: string
  step3Title?: string[]
  subSubOptions?: SubSubOptionItem[]
  todoSuggestionTitle?: string[]
  recommendedTodos?: RecommendedTodo[]
}

export interface MainOptionItem {
  key: MainOptionKey
  icon: React.ReactNode
  label: string
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

const AlertTriangleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.1 1.5C7.5 0.8 8.5 0.8 8.9 1.5L15.2 13C15.6 13.7 15.1 14.5 14.3 14.5H1.7C0.9 14.5 0.4 13.7 0.8 13L7.1 1.5Z"
      fill="#A9AFB9"
    />
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
    <path d="M9.5 1L4 9H8.5L6.5 15L13 7H8.5L9.5 1Z" fill="#A9AFB9" />
  </svg>
)

export const MAIN_OPTIONS: MainOptionItem[] = [
  {
    key: 'psychologicalState',
    icon: <BrainIcon />,
    label: '심리적 저항',
    subOptions: [
      {
        key: 'hardToStart',
        icon: (
          <ChevronDownIcon
            className="rotate-270"
            color="#A9AFB9"
            width={20}
            height={20}
          />
        ),
        label: '시작하기 막막하거나 부담스러웠어요',
        subSubOptions: [
          {
            key: 'dontKnowWhereToStart',
            icon: <ReplanSurveyIcon />,
            label: '무엇부터 시작할지 몰라서',
          },
          {
            key: 'tooMuchTimeOrEnergy',
            icon: <ReplanSurveyIcon />,
            label: '시간이나 에너지가 많이 들 것 같아서',
          },
          {
            key: 'wantToBePerfect',
            icon: <ReplanSurveyIcon />,
            label: '완벽하게 해내고 싶어서',
          },
        ],
        recommendedTodos: [],
      },
      {
        key: 'lackMotivation',
        icon: <FireIcon />,
        label: '의욕/동기가 부족했어요',
        recommendedTodos: [],
      },
      {
        key: 'procrastinated',
        icon: <ReplanSurveyIcon />,
        label: '당장 안 해도 돼서 미루다 쌓였어요',
        recommendedTodos: [],
      },
      {
        key: 'distracted',
        icon: <ReplanSurveyIcon />,
        label: '딴짓을 하다가 미뤘어요',
        recommendedTodos: [],
      },
      {
        key: 'directInput',
        icon: <ReplanSurveyIcon width={18} height={18} />,
        label: '직접 입력',
        recommendedTodos: [],
      },
    ],
  },
  {
    key: 'conditionNacho',
    icon: <PoorConditionIcon width={20} height={20} />,
    label: '컨디션 난조',
    subOptions: [
      {
        key: 'energyDrained',
        icon: <BatteryIcon />,
        label: '체력 방전/에너지 모두 소모 상태에요',
        recommendedTodos: [],
      },
      {
        key: 'sleepDeprived',
        icon: <BlockIcon width={16} height={16} />,
        label: '수면부족/피로 누적 상태에요',
        recommendedTodos: [],
      },
      {
        key: 'physicalPain',
        icon: <FireIcon />,
        label: '신체적 통증이 있어요',
        recommendedTodos: [],
      },
      {
        key: 'burnout',
        icon: <ChevronDownIcon className="rotate-270" color="#A9AFB9" />,
        label: '번아웃이 왔어요',
        subSubOptions: [
          {
            key: 'noProgress',
            icon: <ReplanSurveyIcon />,
            label: '성과나 변화가 보이지 않아 무기력해요',
          },
          {
            key: 'lostDirection',
            icon: <ReplanSurveyIcon />,
            label: '목표의 방향성을 잃었어요',
          },
        ],
        recommendedTodos: [],
      },
      {
        key: 'directInput',
        icon: <ReplanSurveyIcon width={16} height={16} />,
        label: '직접 입력',
        recommendedTodos: [],
      },
    ],
  },
  {
    key: 'goalImprovement',
    icon: <RestLeftFillIcon width={20} height={20} />,
    label: '목표/계획 개선 필요',
    subOptions: [
      {
        key: 'failedPlan',
        icon: <MenuIcon />,
        label: '구체적 계획 수립을 실패했어요',
        recommendedTodos: [],
      },
      {
        key: 'tooHigh',
        icon: (
          <ChevronDownIcon
            className="rotate-180"
            color="#A9AFB9"
            width={20}
            height={20}
          />
        ),
        label: '목표가 과했어요',
        subSubOptions: [
          {
            key: 'tooManyTodos',
            icon: <ReplanSurveyIcon />,
            label: '하루에 계획한 할 일 개수가 많았어요',
          },
          {
            key: 'tooMuchWork',
            icon: <ReplanSurveyIcon />,
            label: '특정 할 일의 분량이 많았어요',
          },
        ],
        recommendedTodos: [],
      },
      {
        key: 'noPriority',
        icon: <SortPriorityIcon />,
        label: '우선 순위를 정하지 못했어요',
        recommendedTodos: [],
      },
      {
        key: 'tookLonger',
        icon: <StreamTimeIcon />,
        label: '시간이 예측보다 더 소요됐어요',
        recommendedTodos: [],
      },
      {
        key: 'directInput',
        icon: <ReplanSurveyIcon width={16} height={16} />,
        label: '직접 입력',
        recommendedTodos: [],
      },
    ],
  },
  {
    key: 'unexpectedObstacle',
    icon: <BlockIcon />,
    label: '예상치 못한 방해 발생',
    subOptions: [
      {
        key: 'sudden',
        icon: <AlertTriangleIcon />,
        label: '돌발 상황이 발생했어요',
        recommendedTodos: [],
      },
      {
        key: 'environment',
        icon: <FocusScanIcon />,
        label: '집중할 수 있는 환경이 아니었어요',
        subSubOptions: [
          {
            key: 'noisy',
            icon: <ReplanSurveyIcon />,
            label: '주변이 시끄럽거나 작업할 물리적 공간이 마땅치 않았어요',
          },
          {
            key: 'interruptions',
            icon: <ReplanSurveyIcon />,
            label: '타인의 요청이나 연락이 계속 들어왔어요',
          },
        ],
        recommendedTodos: [],
      },
      {
        key: 'urgent',
        icon: <LightningBoltIcon />,
        label: '더 급한 일이 생겼어요',
        recommendedTodos: [],
      },
      {
        key: 'lateSchedule',
        icon: <CalendarClearSharpIcon width={16} height={16} />,
        label: '다른 일정이 늦게 끝났어요',
        recommendedTodos: [],
      },
      {
        key: 'directInput',
        icon: <ReplanSurveyIcon width={16} height={16} />,
        label: '직접 입력',
        recommendedTodos: [],
      },
    ],
  },
  {
    key: 'directInput',
    icon: <ReplanSurveyIcon width={20} height={20} />,
    label: '직접 입력',
    subOptions: [
      {
        key: 'directInput',
        icon: <ReplanSurveyIcon width={16} height={16} />,
        label: '직접 입력',
        recommendedTodos: [],
      },
    ],
  },
]
