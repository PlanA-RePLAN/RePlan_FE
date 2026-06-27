import { ApiResponse } from '../types/auth'
import { NotificationCategory, NotificationList, NotificationSetting } from '../types/notification'
import client from './client'

export async function getUnreadNotificationCount(
  accessToken: string,
): Promise<ApiResponse<{ count: number }>> {
  const res = await client.get<ApiResponse<{ count: number }>>(
    '/api/notifications/unread-count',
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  return res.data
}

export async function getNotifications(
  accessToken: string,
  params?: {
    category?: NotificationCategory
    cursor?: number
    size?: number
  },
): Promise<ApiResponse<NotificationList>> {
  const res = await client.get<ApiResponse<NotificationList>>(
    '/api/notifications',
    {
      params,
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  return res.data
}

export async function getNotificationsSetting(
  accessToken: string,
): Promise<ApiResponse<NotificationSetting>> {
  const res = await client.get<ApiResponse<NotificationSetting>>(
    '/api/notifications/settings',
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  return res.data
}

export async function updateNotificationsSetting(
    accessToken: string,
    body: Partial<NotificationSetting>
): Promise<ApiResponse<NotificationSetting>>{
    const res = await client.patch<ApiResponse<NotificationSetting>>(
        '/api/notifications/settings',
         body,
        { headers: { Authorization: `Bearer ${accessToken}`}},
    )
    return res.data
}

export async function markNotificationAsRead(
  accessToken: string,
  notificationId : number
): Promise<ApiResponse<null>>{
  const res = await client.patch<ApiResponse<null>>(
    `/api/notifications/${notificationId}/read`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}`}},
  )
  return res.data
}

 export async function registerToken(
  accessToken: string,
  token: string,
  platform: 'WEB' | 'ANDROID' | 'IOS',
): Promise<ApiResponse<null>> {
  const res = await client.post<ApiResponse<null>>(
    '/api/notifications/tokens',
    { token, platform },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  return res.data
}

export async function deleteToken(
  accessToken: string,
  token: string,
): Promise<ApiResponse<null>> {
  const res = await client.delete<ApiResponse<null>>(
    '/api/notifications/tokens',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { token },
    },
  )
  return res.data
}