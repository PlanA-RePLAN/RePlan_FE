import ChecvronRightIcon from "@/icons/ChevronLeftIcon"
import NotificationBadge from "./NotificationBadge"

interface MyPageListProps {
  title: string
  icon: React.ReactNode
  hasNewAlert?: boolean
  rightContent?: React.ReactNode
}

export default function MyPageList({ title, icon, hasNewAlert = false, rightContent }: MyPageListProps) {
  return (
    <div className="flex justify-between items-center p-5 border-b border-bluegray-light-hover">
      <div className="flex justify-center items-center gap-3">
        {icon}
        <p className="text-[16px]">{title}</p>
        {hasNewAlert && <NotificationBadge />}
      </div>
      {rightContent ?? <ChecvronRightIcon />}
    </div>
  )
}
