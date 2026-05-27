import { useState } from "react"

interface DateSectionProps {
  date: string
}

export default function DateSection({
    date
}:DateSectionProps) {
  const [year, month, day] = date.split('-').map(Number)
  return (
    <div className="w-full h-10 flex items-center px-4 bg-bluegray-light rounded-xl">
        <p>{year}년 {month}월 {day}일</p>
    </div>
  )
}
