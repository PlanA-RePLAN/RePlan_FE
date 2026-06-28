import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProfile } from '../api/user'
import BellIcon from '@/icons/BellIcon'
import DefaultProfileIcon from '@/icons/DefaultProfileIcon'

export default function MainHeader() {
  const navigate = useNavigate()
  const [name, setName] = useState<string | null>('')

  const handleNotificationClick = () => {
    navigate('/notification')
  }

  useEffect(() => {
      const fetchProfile = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken') ?? ''
          const res = await getProfile(accessToken)
          if (res.success && res.data) {
            setName(res.data.nickname)
          }
        } catch (error) {
          console.error(error)
        }
      }
      fetchProfile()
    }, [])

  return (
    <div className="w-full h-26.5 flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <DefaultProfileIcon width={28} height={28} />
        <p className="font-bold text-base">{name}</p>
      </div>
      <button onClick={handleNotificationClick}>
        <BellIcon hasNotification={false} />
      </button>
    </div>
  )
}
