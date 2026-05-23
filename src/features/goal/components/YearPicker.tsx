import BottomSheetHeader from "@/shared/components/BottomSheetHeader"
import { useState } from "react"
import { cn } from "@/shared/utils/cn"

interface YearPickerProps { 
  value? : number
  onClose: () => void
  onConfirm: (year: number) => void
}

export default function YearPicker({ value, onClose, onConfirm }: YearPickerProps) {
    const [startYear, setStartYear] = useState(2024)
    const [selectedYear, setSelectedYear] = useState<number | undefined>(value)
    const years = Array.from({ length: 6 }, (_, i) => startYear + i)

  return (
    <div className="px-4 pt-2 pb-4">
        <BottomSheetHeader
            title={"연도 선택"}
            onPrev={() => setStartYear((y) => y - 6)}
            onNext={() => setStartYear((y) => y + 6)}
            onClose={onClose}
            onConfirm={() => selectedYear !== undefined && onConfirm(selectedYear)}
            confirmDisabled={selectedYear === undefined}
        />
        <div className="grid grid-cols-2 gap-[9px]">
            {years.map((year) => (
                <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={cn(
                        'py-[9.5px] rounded-lg text-sm',
                        selectedYear === year ? 'bg-bluegray-black text-white font-bold' 
                        : value === year
                            ? '' 
                            : 'text-bluegray-dark font-semibold'
                    )}
                >
                    {year}년
                </button>
            ))}
        </div>
    </div>
  )
}
