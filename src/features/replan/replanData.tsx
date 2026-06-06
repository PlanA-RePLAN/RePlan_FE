import BlockIcon from '@/icons/BlockIcon'
import BrainIcon from '@/icons/BrainIcon'
import PoorConditionIcon from '@/icons/PoorConditionIcon'
import ReplanSurveyIcon from '@/icons/ReplanSurveyIcon'
import RestLeftFillIcon from '@/icons/RestLeftFillIcon'

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

export const PlayTriangleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 3.5L12.5 8L5 12.5V3.5Z" fill="#A9AFB9" />
  </svg>
)

export const FlameIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.5 1.5C8.5 1.5 11 5 11 7.5C11 9.433 9.433 11 7.5 11C5.567 11 4 9.433 4 7.5C4 6.5 4.5 5.5 5 5C4.5 5.5 3.5 7 3.5 9C3.5 11.485 5.515 13.5 8 13.5C10.485 13.5 12.5 11.485 12.5 9C12.5 5.5 8.5 1.5 8.5 1.5Z"
      fill="#A9AFB9"
    />
  </svg>
)

export const HourglassIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 2H12.5V4.5L8.5 8L12.5 11.5V14H3.5V11.5L7.5 8L3.5 4.5V2Z"
      fill="#A9AFB9"
    />
  </svg>
)

export const WeightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="5" width="2.5" height="6" rx="1" fill="#A9AFB9" />
    <rect x="13" y="5" width="2.5" height="6" rx="1" fill="#A9AFB9" />
    <rect x="3" y="6.5" width="10" height="3" rx="1" fill="#A9AFB9" />
    <rect x="6" y="3.5" width="4" height="9" rx="1" fill="#A9AFB9" />
  </svg>
)

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

export const MAIN_OPTIONS: MainOptionItem[] = [
  {
    key: 'psychologicalState',
    icon: <BrainIcon />,
    label: '심리적 저항',
    subOptions: [
      {
        key: 'hardToStart',
        icon: <PlayTriangleIcon />,
        label: '시작이 어려웠어요',
        recommendedTodos: [],
      },
      {
        key: 'lackMotivation',
        icon: <FlameIcon />,
        label: '동기가 부족했어요',
        recommendedTodos: [],
      },
      {
        key: 'seemedHard',
        icon: <HourglassIcon />,
        label: '어렵거나 오래걸릴 것 같아 미뤘어요',
        recommendedTodos: [],
      },
      {
        key: 'pressure',
        icon: <WeightIcon />,
        label: '잘하고 싶어 부담을 가지다 미뤘어요',
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
    key: 'conditionNacho',
    icon: <PoorConditionIcon width={20} height={20} />,
    label: '컨디션 난조',
    subOptions: [
      {
        key: 'sleepLack',
        icon: <MoonIcon />,
        label: '수면부족/피로 누적 상태에요',
        step3Title: ['오늘 유성님의', '수면 시간은 몇 시간 정도였나요?'],
        subSubOptions: [
          { key: 'under3h', icon: <MoonIcon />, label: '3시간 이하' },
          { key: '4to5h', icon: <MoonIcon />, label: '4-5시간' },
          { key: '6to7h', icon: <MoonIcon />, label: '6-7시간' },
          { key: 'over8h', icon: <MoonIcon />, label: '8시간 이상' },
        ],
        todoSuggestionTitle: [
          '일찍 잠드는 게 우선이에요.',
          "'11시 이전 취침' Todo를 추가할까요?",
        ],
        recommendedTodos: [
          {
            id: '1',
            title: '11시 이전 취침',
            dayTag: 'D',
            category: 'Study',
            time: '11:00 AM',
          },
          {
            id: '2',
            title: '모의고사 풀이',
            dayTag: 'M',
            category: 'Study',
            time: '11:00 AM',
          },
        ],
      },
      {
        key: 'sick',
        icon: <BlockIcon width={16} height={16} />,
        label: '몸이 아파요',
        recommendedTodos: [],
      },
      {
        key: 'stressed',
        icon: <BrainIcon />,
        label: '스트레스를 받았어요',
        recommendedTodos: [],
      },
      {
        key: 'noFocus',
        icon: <PlayTriangleIcon />,
        label: '집중이 되지 않았어요',
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
    label: '목표 개선 필요',
    subOptions: [
      {
        key: 'tooHigh',
        icon: <WeightIcon />,
        label: '목표가 너무 높았어요',
        recommendedTodos: [],
      },
      {
        key: 'unclear',
        icon: <HourglassIcon />,
        label: '목표가 명확하지 않았어요',
        recommendedTodos: [],
      },
      {
        key: 'moreImportant',
        icon: <PlayTriangleIcon />,
        label: '더 중요한 일이 생겼어요',
        recommendedTodos: [],
      },
      {
        key: 'priorityChanged',
        icon: <FlameIcon />,
        label: '우선순위가 바뀌었어요',
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
        icon: <FlameIcon />,
        label: '갑작스러운 일이 생겼어요',
        recommendedTodos: [],
      },
      {
        key: 'environment',
        icon: <HourglassIcon />,
        label: '환경이 좋지 않았어요',
        recommendedTodos: [],
      },
      {
        key: 'interrupted',
        icon: <PlayTriangleIcon />,
        label: '다른 사람으로 인해 방해받았어요',
        recommendedTodos: [],
      },
      {
        key: 'technical',
        icon: <WeightIcon />,
        label: '기술적인 문제가 있었어요',
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
