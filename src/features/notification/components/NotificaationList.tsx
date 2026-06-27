import { ReactElement } from "react"

interface NotificaationListProps{
    icon: ReactElement
    title: string
    content: string
    notificationTime: string
    isRead: boolean
    onClick: () => void
}

export default function NotificaationList({
    icon, title, content, notificationTime, isRead, onClick
}:NotificaationListProps) {
  return (
    <div className="flex items-start gap-3 pt-3" onClick={onClick}>
        <div className="relative">
            {icon}
            { !isRead && (
            <div className="absolute top-0 right-0  bg-danger w-1 h-1 rounded-full"></div>
        )}
        </div>
        <div className="flex flex-col gap-0.5 pb-3 border-b border-bluegray-light-hover">
            <h3 className="font-bold text-[14px]">{title}</h3>
            <p className="text-bluegray-dark text-[14px]">{content}</p>
            <p className=" text-bluegray-normal text-[12px]">{notificationTime}</p>
        </div>
    </div>
  )
}
