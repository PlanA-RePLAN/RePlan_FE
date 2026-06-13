// utils
import { useState } from "react"
import { cn } from "@/shared/utils/cn"

// components
import BackHeaderLayout from "@/shared/components/BackHeaderLayout"
import NotificaationList from "@/features/notification/components/NotificaationList"
import NotificationIcon from "@/icons/NotificationIcon"
import ReplanNotificationIcon from "@/icons/ReplanNotificationIcon"
import StatisticsIcon from "@/icons/StatisticsIcon"


const TABS = ['투두', '통계', '기타'] as const
type Tab = typeof TABS[number]

const NOTIFICATION_SECTIONS = [
  { type: 'todo', label: '투두 알림', icon: <NotificationIcon/>, 
    title: "'단어 50개 암기 후..'투두", content: "주요 투두로 설정한 투두의 마감 시간이 하루 남았어요.", notificationTime: "10시간 전", isRead: true  
  },
  
  { type: 'todo', label: '리플랜 알림', icon: <ReplanNotificationIcon/>,
    title: "오늘 실패한 투두 2개 있어요.", content: "실패한 투두의 리플랜을 진행해보세요", notificationTime: "1일 전", isRead: false
  },

  { type: 'static', label: '통계 알림', icon: <ReplanNotificationIcon/>,
    title: "5월 통계", content: "월간 통계 및 분석이 도착했어요. 지금 바로 확인해보세요!", notificationTime: "1일 전", isRead: false
  },
]

const TAB_TYPE_MAP: Record<Tab, string> = {
  '투두': 'todo',
  '통계': 'static',
  '기타': 'etc',
}

export default function Notification() {
  const [activeTab, setActiveTab] = useState<Tab>('투두')

  const filteredNotifications = NOTIFICATION_SECTIONS.filter(
    (item) => item.type === TAB_TYPE_MAP[activeTab]
  )

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
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <NotificaationList
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  content={item.content}
                  notificationTime={item.notificationTime}
                  isRead={item.isRead}
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
