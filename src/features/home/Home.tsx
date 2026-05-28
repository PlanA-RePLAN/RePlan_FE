// utils
import { useState, useEffect } from "react"
import { cn } from "@/shared/utils/cn"
import { getTodos, deleteTodo, toggleTodoComplete } from "@/shared/api/todo"

// type
import type { Todo } from "@/shared/types"

// components
import ChevronDownStrokeIcon from "@/icons/ChevronDownStrokeIcon"
import DatePicker from "../onBoarding/components/DatePicker"
import Dropdown from "@/shared/components/Dropdown"
import TodoCard from "@/shared/components/TodoCard"
import BottomSheet from "@/shared/components/BottomSheet"
import MonthPeaker from "../goal/components/MonthPeaker"
import DefaultProfileIcon from "@/icons/DefaultProfileIcon"

const TABS = [
    { label: "All", value: 'all' },
    { label: "Day", value: 'day' },
    { label: "Week", value: 'week' },
    { label: "Month", value: 'month' },
]

function formatTime(dueDate: string | null): string | undefined {
    if (!dueDate) return undefined
    const date = new Date(dueDate)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function getDayTag(routineType: string | null): 'D' | 'M' | undefined {
    if (routineType === 'DAILY') return 'D'
    if (routineType === 'MONTHLY') return 'M'
    return undefined
}

export default function Home() {
    const [selectedTab, setSelectedTab] = useState<'all' | 'day' | 'week' | 'month'>('all')
    const [sort, setSort] = useState<'priority' | 'dueDate'>('priority')
    const [todos, setTodos] = useState<Todo[]>([])
    const [selectedYear, setSelectedYear] = useState<number>(2026)
    const [selectedMonth, setSelectedMonth] = useState<number>(5)
    const [isMonthBottomSheetOpen, setIsMonthBottomSheetOpen] = useState(false)
    const [isDeleteBottomSheetOpen, setIsDeleteBottomSheetOpen] = useState(false)
    const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null)

    const handleDeleteClick = (todoId: number) => {
        setDeletingTodoId(todoId)
        setIsDeleteBottomSheetOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (deletingTodoId === null) return
        setTodos(prev => prev.filter(t => t.todoId !== deletingTodoId))
        setIsDeleteBottomSheetOpen(false)
        setDeletingTodoId(null)
        try {
            const accessToken = localStorage.getItem('accessToken') ?? ''
            await deleteTodo(accessToken, deletingTodoId)
        } catch (error) {
            console.error(error)
        }
    }

    const handleToggleComplete = async (todoId: number, isCompleted: boolean) => {
        setTodos(prev =>
            prev.map(t => t.todoId === todoId ? { ...t, isCompleted: !isCompleted } : t)
        )
        try{
            const accessToken = localStorage.getItem('accessToken') ?? ''
            await toggleTodoComplete(accessToken, todoId, !isCompleted)
        } catch (error) {
            setTodos(prev =>
            prev.map(t => t.todoId === todoId ? { ...t, isCompleted } : t))
            console.error(error)
        }
    }

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken') ?? ''
                const res = await getTodos(accessToken, selectedTab, sort)
                if (res.success) setTodos(res.data ?? [])
            } catch (error) {
                console.error(error)
            }
        }
        fetchTodos()
    }, [selectedTab, sort])

    const filteredTodos = todos.filter(t => {
        if (!t.dueDate) return true
        const date = new Date(t.dueDate)
        return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth
    })

    const pinnedTodos = filteredTodos.filter(t => t.isPinned)
    const regularTodos = filteredTodos.filter(t => !t.isPinned)

    const handleSelect = (value: string) => {
        setSelectedTab(value as 'all' | 'day' | 'week' | 'month')
    }

    return (
        <div className="relative h-dvh flex flex-col px-5">

            <div className='flex gap-1'>
                <p className='font-bold'>{`${selectedYear}년 ${selectedMonth}월`}</p>
                <ChevronDownStrokeIcon onClick={() => setIsMonthBottomSheetOpen(true)} />
            </div>

            {/* 전체, 일, 월, 연도별 토글 */}
            <div className="flex mt-5 mb-5 gap-1">
                {TABS.map((tab) => (
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
            <div className="flex-1 overflow-y-auto">
                <div>
                    <DatePicker showHeader={false} />
                </div>

                {filteredTodos.length === 0 ? (
                    <div className='flex flex-col w-full justify-center items-center mt-16'>
                        <DefaultProfileIcon width={72} height={72} />
                        <h3 className='font-bold mt-6 mb-2'>오늘 할 일이 없어요</h3>
                        <p className='text-xs text-center text-bluegray-normal'>
                            투두를 추가하고 <br />
                            하루를 계획해보세요
                        </p>
                    </div>
                ) : (
                    <>
                    {/* 주요 투두 */}
                    {pinnedTodos.length > 0 && (
                        <div>
                            <div className="flex items-center gap-1 mt-8">
                                <img src="/src/assets/symbol.svg" alt="" />
                                <p className="font-bold text-[14px] text-bluegray-darker">주요 투두</p>
                            </div>
                            {pinnedTodos.map(todo => (
                                <TodoCard key={todo.todoId} status='swipeable' onDelete={() => handleDeleteClick(todo.todoId)}>
                                    <TodoCard.Icon />
                                    <TodoCard.Content>
                                        <TodoCard.Title dayTag={getDayTag(todo.routineType)}>{todo.title}</TodoCard.Title>
                                        {todo.dueDate && <TodoCard.Time>{formatTime(todo.dueDate)}</TodoCard.Time>}
                                    </TodoCard.Content>
                                    <TodoCard.Category category={todo.tagTitle ?? '미선택'} usePin pinned={todo.isPinned} setPinned={() => {}} />
                                </TodoCard>
                            ))}
                        </div>
                    )}

                    <div className="bg-bluegray-light-hover w-full h-px my-8"></div>

                    {/* 정렬된 투두 */}
                    <div className="flex flex-col gap-3">
                        <Dropdown
                            items={['마감기한순', '최신등록순', '직접설정순']}
                            onChange={(item) => setSort(item === '마감기한순' ? 'dueDate' : 'priority')}
                        />
                        <div className="h-dvh overflow-y-auto">
                            {regularTodos.map(todo => (
                                <TodoCard key={todo.todoId} status={todo.isCompleted ? 'grey' : 'swipeable-delete'} onDelete={() => handleDeleteClick(todo.todoId)}>
                                    <TodoCard.Icon onClick={() => handleToggleComplete(todo.todoId, todo.isCompleted)} checked={todo.isCompleted} />
                                    <TodoCard.Content>
                                        <TodoCard.Title dayTag={getDayTag(todo.routineType)}>{todo.title}</TodoCard.Title>
                                        {todo.dueDate && <TodoCard.Time>{formatTime(todo.dueDate)}</TodoCard.Time>}
                                    </TodoCard.Content>
                                    <TodoCard.Category category={todo.tagTitle ?? '미선택'} usePin pinned={todo.isPinned} setPinned={() => {}} />
                                </TodoCard>
                            ))}
                        </div>
                    </div>
                </>
            )}
            </div>

            {/* 투두 추가 버튼 */}
            <button className="fixed bottom-33 right-5 bg-blue-normal w-11 h-11 rounded-full flex justify-center items-center">
                <img src="/src/assets/add.svg" alt="" />
            </button>

            <BottomSheet isOpen={isDeleteBottomSheetOpen} onClose={() => setIsDeleteBottomSheetOpen(false)}>
                <div className="pt-4 pb-9 px-5 flex flex-col items-center w-full">
                    <h3 className="text-xl font-semibold">투두를 삭제하시겠습니까?</h3>
                    <div className="flex gap-3 mt-5 w-full">
                        {/* 버튼 컴포넌트로 나중에 교체 */}
                        <button
                            onClick={() => setIsDeleteBottomSheetOpen(false)}
                            className="flex-1 py-3 rounded-xl bg-bluegray-light text-black font-semibold"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="flex-1 py-3 rounded-xl bg-bluegray-light  text-danger font-semibold"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            </BottomSheet>

            <BottomSheet isOpen={isMonthBottomSheetOpen} onClose={() => setIsMonthBottomSheetOpen(false)}>
                <MonthPeaker
                    value={selectedMonth}
                    year={selectedYear}
                    onClose={() => setIsMonthBottomSheetOpen(false)}
                    onConfirm={(year, month) => {
                        setSelectedYear(year)
                        setSelectedMonth(month)
                        setIsMonthBottomSheetOpen(false)
                    }}
                />
            </BottomSheet>
        </div>
    )
}
