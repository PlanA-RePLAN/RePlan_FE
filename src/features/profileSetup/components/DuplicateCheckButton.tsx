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
  // 중복확인을 이미 수행했는지 — 같은 닉네임을 또 확인할 필요가 없으므로 누르면 비활성화한다
  const [checked, setChecked] = useState(false)

  // 닉네임을 다시 입력하면 다시 확인할 수 있게 활성화
  useEffect(() => { setChecked(false) }, [nickname])

  const disabled = checked || nickname.trim().length === 0

  const handleClick = async () => {
    try{
      const res = await checkNickname(nickname)
      if(!res.success || !res.data){
        onCheck(true)
        return
      }
      setChecked(true)
      onCheck(!res.data.available)
    }catch{
      onCheck(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-[66px] h-[29px] rounded-lg text-xs absolute top-10.5 right-4 bg-bluegray-light-active',
        disabled ? 'text-bluegray-normal' : 'text-bluegray-dark-hover',
      )}
    >
      중복확인
    </button>
  )
}
