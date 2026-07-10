// 상세보기용 읽기전용 행: [아이콘] 라벨 ...... [값 알약]
// DeadlineInput의 행 스타일을 공유한다.
interface InfoRowProps {
  icon: React.ReactNode
  label: string
  value: string | null
}

export default function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center py-4 w-full border-b border-bluegray-light-hover">
      <div className="flex gap-2 items-center">
        <div className="w-5.5 h-5.5 rounded-full bg-bluegray-light-active flex items-center justify-center">
          {icon}
        </div>
        <div className="text-sm font-medium">{label}</div>
      </div>
      {value && (
        <div className="text-bluegray-dark-active text-xs font-bold py-1 px-3 rounded-full bg-blue-light">
          {value}
        </div>
      )}
    </div>
  )
}
