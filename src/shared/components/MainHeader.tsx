import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUnreadNotificationCount } from '@/shared/api/notification'
import BellIcon from '@/icons/BellIcon'
import DefaultProfileIcon from '@/icons/DefaultProfileIcon'

export default function MainHeader() {
  const navigate = useNavigate()
  const [hasUnread, setHasUnread] = useState(false)

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

  return (
    <div className="w-full h-26.5 flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <DefaultProfileIcon width={28} height={28} />
        <p className="font-bold text-base">가나다</p>
      </div>
      <button onClick={() => navigate('/notification')}>
        <BellIcon hasNotification={hasUnread} />
      </button>
    </div>
  )
}
