import { cn } from '@/shared/utils/cn'
import { useState } from 'react'
import { checkNickname } from '@/shared/api/auth'

interface DuplicateCheckButtonProps {
  nickname: string,
  onCheck: (isDuplicate: boolean) => void
}

export default function DuplicateCheckButton({
  nickname, onCheck,
}: DuplicateCheckButtonProps) {
  const [isClick, setIsClick] = useState(false)
  
  const handleClick = async () => {
    try{
      const res = await checkNickname(nickname)
      if(!res.success || !res.data){
        onCheck(true)
        return
      }
      setIsClick(true)
      onCheck(!res.data.available)
    }catch{
      onCheck(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-[66px] h-[29px] bg-bluegray-light-active rounded-lg text-xs absolute top-10.5 right-4',
        isClick
          ? 'text-bluegray-dark-hover'
          : 'text-bluegray-normal hover:text-bluegray-dark-hover',
      )}
    >
      중복확인
    </button>
  )
}
