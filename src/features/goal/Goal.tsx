import MainHeader from '@/shared/components/MainHeader'
import PeriodDropdown from './components/PeriodDropdown'
import GoalAddButton from './components/GoalAddButton'
import GoalCard from './components/GoalCard'
import { type GoalGroup } from '@/shared/types'

const goalGroup : GoalGroup[] =[
  {
    year: 2026, month: 5, day: 4,
    goals: [
        { id: 1, title: "토익 850점 달성", deadline: "2026년 5월 26일, 8:00PM" },
        { id: 2, title: "컴퓨터활용능력 1급 취급", deadline: "2026년 5월 26일, 8:00AM" },
        { id: 3, title: "토익 900점 달성", deadline: "2026년 5월 11일" },
    ]
  },
  {
    year: 2026, month: 5, day: 3,
    goals: [
        { id: 1, title: "토익 850점 달성", deadline: "2026년 5월 26일, 8:00PM" },
    ]
  },
  {
    year: 2026, month: 4, day: 4,
    goals: [
        { id: 1, title: "토익 850점 달성", deadline: "2026년 5월 26일, 8:00PM" },
        { id: 2, title: "컴퓨터활용능력 1급 취급", deadline: "2026년 5월 26일, 8:00AM" },
    ]
  }
] 

export default function Goal() {
  return (
    <div className='flex flex-col h-dvh'>
        <MainHeader />
        <div className='px-5'>
            <div className='flex justify-between mb-4'>
                <PeriodDropdown />
                <GoalAddButton />
            </div>
        </div>
        <div className='flex-1 overflow-y-auto px-5 pb-27'>
            {goalGroup.map((group) => (
                <GoalCard key={`${group.year}-${group.month}-${group.day}`} {...group} />
            ))}
        </div>
    </div>
  )
}
