import DateSection from '@/features/goal/components/DateSection'
import GoalSection from '@/features/goal/components/GoalSection'
import { type GoalGroup } from '@/shared/types'

export default function GoalCard({ year, month, day, goals}: GoalGroup) {
  return (
    <div className='flex flex-col gap-4 mb-8'>
        <DateSection year={year} month={month} day={day} />
        <div>
            {goals.map((goal)=>(
            <GoalSection key={goal.id} goal={goal} />
          ))}
        </div>
    </div>
  )
}
