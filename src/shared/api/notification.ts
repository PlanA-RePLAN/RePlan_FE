import { ApiResponse } from '../types/auth'
import { NotificationCategory, NotificationListData } from '../types/notification'
import client from './client'

export async function getNotifications(
  accessToken: string,
  params?: {
    category?: NotificationCategory
    cursor?: number
    size?: number
  },
): Promise<ApiResponse<NotificationListData>> {
  const res = await client.get<ApiResponse<NotificationListData>>(
    '/api/notifications',
    {
      params,
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  return res.data
}
