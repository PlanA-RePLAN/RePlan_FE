import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// components
import Title from '@/shared/components/Title'
import DefaultProfileIcon from '@/icons/DefaultProfileIcon'
import ProfileInput from './components/ProfileInput'
import BackHeaderLayout from '@/shared/components/BackHeaderLayout'
import MainButton from '@/shared/components/MainButton'

export default function ProfileSetup() {
  const [name, setName] = useState('')
  const [isNameValid, setIsNameValid] = useState(false)
  const navigate = useNavigate()

  return (
    <BackHeaderLayout title="프로필 입력">
      <div className="px-5 w-full flex flex-col justify-center items-center">
        <div className="flex flex-col w-full mt-8">
          <Title>
            <div>안녕하세요,</div>
            <div>프로필을 입력해주세요!</div>
          </Title>
        </div>
        <div className="flex justify-center relative w-30 mt-10">
          <DefaultProfileIcon />
          <div className="w-7 h-7 bg-white border border-bluegray-light-hover flex justify-center items-center rounded-full absolute bottom-0 right-0">
            <img src="/src/assets/camera.svg" alt="" />
          </div>
        </div>
        <div className="w-full mt-10 relative">
          <ProfileInput
            value={name}
            onChange={setName}
            onValidChange={setIsNameValid}
          />
        </div>
        <MainButton
          title={'다음으로'}
          option={isNameValid ? 'primary' : 'disabled'}
          onClick={() => {
            navigate('/onboarding')
          }}
          className="mt-10"
        />
      </div>
    </BackHeaderLayout>
  )
}
