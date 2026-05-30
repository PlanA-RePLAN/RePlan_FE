interface GoalAddButtonProps {
  onClick: () => void
}

export default function GoalAddButton({ onClick }: GoalAddButtonProps) {
  return (
    <button onClick={onClick} className="flex justify-center items-center gap-2 w-21.75 h-7.75 rounded-[30px] bg-bluegray-black text-white">
        <p className="text-xs">+</p>
        <p className="text-xs">목표 추가</p>
    </button>
  )
}
