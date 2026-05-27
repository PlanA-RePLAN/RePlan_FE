import { useNavigate } from 'react-router-dom'
import Dropdown from '@/shared/components/Dropdown'
import GoalAddButton from './components/GoalAddButton'
import GoalCard from './components/GoalCard'
import { type GoalGroup } from '@/shared/types'
import BottomSheet from '@/shared/components/BottomSheet'
import { useState } from 'react'
import YearPicker from './components/YearPicker'
import MonthPeaker from './components/MonthPeaker'
import ChevronDownStrokeIcon from '@/icons/ChevronDownStrokeIcon'
import DefaultProfileIcon from '@/icons/DefaultProfileIcon'

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
  const navigate = useNavigate()
  const [isYearBottomSheetOpen, setIsYearBottomSheetOpen] = useState(false)
  const [isMonthBottomSheetOpen, setIsMonthBottomSheetOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined)
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined)

  const filteredGoalGroup = goalGroup.filter((group) => {
  if (selectedYear && selectedMonth) {
    return group.year === selectedYear && group.month === selectedMonth
  }
  if (selectedYear) {
    return group.year === selectedYear
  }
  if (selectedMonth) {
    return group.month === selectedMonth
  }
  return true  
})

const handleAddGoal = () => {
  navigate('/onboarding')
}

  return (
    <div className='flex flex-col h-dvh'>
        <div className='px-5'>
            <div className='flex justify-between mb-4'>
                <Dropdown
                  items={['전체', '월별', '연도별']}
                  onChange={(item) => {
                    if (item === '연도별') setIsYearBottomSheetOpen(true)
                    else if (item === '월별') setIsMonthBottomSheetOpen(true)
                    else {
                      setSelectedYear(undefined)
                      setSelectedMonth(undefined)
                    }
                  }}
                />
                <GoalAddButton onClick={handleAddGoal} />
            </div>
            {(selectedYear || selectedMonth) && (
              <div className='flex mb-4'>
                <p className='font-bold'>
                 {/* 연도만 선택됐을 때 */}
                  {selectedYear && !selectedMonth && (
                    <div className='flex gap-1'>
                      <p className='font-bold'>{`${selectedYear}년`}</p>
                      <ChevronDownStrokeIcon onClick={() => setIsYearBottomSheetOpen(true)} />
                    </div>
                  )}

                  {/* 월이 선택됐을 때 */}
                  {selectedMonth && (
                    <div className='flex gap-1'>
                      <p className='font-bold'>{`${selectedYear}년 ${selectedMonth}월`}</p>
                      <ChevronDownStrokeIcon onClick={() => setIsMonthBottomSheetOpen(true)} />
                    </div>
                  )}
                </p>
              </div>
            )}
        </div>
        <div className='flex-1 overflow-y-auto px-5 pb-27'>
          {filteredGoalGroup.length === 0 ? (
            <div className='flex flex-col w-full h-full justify-center items-center'>
              <DefaultProfileIcon width={72} height={72}/>
              <h3 className='font-bold mt-6 mb-2'>목표가 비어있어요</h3>
              <p className='text-xs text-center text-bluegray-normal'>
                목표를 추가하고 <br />
                투두리스트를 만들어보세요
              </p>
            </div>
          ) : (
            filteredGoalGroup.map((group) => (
                <GoalCard key={`${group.year}-${group.month}-${group.day}`} {...group} />
            ))
          )
        }   
        </div>
        <BottomSheet isOpen={isYearBottomSheetOpen} onClose={() => setIsYearBottomSheetOpen(false)}>
            <YearPicker
                value={selectedYear}
                onClose={() => setIsYearBottomSheetOpen(false)}
                onConfirm={(year) => {
                    setSelectedYear(year)
                    setIsYearBottomSheetOpen(false)
                }}
            />
        </BottomSheet>
        <BottomSheet isOpen={isMonthBottomSheetOpen} onClose={()=>setIsMonthBottomSheetOpen(false)}>
          <MonthPeaker
              value={selectedMonth}
              year={selectedYear}
              onClose={() => setIsMonthBottomSheetOpen(false)}
              onConfirm={(year, month) => {
                  setSelectedYear(year)
                  setSelectedMonth(month)
                  setIsMonthBottomSheetOpen(false)
              }}/>
        </BottomSheet>
    </div>
  )
}
