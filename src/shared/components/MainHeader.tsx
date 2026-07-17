import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotificationStore } from '@/store/notificationStore'
import { getUnreadNotificationCount } from '@/shared/api/notification'
import { getProfile } from '../api/user'
import { useProfileStore } from '@/store/profileStore'
import { type Provider } from '@/features/mypage/components/LogoIcon'
import BellIcon from '@/icons/BellIcon'
import DefaultProfileIcon from '@/icons/DefaultProfileIcon'

export default function MainHeader() {
  const navigate = useNavigate()
  const { name, profileImageUrl, setProfile } = useProfileStore()
  const { hasUnread, setHasUnread } = useNotificationStore()

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken') ?? ''
        const res = await getUnreadNotificationCount(accessToken)
        if (res.success && res.data) {
          setHasUnread(res.data.count > 0)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchUnreadCount()
  }, [])

  const handleNotificationClick = () => {
    navigate('/notification')
  }

  useEffect(() => {
      const fetchProfile = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken') ?? ''
          const res = await getProfile(accessToken)
          if (res.success && res.data) {
            setProfile(res.data.nickname, res.data.profileImage, res.data.email, res.data.provider as Provider)
          }
        } catch (error) {
          console.error(error)
        }
      }
      fetchProfile()
    }, [])

  return (
    <div className="sticky top-0 z-50 bg-white w-full h-26.5 flex items-center justify-between px-5 pt-6">
      <div className="flex items-center gap-3">
        {profileImageUrl
          ? <img src={profileImageUrl} alt="프로필" className="w-7 h-7 rounded-full object-cover" />
          : <DefaultProfileIcon width={28} height={28} />
        }
        <p className="font-bold text-base">{name}</p>
      </div>
      <button onClick={handleNotificationClick}>
        <BellIcon hasNotification={hasUnread} />
      </button>
    </div>
  )
}
