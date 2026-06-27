import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getProfile, editProfile, logout, deleteAccount } from '@/shared/api/user'
import { deleteToken } from '@/shared/api/notification'
import { useImageUpload } from '@/shared/hooks/useImageUpload'

const cameraSvg = '/assets/camera.svg'

// components
import BackHeaderLayout from "@/shared/components/BackHeaderLayout"
import DefaultProfileIcon from '@/icons/DefaultProfileIcon'
import ChecvronRightIcon from "@/icons/ChevronRightIcon"
import BottomSheet from '@/shared/components/BottomSheet'
import CloseButtonIcon from '@/icons/CloseButtonIcon'
import CircleCheckButtonIcon from '@/icons/CircleCheckButtonIcon'
import ProfileInput from '../profileSetup/components/ProfileInput'
import LogoIcon, { type Provider } from './components/LogoIcon'

type ConfirmType = 'logout' | 'deleteAccount' | null

export default function ProfileSetting() {
  const navigate = useNavigate()
  const [name, setName] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [email, setEmail] = useState<string | null>(null)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [confirmType, setConfirmType] = useState<ConfirmType>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [provider, setProvider] = useState<Provider | null>(null)

  const { imageFile, previewUrl, fileInputRef, handleImageChange, uploadImage } = useImageUpload('existing')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken') ?? ''
        const res = await getProfile(accessToken)
        if (res.success && res.data) {
          setName(res.data.nickname)
          setEmail(res.data.email)
          setProvider(res.data.provider as Provider)
          setProfileImageUrl(res.data.profileImage)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    if (!imageFile) return
    const upload = async () => {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const s3Key = await uploadImage(accessToken)
      if (s3Key) await editProfile(accessToken, 'application/json', undefined, s3Key)
    }
    upload()
  }, [imageFile])

  const handleNameSave = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken') ?? ''
      const res = await editProfile(accessToken, 'application/json', editingName, undefined)
      if (res.success) {
        setName(editingName)
        setIsBottomSheetOpen(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleOpenConfirm = (type: ConfirmType) => setConfirmType(type)
  const handleCloseConfirm = () => setConfirmType(null)

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    const fcmToken = localStorage.getItem('fcmToken')
    if (fcmToken) await deleteToken(accessToken, fcmToken)
    const res = await logout(accessToken)
    if (res.success){
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('fcmToken')
      navigate('/')
    }
  }
  
  const handleDeleteAccount = async () => { 
    const accessToken = localStorage.getItem('accessToken') ?? ''
    const res = await deleteAccount(accessToken)
    if(res.success){
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/')
    }
   }

  return (
    <div>
      <BackHeaderLayout title="프로필">
        <div className="flex justify-center mt-10">
          <div
            className="relative w-30 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl || profileImageUrl
              ? <img src={previewUrl ?? profileImageUrl!} alt="프로필" className="w-30 h-30 rounded-full object-cover" />
              : <DefaultProfileIcon />
            }
            <div className="w-7 h-7 bg-white border border-bluegray-light-hover flex justify-center items-center rounded-full absolute bottom-0 right-0">
              <img src={cameraSvg} alt="" />
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        <div className='flex justify-between mt-10 mx-[18px] p-4 border border-bluegray-light-hover rounded-[12px]'>
          <p className='text-[14px]'>이름</p>
          <div className='flex justify-center items-center gap-2'>
            {name && <p className='text-bluegray-darker font-bold text-[12px]'>{name}</p>}
            <button onClick={() => {
              setEditingName(name ?? '')
              setIsBottomSheetOpen(true)
            }}>
              <ChecvronRightIcon/>
            </button>
          </div>
        </div>

        <div className='flex justify-between mt-10 mx-[18px] p-4 border border-bluegray-light-hover rounded-[12px]'>
          <p className='text-[14px]'>연결 계정</p>
          <div className='flex justify-center items-center gap-2'>
            {provider && <LogoIcon provider={provider} />}
            {email && <p className='text-bluegray-darker font-bold text-[12px]'>{email}</p>}
          </div>
        </div>

        <div className='mt-10 flex justify-center items-center gap-12'>
          <button className='text-bluegray-dark' onClick={() => handleOpenConfirm('logout')}>로그아웃</button>
          <button className='text-danger' onClick={() => handleOpenConfirm('deleteAccount')}>계정 삭제</button>
        </div>
      </BackHeaderLayout>

      {/* 이름 수정 바텀시트 */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      >
        <div className='mx-5 mb-12'>
          <div className="flex justify-between items-center mb-5">
            <button onClick={() => setIsBottomSheetOpen(false)}>
              <CloseButtonIcon />
            </button>
            <span className="text-lg font-bold">이름</span>
            <button onClick={handleNameSave}>
              <CircleCheckButtonIcon/>
            </button>
          </div>
          <ProfileInput value={editingName} onChange={setEditingName} />
        </div>
      </BottomSheet>

      {/* 로그아웃 및 탈퇴 바텀시트 */}
      <BottomSheet isOpen={confirmType !== null} onClose={handleCloseConfirm}>
        <div className='flex flex-col items-center justify-center mt-4'>
          <h2 className='text-[20px] font-semibold'>{confirmType === 'logout' ? '로그아웃 하시겠어요?' : '정말 계정을 삭제하시겠어요?'}</h2>
          <p className='text-bluegray-darker mt-5 mb-[22px]'>{confirmType === 'logout' ? '다시 로그인하면 언제든 돌아올 수 있어요.' : '탈퇴하며 모든 데이터가 삭제되며 복구할 수 없어요.'}</p>
        </div>
        <div className='flex px-5 items-center gap-2 pb-[71px]'>
          <button
            onClick={handleCloseConfirm}
            className="flex-1 py-3 rounded-xl bg-bluegray-light text-black font-semibold"
          >
            취소
          </button>
          <button
            onClick={confirmType === 'logout' ? handleLogout : handleDeleteAccount}
            className="flex-1 py-3 rounded-xl bg-bluegray-light text-danger font-semibold"
          >
            삭제
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
