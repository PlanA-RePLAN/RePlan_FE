import { useState, useEffect } from 'react'
import { getMyInfo } from '@/shared/api/user'

const cameraSvg = '/assets/camera.svg'

// components
import BackHeaderLayout from "@/shared/components/BackHeaderLayout"
import DefaultProfileIcon from '@/icons/DefaultProfileIcon'
import ChecvronRightIcon from "@/icons/ChevronRightIcon"
import BottomSheet from '@/shared/components/BottomSheet'
import CloseButtonIcon from '@/icons/CloseButtonIcon'
import CircleCheckButtonIcon from '@/icons/CircleCheckButtonIcon'
import ProfileInput from '../profileSetup/components/ProfileInput'

type ConfirmType = 'logout' | 'deleteAccount' | null

export default function ProfileSetting() {
  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [confirmType, setConfirmType] = useState<ConfirmType>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken') ?? ''
        const res = await getMyInfo(accessToken)
        if (res.success && res.data) {
          setName(res.data.nickname)
          setEmail(res.data.email)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchMyInfo()
  }, [])

  const handleOpenConfirm = (type: ConfirmType) => setConfirmType(type)
  const handleCloseConfirm = () => setConfirmType(null)

  const handleLogout = () => { /* 로그아웃 처리 */ }
  const handleDeleteAccount = () => { /* 계정 삭제 처리 */ }

  const handleConfirm = () => {
    if (confirmType === 'logout') handleLogout()
    if (confirmType === 'deleteAccount') handleDeleteAccount()
    handleCloseConfirm()
  }

  return (
    <div>
      <BackHeaderLayout title="프로필">
         <div className="flex justify-center mt-10">
          <div className="relative w-30">
          <DefaultProfileIcon />
          <div className="w-7 h-7 bg-white border border-bluegray-light-hover flex justify-center items-center rounded-full absolute bottom-0 right-0">
            <img src={cameraSvg} alt="" />
          </div>
        </div>
        </div>

        <div className='flex justify-between mt-10 mx-[18px] p-4 border border-bluegray-light-hover rounded-[12px]'>
          <p className='text-[14px]'>이름</p>
          <div className='flex justify-center items-center gap-2'>
            {name && <p className='text-bluegray-darker font-bold text-[12px]'>{name}</p>}
            <button onClick={() => setIsBottomSheetOpen(true)}>
              <ChecvronRightIcon/>
            </button>
          </div>
        </div>

        <div className='flex justify-between mt-10 mx-[18px] p-4 border border-bluegray-light-hover rounded-[12px]'>
          <p className='text-[14px]'>연결 계정</p>
          <div className='flex justify-center items-center gap-2'>
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
      onClose={() => setIsBottomSheetOpen(false)}>
        <div className='mx-5 mb-12'>
          <div className="flex justify-between items-center mb-5">
          <button onClick={() => setIsBottomSheetOpen(false)}>
            <CloseButtonIcon />
          </button>
          <span className="text-lg font-bold">이름</span>
          <button onClick={()=>{}}>
            <CircleCheckButtonIcon/>
          </button>
        </div>
        <ProfileInput value={name ?? ''}/>
        </div>
      </BottomSheet>
      {/* 로그아웃 및 탈퇴 바텀시트*/}
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
              className="flex-1 py-3 rounded-xl bg-bluegray-light  text-danger font-semibold"
            >
              삭제
            </button>
        </div>
      </BottomSheet>
    </div>
  )
}
