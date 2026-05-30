import BellIcon from '@/icons/BellIcon'
import DefaultProfileIcon from '@/icons/DefaultProfileIcon'

export default function MainHeader() {
  return (
    <div className="w-full h-26.5 flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <DefaultProfileIcon width={28} height={28} />
        <p className="font-bold text-base">가나다</p>
      </div>
      <BellIcon hasNotification={false} />
    </div>
  )
}
