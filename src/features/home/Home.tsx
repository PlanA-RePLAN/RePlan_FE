import ChevronDownStrokeIcon from "@/icons/ChevronDownStrokeIcon"
import { useState } from "react"
import { cn } from "@/shared/utils/cn"
import DatePicker from "../onBoarding/components/DatePicker"
import Dropdown from "@/shared/components/Dropdown"
import TodoCard from "@/shared/components/TodoCard"

const TABS = [
    { label: "All", value : 'all' },
    { label: "Day", value : 'day' },
    { label: "Week", value : 'week' },
    { label: "Month", value : 'month' },
]

const TODO_GROUP = [
    {
      id: 1,
      title: '영단어 100개 암기',
      time: '11:00 AM',
      category: 'Study',
      dayTag: 'D',
      pinned: true
    },
    {
      id: 2,
      title: '모의고사 풀기',
      time: '6:00 PM',
      category: 'Study',
      dayTag: 'M',
      pinned: false
    },
    {
      id: 3,
      title: '경제원론 공부',
      time: '8:00 PM',
      category: 'Study',
      pinned: false
    },
  ]

export default function Home() {
    const[isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
    const [selectedTab, setSelectedTab] = useState('all')
    const handleSelect = (value: string) => {
        setSelectedTab(value)
    }

  return (
    <div className="relative px-5">

         <div className='flex gap-1'>
            <p className='font-bold'>2026년 5월</p>
            <ChevronDownStrokeIcon onClick={() => {}} />
        </div>

        {/* 전체, 일, 월, 연도별 토글 */}
        <div className="flex mt-5 mb-5 gap-1">
            {TABS.map((tab)=>(
                <p key={tab.value} 
                   onClick={() => handleSelect(tab.value)}
                   className={cn("px-3.5 py-2 rounded-[19px] text-[12px] cursor-pointer",
                    selectedTab === tab.value ? "bg-bluegray-black text-white" : "bg-bluegray-light text-bluegray-dark"
                   )}>
                    {tab.label}
                </p>
            ))}
        </div>

        {/* 캘린더 영역 */}
        <div>
            <DatePicker showHeader={false}/>
        </div>

        {/* 주요 투두 */}
        <div>
            <div className="flex items-center gap-1 mt-8">
                <img src="/src/assets/symbol.svg" alt="" />
                <p className="font-bold text-[14px] text-bluegray-darker">주요 투두</p>
            </div>
            <TodoCard>
                <TodoCard.Icon />
                <TodoCard.Content>
                    <TodoCard.Title dayTag="D" >영어단어 100개 암기</TodoCard.Title>
                    <TodoCard.Time>11:00 AM</TodoCard.Time>
                </TodoCard.Content>
                <TodoCard.Category category="Study" usePin pinned={true} setPinned={()=>{}} />
            </TodoCard>
        </div>

        <div className="bg-bluegray-light-hover w-full h-px my-8"></div>
    
        {/* 정렬된 투두 */}
        <div className="flex flex-col gap-3">
            <Dropdown items={['마감기한순', '최신등록순']} onChange={()=>{}} />
            <div className="h-dvh overflow-y-auto">
                {TODO_GROUP.map((todo) => (
                    <TodoCard key={todo.id}>
                        <TodoCard.Icon />
                        <TodoCard.Content>
                            <TodoCard.Title dayTag={todo.dayTag} >{todo.title}</TodoCard.Title>
                            <TodoCard.Time>{todo.time}</TodoCard.Time>
                        </TodoCard.Content>
                        <TodoCard.Category category={todo.category} usePin pinned={todo.pinned} />
                    </TodoCard>
                ))}
            </div>

        </div>
        
        {/* 투두 추가 버튼 */}
        <button className="fixed bottom-33 right-5 bg-blue-normal w-11 h-11 rounded-full flex justify-center items-center">
            <img src="/src/assets/add.svg" alt="" />
        </button>
    </div>
  )
}
