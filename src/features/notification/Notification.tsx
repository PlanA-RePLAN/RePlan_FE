// utils
import { useState, useEffect, useRef, useCallback, ReactElement } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/shared/utils/cn"
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead } from "@/shared/api/notification"
import { useNotificationStore } from "@/store/notificationStore"
import { NotificationCategory, Notification as NotificationItem, NotificationTypeName } from "@/shared/types/notification"


// components
import BackHeaderLayout from "@/shared/components/BackHeaderLayout"
import NotificaationList from "@/features/notification/components/NotificaationList"
import NotificationIcon from "@/icons/NotificationIcon"
import ReplanNotificationIcon from "@/icons/ReplanNotificationIcon"
import StatsNotificationIcon from "@/icons/StatsNotificationIcon"
import StatisticsIcon from "@/icons/StatisticsIcon"


const TABS = ['전체', '투두', '통계', '공지', '혜택/이벤트'] as const
type Tab = typeof TABS[number]

// '전체'는 category 없이 조회 (서버가 전체 반환)
const TAB_CATEGORY_MAP: Record<Tab, NotificationCategory | undefined> = {
  '전체': undefined,
  '투두': 'TODO',
  '통계': 'STATS',
  '공지': 'NOTICE',
  '혜택/이벤트': 'MARKETING',
}

const NOTIFICATION_ICON_MAP: Record<NotificationTypeName, ReactElement> = {
  TODO_DUE_SOON: <NotificationIcon />,
  TODO_FAILED_REPLAN: <ReplanNotificationIcon />,
  REPORT_READY: <StatsNotificationIcon />,
}

function formatRelativeTime(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime()
  const minutes = Math.floor(diff / 1000 / 60)
  if (minutes < 60) 
    return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) 
    return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

export default function Notification() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('전체')
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [hasNext, setHasNext] = useState(false)
  const isLoadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const { setHasUnread } = useNotificationStore()

  // cursor 없으면 첫 페이지(목록 교체), 있으면 다음 페이지(뒤에 이어 붙임)
  const fetchNotifications = useCallback(
    async (cursor?: number) => {
      if (isLoadingRef.current) return
      isLoadingRef.current = true
      try {
        const accessToken = localStorage.getItem('accessToken') ?? ''
        const res = await getNotifications(accessToken, {
          category: TAB_CATEGORY_MAP[activeTab],
          cursor,
        })
        if (res.success && res.data) {
          const { items, nextCursor, hasNext } = res.data
          setNotifications((prev) => (cursor ? [...prev, ...items] : items))
          setNextCursor(nextCursor)
          setHasNext(hasNext)
        }
      } catch (error) {
        console.error(error)
      } finally {
        isLoadingRef.current = false
      }
    },
    [activeTab],
  )

  // 탭이 바뀌면 목록·커서를 초기화하고 첫 페이지부터 다시
  useEffect(() => {
    setNotifications([])
    setNextCursor(null)
    setHasNext(false)
    fetchNotifications()
  }, [fetchNotifications])

  // 목록 끝의 감시 요소가 화면에 들어오면 다음 페이지 요청
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasNext || nextCursor == null) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNotifications(nextCursor)
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNext, nextCursor, fetchNotifications])

  const handleNotificationClick = async (item: NotificationItem) => {
    const accessToken = localStorage.getItem('accessToken') ?? ''
    await markNotificationAsRead(accessToken, item.id)
    setNotifications((prev) =>
      prev.map((n) => n.id === item.id ? { ...n, read: true } : n)
    )

    const res = await getUnreadNotificationCount(accessToken)
    if (res.success && res.data){
      setHasUnread(res.data.count > 0)
    }

    if (item.type === 'TODO_DUE_SOON') navigate('/home')
    else if (item.type === 'REPORT_READY') navigate('/statics')
    else if (item.type === 'TODO_FAILED_REPLAN') navigate('/home')  
  }

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
              <>
                {notifications.map((item) => (
                  <NotificaationList
                    key={item.id}
                    icon={NOTIFICATION_ICON_MAP[item.type]}
                    title={item.title}
                    content={item.body}
                    notificationTime={formatRelativeTime(item.createdAt)}
                    isRead={item.read}
                    onClick={() => handleNotificationClick(item)}
                  />
                ))}
                {hasNext && <div ref={sentinelRef} className="h-1" />}
              </>
            ) : (
              <div className="flex flex-col min-h-[calc(100vh-240px)] justify-center items-center">
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
