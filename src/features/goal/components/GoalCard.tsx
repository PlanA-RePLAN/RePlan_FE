import DateSection from '@/features/goal/components/DateSection'
import GoalSection from '@/features/goal/components/GoalSection'

const periodOptions = [
    { year: 2026, month: 5, day: 4},
    { year: 2026, month: 5, day: 3},
    { year: 2026, month: 4, day: 4},
]

export default function GoalCard() {
  return (
    <div className='flex flex-col gap-4'>
        <DateSection year={2026} month={5} day={4} />
        <GoalSection />
    </div>
  )
}
