import DateSection from '@/features/goal/components/DateSection'
import GoalSection from '@/features/goal/components/GoalSection'
import { type GoalGroup } from '@/shared/types'

interface GoalCardProps extends GoalGroup {
  onClick: (id: number) => void
}

export default function GoalCard({ date, goals, onClick }: GoalCardProps) {
  return (
    <div className='flex flex-col gap-4 mb-8'>
        <DateSection date={date} />
        <div>
            {goals.map((goal)=>(
              <GoalSection key={goal.id} {...goal} onClick={onClick} />
          ))}
        </div>
        
    </div>
  )
}
