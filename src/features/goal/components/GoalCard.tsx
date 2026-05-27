import DateSection from '@/features/goal/components/DateSection'
import GoalSection from '@/features/goal/components/GoalSection'
import { type GoalGroup } from '@/shared/types'

export default function GoalCard({ date, goals }: GoalGroup) {
  return (
    <div className='flex flex-col gap-4 mb-8'>
        <DateSection date={date} />
        <div>
            {goals.map((goal)=>(
              <GoalSection key={goal.id} {...goal} />
          ))}
        </div>
        
    </div>
  )
}
