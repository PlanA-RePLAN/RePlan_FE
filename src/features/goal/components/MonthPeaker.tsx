import BottomSheetHeader from "@/shared/components/BottomSheetHeader"
import { useState } from "react"
import { cn } from "@/shared/utils/cn"

interface MonthPeakerProps {
    year?: number 
    onClose: () => void
    onConfirm: (year: number, mon: number) => void
}

export default function MonthPeaker({ year, onClose, onConfirm }:MonthPeakerProps) {
    const [currentYear, setCurrentYear] = useState(year ?? 2026)
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined)
    const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="px-4 pt-2 pb-4">
         <BottomSheetHeader
            title={`${currentYear}년`}
            onPrev={() => setCurrentYear((m) => m - 1)}
            onNext={() => setCurrentYear((m) => m + 1)}
            onClose={onClose}
            onConfirm={() => selectedMonth !== undefined && onConfirm(currentYear, selectedMonth)}
            confirmDisabled={selectedMonth === undefined}
        />
         <div className="grid grid-cols-4 gap-[9px]">
            {months.map((month) => (
                <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={cn(
                        'py-[9.5px] rounded-lg text-sm',
                        selectedMonth === month
                            ? 'bg-bluegray-black text-white font-bold'
                            : 'text-bluegray-dark font-semibold'
                    )}
                >
                    {month}월
                </button>
            ))}
        </div>
    </div>
  )
}
