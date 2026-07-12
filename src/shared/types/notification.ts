export type NotificationCategory = 'TODO' | 'STATS' | 'NOTICE' | 'MARKETING'

export type NotificationTargetType = 'TODO' | 'REPORT' | 'REPLAN' | null

export type NotificationTypeName = 'TODO_DUE_SOON' | 'TODO_FAILED_REPLAN' | 'REPORT_READY'

export interface Notification {
  id: number
  category: NotificationCategory
  type: NotificationTypeName
  title: string
  body: string
  targetType: NotificationTargetType
  targetId: number | null
  read: boolean
  createdAt: string
}

export interface NotificationList {
  items: Notification[]
  nextCursor: number | null
  hasNext: boolean
}

export interface NotificationSetting {
    todo: boolean
    stats: boolean
    notice: boolean
    // 마케팅(광고성) 정보 수신 동의. 서버가 켜고 끌 때마다 동의/철회 시각을 기록한다.
    marketing: boolean
}