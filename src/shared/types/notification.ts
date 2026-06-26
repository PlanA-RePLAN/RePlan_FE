export type NotificationCategory = 'TODO' | 'STATS' | 'ETC'

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

export interface NotificationListData {
  items: Notification[]
  nextCursor: number | null
  hasNext: boolean
}
