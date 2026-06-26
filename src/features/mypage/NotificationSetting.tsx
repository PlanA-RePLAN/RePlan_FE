import { type NotificationSetting } from "@/shared/types/notification"
import { getNotificationsSetting } from "@/shared/api/notification"
import { useEffect, useState } from "react"
import BackHeaderLayout from "@/shared/components/BackHeaderLayout"
import NotificationItem from "./components/NotificationItem"

export default function NotificationSetting() {
  const[setting, setSetting] = useState<NotificationSetting | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try{
        const accessToken = localStorage.getItem('accessToken') ?? ''
        const res = await getNotificationsSetting(accessToken)
        if(res.success && res.data){
          setSetting(res.data)
        }
      }
      catch(error){
        console.error(error)
      }
    }
    fetch()
  }, [])

  const NOTIFICATION_ITEMS = [
    { id: 1, title: "투두 알림", content: "주요 투두 마감, 실패 투두 알림", checked: (setting?.todoDue ?? false) && (setting?.todoFailed ?? false), },
    { id: 2, title: "통계 알림", content: "월간 리포트 및 분석 통계 도착 알림", checked: setting?.report ?? false},
    { id: 3, title: "기타 알림", content: "그 밖의 사용자에게 필요한 소식 알림", checked: true},
  ]

  return (
    <div>
        <BackHeaderLayout title="알림 설정">
          {NOTIFICATION_ITEMS.map((item) => (
          <NotificationItem key={item.id} title={item.title} content={item.content} checked={item.checked}/>
        ))}
        </BackHeaderLayout>
    </div>
  )
}
