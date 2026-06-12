import BackHeaderLayout from "@/shared/components/BackHeaderLayout"
import NotificationItem from "./components/NotificationItem"

export default function NotificationSetting() {
  const NOTIFICATION_ITEMS = [
    { id: 1, title: "투두 알림", content: "주요 투두 마감, 실패 투두 등 투두리스트 관련 알림"},
    { id: 2, title: "통계 알림", content: "월간 리포트 및 분석 통계 도착 알림"},
    { id: 3, title: "기타 알림", content: "그 밖의 사용자에게 필요한 소식 알림"},
  ]

  return (
    <div>
        <BackHeaderLayout title="알림 설정">
        </BackHeaderLayout>
        {NOTIFICATION_ITEMS.map((item) => (
          <NotificationItem key={item.id} title={item.title} content={item.content}/>
        ))}
    </div>
  )
}
