import { cn } from "@/shared/utils/cn"

interface DuplicateCheckButtonProps {
    onCheck: (isDuplicate: boolean) => void
}

export default function DuplicateCheckButton({ onCheck }: DuplicateCheckButtonProps) {

    const[isClick, setIsClick] = useState(false)
    const handleClick = () => {
        setIsClick(true)
        onCheck(false)
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
