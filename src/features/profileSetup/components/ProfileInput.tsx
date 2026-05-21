import Input from "@/shared/components/Input"
import DuplicateCheckButton from "./DuplicateCheckButton"
import { useState } from "react"

interface ProfileInputProps {
    onChange?: (value: string) => void
    onValidChange?: (isValid: boolean) => void
}

export default function ProfileInput({ onChange, onValidChange }: ProfileInputProps) {
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
        title={"이름"}
        placeholder={"이름을 입력해주세요"}
        option={"secondary"}
        showCount={"always"}
        onChange={handleChange}
        maxLength={10}
        />
        <DuplicateCheckButton onCheck={handleCheck} />
        {isCheck && (
            <p className="absolute top-21 text-xs text-bluegray-normal flex">
                {isDuplicate
                ? <>
                    <img src="/src/assets/danger.svg" alt="" className="mr-2" />
                    <span className="text-danger font-bold">플렌에이</span>는 이미 등록된 이름입니다.
                    </>
                : <>
                    <span className="text-blue-normal font-bold">플렌에이</span>는 사용하실 수 있는 이름입니다.
                    </>
                }
            </p>
        )}
    </div>
  )
}
