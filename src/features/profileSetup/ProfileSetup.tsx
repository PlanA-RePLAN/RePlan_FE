import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const cameraSvg = '/assets/camera.svg'

// components
import Title from '@/shared/components/Title'
import DefaultProfileIcon from '@/icons/DefaultProfileIcon'
import ProfileInput from './components/ProfileInput'
import BackHeaderLayout from '@/shared/components/BackHeaderLayout'
import MainButton from '@/shared/components/MainButton'
import { registerOAuth } from '@/shared/api/auth'
import { useImageUpload } from '@/shared/hooks/useImageUpload'

export default function ProfileSetup() {
  const [name, setName] = useState('')
  const [isNameValid, setIsNameValid] = useState(false)
  const { previewUrl, fileInputRef, handleImageChange, uploadImage } = useImageUpload('new')
  const navigate = useNavigate()

  const handleClick = async () => {
    const tempToken = sessionStorage.getItem('tempToken')
    if (!tempToken) {
      navigate('/')
      return
    }
    try {
      const s3Key = await uploadImage(tempToken)
      const res = await registerOAuth(tempToken, name, s3Key ?? undefined)
      if (!res.success || !res.data) {
        sessionStorage.removeItem('tempToken')
        navigate('/')
        return
      }
      localStorage.setItem('accessToken', res.data.accessToken!)
      localStorage.setItem('refreshToken', res.data.refreshToken!)
      sessionStorage.removeItem('tempToken')
      navigate('/onboarding')
    } catch {
      navigate('/')
    }
  }

  return (
    <BackHeaderLayout title="프로필 입력">
      <div className="px-5 w-full flex flex-col justify-center items-center">
        <div className="flex flex-col w-full mt-8">
          <Title>
            <div>안녕하세요,</div>
            <div>프로필을 입력해주세요!</div>
          </Title>
        </div>
        <div
          className="flex justify-center relative w-30 mt-10 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl
            ? <img src={previewUrl} alt="프로필" className="w-30 h-30 rounded-full object-cover" />
            : <DefaultProfileIcon />
          }
          <div className="w-7 h-7 bg-white border border-bluegray-light-hover flex justify-center items-center rounded-full absolute bottom-0 right-0">
            <img src={cameraSvg} alt="" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
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
          onClick={handleClick}
          className="mt-10"
        />
      </div>
    </BackHeaderLayout>
  )
}
