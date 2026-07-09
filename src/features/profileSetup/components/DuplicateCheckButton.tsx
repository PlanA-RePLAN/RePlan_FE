import { cn } from '@/shared/utils/cn'
import { useEffect, useState } from 'react'
import { checkNickname } from '@/shared/api/auth'

interface DuplicateCheckButtonProps {
  nickname: string,
  onCheck: (isDuplicate: boolean) => void
}

export default function DuplicateCheckButton({
  nickname, onCheck,
}: DuplicateCheckButtonProps) {
  const [isClick, setIsClick] = useState(false)

  // 이름을 다시 입력하면 버튼을 활성 상태로 되돌림
  useEffect(() => { setIsClick(false) }, [nickname])

  const handleClick = async () => {
    try{
      const res = await checkNickname(nickname)
      if(!res.success || !res.data){
        onCheck(true)
        return
      }
      setIsClick(res.data.available)
      onCheck(!res.data.available)
    }catch{
      onCheck(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-[66px] h-[29px] rounded-lg text-xs absolute top-10.5 right-4',
        isClick
          ? 'bg-bluegray-light-active text-bluegray-dark-hover'
          : 'bg-bluegray-black text-white',
      )}
    >
      중복확인
    </button>
  )
}
