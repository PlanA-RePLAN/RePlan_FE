import MainHeader from '@/shared/components/MainHeader'
import PeriodDropdown from './components/PeriodDropdown'
import GoalAddButton from './components/GoalAddButton'
import GoalCard from './components/GoalCard'

export default function Goal() {
  return (
    <div className='flex flex-col h-dvh'>
        <MainHeader />
        <div className='px-5'>
            <div className='flex justify-between mb-4'>
                <PeriodDropdown />
                <GoalAddButton />
            </div>
            <GoalCard />
        </div>
        
    </div>
  )
}
