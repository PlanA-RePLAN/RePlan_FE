// utils
import { useState, useEffect, ReactElement } from "react"
import { cn } from "@/shared/utils/cn"
import { getNotifications } from "@/shared/api/notification"
import { NotificationCategory, Notification as NotificationItem, NotificationTypeName } from "@/shared/types/notification"

// components
import BackHeaderLayout from "@/shared/components/BackHeaderLayout"
import NotificaationList from "@/features/notification/components/NotificaationList"
import NotificationIcon from "@/icons/NotificationIcon"
import ReplanNotificationIcon from "@/icons/ReplanNotificationIcon"
import StatisticsIcon from "@/icons/StatisticsIcon"


const TABS = ['투두', '통계', '기타'] as const
type Tab = typeof TABS[number]

const TAB_CATEGORY_MAP: Record<Tab, NotificationCategory> = {
  '투두': 'TODO',
  '통계': 'STATS',
  '기타': 'ETC',
}

const NOTIFICATION_ICON_MAP: Record<NotificationTypeName, ReactElement> = {
  TODO_DUE_SOON: <NotificationIcon />,
  TODO_FAILED_REPLAN: <ReplanNotificationIcon />,
  REPORT_READY: <StatisticsIcon />,
}

function formatRelativeTime(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime()
  const minutes = Math.floor(diff / 1000 / 60)
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

export default function Notification() {
  const [activeTab, setActiveTab] = useState<Tab>('투두')
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken') ?? ''
        const res = await getNotifications(accessToken, {
          category: TAB_CATEGORY_MAP[activeTab],
        })
        if (res.success && res.data) {
          setNotifications(res.data.items)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchNotifications()
  }, [activeTab])

  return (
    <div>
      <BackHeaderLayout title="알림 내역">
        <div className="px-5">
          <div className="py-5 flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn('px-[14px] py-2 rounded-[19px] text-[12px]',
                  activeTab === tab
                    ? 'bg-bluegray-black text-bluegray-light font-bold'
                    : 'bg-bluegray-light text-bluegray-dark font-medium'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div>
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <NotificaationList
                  key={item.id}
                  icon={NOTIFICATION_ICON_MAP[item.type]}
                  title={item.title}
                  content={item.body}
                  notificationTime={formatRelativeTime(item.createdAt)}
                  isRead={item.read}
                />
              ))
            ) : (
              <div className="flex flex-col min-h-[calc(100vh-116px)] justify-center items-center">
                <StatisticsIcon />
                <h2 className="font-bold text-[16px] mt-6">아직 받은 알림이 없어요</h2>
                <p className="font-medium text-[12px] mt-2 text-bluegray-normal">새로운 알림이 오면 여기서 확인할 수 있어요</p>
              </div>
            )}
          </div>
        </div>
      </BackHeaderLayout>
    </div>
  )
}
