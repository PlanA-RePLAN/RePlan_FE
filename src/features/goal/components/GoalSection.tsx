import { useState } from "react"
import CalendarIcon from "@/icons/CalendarIcon"
import MoreIcon from "@/icons/MoreIcon"
import { type Goal } from "@/shared/types"
import { cn } from "@/shared/utils/cn"
import BottomSheet from "@/shared/components/BottomSheet"

export default function GoalSection({ goal }:{ goal : Goal}) {
    const [click, setClieck] = useState(false)
    const handleClick = () => {
        setClieck(!click)
    }

    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
    const handleDelete = () => {
        setIsBottomSheetOpen(!isBottomSheetOpen)
    }
    
    const[check, setCheck] = useState(false)
    const handleCheck = () => {
        setCheck(!check)
    }
  return (
    <div className="flex items-start gap-4">
         <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 border border-bluegray-light-active rounded-full"></div>
            <div className="w-px h-14 bg-bluegray-light-active"></div>
        </div>
        <div className="w-full h-16.5 flex justify-between ">
            <div>
                <h1 className="text-base mb-1">{goal.title}</h1>
                {goal.deadline && (
                    <div className="flex items-center gap-1 text-xs text-bluegray-normal">
                        <CalendarIcon />
                        <p>{goal.deadline}</p>
                    </div>
                )}
            </div>
            <div>
                <MoreIcon onClick={()=>handleClick()} />
                {click && (
                    <div
                    onClick={()=>handleDelete()} 
                    className="absolute flex justify-center items-center right-5 w-16.5 h-7.25 rounded-lg cursor-pointer shadow-[0px_4px_12px_rgba(0,0,0,0.08)] z-10">
                        <p className="text-xs text-bluegray-darker">삭제하기</p>
                    </div>
                )}
            </div>
            <BottomSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}>
                    <div className="pt-4 pb-9.25 px-5 flex flex-col items-center w-full">
                        <h3 className="text-xl font-semibold">목표를 삭제하시겠습니까?</h3>
                        <div className="flex gap-2 items-center mt-5">
                            <div className="relative w-4.5 h-4.5">
                                <input
                                    onClick={() => handleCheck()}
                                    className={cn("appearance-none w-full h-full rounded-[5px]",
                                        check ?  'bg-bluegray-black' : 'border border-bluegray-black'
                                    )}
                                    type="checkbox"
                                />
                                {check && <img className="absolute inset-0 m-auto pointer-events-none" src="/src/assets/check.svg" alt="" />}
                            </div>
                            <p>목표를 추가할 때 만든 투두도 함께 삭제할게요</p>
                        </div>
                        <div className="mt-5">
                            {/* 버튼 컴포넌트 */}
                        </div>
                    </div>
            </BottomSheet>
        </div>
    </div>
  )
}
