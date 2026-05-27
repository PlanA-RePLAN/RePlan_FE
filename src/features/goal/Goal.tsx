// utils
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react' 
import { getGoals } from '@/shared/api/goal'

// type
import { type GoalGroup } from '@/shared/types'

// components
import Dropdown from '@/shared/components/Dropdown'
import GoalAddButton from './components/GoalAddButton'
import GoalCard from './components/GoalCard'
import BottomSheet from '@/shared/components/BottomSheet'
import YearPicker from './components/YearPicker'
import MonthPeaker from './components/MonthPeaker'
import ChevronDownStrokeIcon from '@/icons/ChevronDownStrokeIcon'
import DefaultProfileIcon from '@/icons/DefaultProfileIcon'

export default function Goal() {
  const navigate = useNavigate()
  const [goalGroup, setGoalGroup] = useState<GoalGroup[]>([])
  const [isYearBottomSheetOpen, setIsYearBottomSheetOpen] = useState(false)
  const [isMonthBottomSheetOpen, setIsMonthBottomSheetOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined)
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined)

  const filteredGoalGroup = goalGroup.filter((group) => {
    const [year, month] = group.date.split('-').map(Number)
  if (selectedYear && selectedMonth) {
    return year === selectedYear && month === selectedMonth
  }
  if (selectedYear) {
    return year === selectedYear
  }
  if (selectedMonth) {
    return month === selectedMonth
  }
  return true  
})

useEffect(()=>{
  const fetchGoals = async () => {
    try{
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const res = await getGoals(accessToken, selectedYear, selectedMonth)
      if(res.success)
        setGoalGroup(res.data ?? [])
    } catch (error){
      console.error(error)
    }
  }
  fetchGoals()
},[])


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
                <GoalCard key={group.date} {...group} />
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
