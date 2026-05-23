import ChevronDownIcon from "@/icons/ChevronDownIcon"
import { useState } from "react"

const PERIOD = [ "전체", "월별", "연도별"]

interface PeriodDropdownProps {
    onYearSelect? : () => void
    onMonthSelect? : () => void
    onReset: () => void
}

export default function PeriodDropdown({ onYearSelect, onMonthSelect, onReset } :PeriodDropdownProps) {
    
    const[isOpen, setIsOpen] = useState(false)
    const isOpenDropdown = () => {
        setIsOpen(!isOpen)
    }

    const[value, setValue] = useState(PERIOD[0])
    const handleClick = (item: string) =>{
        setValue(item)
        setIsOpen(false)
        if (item === '연도별'){
            onYearSelect?.()
        }else if (item === '월별'){
            onMonthSelect?.()
        }
        else{
            onReset?.()
        }
    }

  return (
    <div className="relative">
        <div
        onClick={()=>isOpenDropdown()}
        className="w-21 h-7.75 rounded-2xl bg-white border border-bluegray-light-hover
        flex items-center justify-center gap-1.25">
            <p className="text-xs font-semibold">{value}</p>
            <ChevronDownIcon className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} />
        </div>
        {isOpen && (
            <div className="absolute top-9 w-21 h-25.5 py-1.5 bg-white rounded-md shadow-[0px_4px_12px_rgba(0,0,0,0.08)] z-10">
                {PERIOD.map((item) => (
                    <div key={item}
                        onClick={(e) => { e.stopPropagation(); handleClick(item) }}
                        className="py-1.75 flex justify-center items-center hover:bg-bluegray-light cursor-pointer">
                            <p className="text-bluegray-darker text-xs">{item}</p>
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}
