interface DateSectionProps {
    year : number
    month : number
    day : number
}

export default function DateSection({
    year,
    month,
    day,
}:DateSectionProps) {
  return (
    <div className="w-full h-10 flex items-center px-4 bg-bluegray-light rounded-xl">
        <p>{year}년 {month}월 {day}일</p>
    </div>
  )
}
