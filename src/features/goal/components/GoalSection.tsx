import { useState } from "react"
import CalendarIcon from "@/icons/CalendarIcon"
import MoreIcon from "@/icons/MoreIcon"
import { type Goal } from "@/shared/types"

export default function GoalSection({ goal }:{ goal : Goal}) {
    const [click, setClieck] = useState(false)
    const handleClick = () => {
        setClieck(!click)
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
                <div className="flex items-center gap-1 text-xs text-bluegray-normal">
                    <CalendarIcon />
                    <p>{goal.deadline}</p>
                </div>
            </div>
            <div>
                <MoreIcon onClick={()=>handleClick()} />
                {click && (
                    <div className="absolute flex justify-center items-center right-5 w-16.5 h-7.25 rounded-lg cursor-pointer shadow-[0px_4px_12px_rgba(0,0,0,0.08)] z-10">
                        <p className="text-xs text-bluegray-darker">삭제하기</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}
