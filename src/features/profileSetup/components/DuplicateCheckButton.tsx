import { useState } from "react"
import { cn } from "@/shared/utils/cn"

export default function DuplicateCheckButton() {
    
    const[isClick, setIsClick] = useState(false)
    const handleClick = () => {
        setIsClick(true)
    }

  return (
    <button 
    onClick={handleClick}
    
    className={cn(
        "w-[66px] h-[29px] bg-bluegray-light-active rounded-lg text-xs absolute top-10.5 right-4",
        isClick ? 'text-bluegray-dark-hover' : 'text-bluegray-normal hover:text-bluegray-dark-hover'
        )}>
        중복확인
    </button>
  )
}
