import { type NotificationSetting } from "@/shared/types/notification"
import { getNotificationsSetting, updateNotificationsSetting } from "@/shared/api/notification"
import { useEffect, useState } from "react"
import BackHeaderLayout from "@/shared/components/BackHeaderLayout"
import NotificationItem from "./components/NotificationItem"

export default function NotificationSetting() {
  const[setting, setSetting] = useState<NotificationSetting | null>(null)

  // 바뀐 항목 하나만 PATCH로 보낸다. 나머지 항목은 서버가 기존 값을 유지한다.
  const handleChange = (key: keyof NotificationSetting) => async (value: boolean) => {
    setSetting((prev) => prev ? { ...prev, [key]: value } : prev)
    const accessToken = localStorage.getItem('accessToken') ?? ''
    await updateNotificationsSetting(accessToken, { [key]: value })
  }

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
    { id: 1, title: "투두 알림", content: "주요 투두 마감, 실패 투두 알림", checked: setting?.todo ?? false, onChange: handleChange('todo') },
    { id: 2, title: "통계 알림", content: "월간 리포트 및 분석 통계 도착 알림", checked: setting?.stats ?? false, onChange: handleChange('stats')},
    { id: 3, title: "공지 알림", content: "서비스 소식 및 공지사항 알림", checked: setting?.notice ?? false, onChange: handleChange('notice')},
    { id: 4, title: "혜택/이벤트", content: "마케팅 푸시 동의", checked: setting?.marketing ?? false, onChange: handleChange('marketing')},
  ]

  return (
    <div>
        <BackHeaderLayout title="알림 설정">
          {NOTIFICATION_ITEMS.map((item) => (
          <NotificationItem key={item.id} title={item.title} content={item.content} checked={item.checked} onChange={item.onChange}/>
        ))}
        </BackHeaderLayout>
    </div>
  )
}
