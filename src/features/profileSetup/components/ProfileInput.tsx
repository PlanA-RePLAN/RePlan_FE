import Input from '@/shared/components/Input'
import DuplicateCheckButton from './DuplicateCheckButton'
import { useState } from 'react'

interface ProfileInputProps {
  value: string
  onChange?: (value: string) => void
  onValidChange?: (isValid: boolean) => void
}

export default function ProfileInput({
  value,
  onChange,
  onValidChange,
}: ProfileInputProps) {
  const [isCheck, setIsCheck] = useState(false)
  const [isDuplicate, setIsDuplicate] = useState(false)

  const handleChange = (value: string) => {
    onChange?.(value)
    setIsCheck(false)
    onValidChange?.(false)
  }

  const handleCheck = (duplicate: boolean) => {
    setIsCheck(true)
    setIsDuplicate(duplicate)
    onValidChange?.(!duplicate)
  }

  return (
    <div className="relative">
      <Input
        value={value}
        setValue={handleChange}
        maxLength={10}
        showCount="always"
      >
        <Input.Label option="secondary">이름</Input.Label>
        <Input.Field placeholder="이름을 입력해주세요" />
        <Input.Bottom>
          <Input.Count />
        </Input.Bottom>
      </Input>
      <DuplicateCheckButton onCheck={handleCheck} />
      {isCheck && (
        <p className="absolute top-21 text-xs text-bluegray-normal flex">
          {isDuplicate ? (
            <>
              <img src="/src/assets/danger.svg" alt="" className="mr-2" />
              <span className="text-danger font-bold">플렌에이</span>는 이미
              등록된 이름입니다.
            </>
          ) : (
            <>
              <span className="text-blue-normal font-bold">플렌에이</span>는
              사용하실 수 있는 이름입니다.
            </>
          )}
        </p>
      )}
    </div>
  )
}
