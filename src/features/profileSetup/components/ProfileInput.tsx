import Input from '@/shared/components/Input'
import DuplicateCheckButton from './DuplicateCheckButton'
import { useState } from 'react'

export default function ProfileInput() {
  const [name, setName] = useState('')
  const [isCheck] = useState(false)
  const [isDuplicate] = useState(false)

  return (
    <div className="relative">
      <Input value={name} setValue={setName} maxLength={10} showCount="always">
        <Input.Label option="secondary">이름</Input.Label>
        <Input.Field placeholder="이름을 입력해주세요" />
        <Input.Bottom>
          <Input.Count />
        </Input.Bottom>
      </Input>
      <DuplicateCheckButton />
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
