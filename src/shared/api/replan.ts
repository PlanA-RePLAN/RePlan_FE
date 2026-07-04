import type {
  RecommendRequest,
  RecommendData,
  SaveReplanRequest,
} from '../types/replan'
import { ApiResponse } from '../types/auth'
import client from './client'

export async function recommendReplan(
  accessToken: string,
  body: RecommendRequest,
): Promise<ApiResponse<RecommendData>> {
  const res = await client.post<ApiResponse<RecommendData>>(
    '/api/replans/recommend',
    body,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  return res.data
}

export async function saveReplan(
  accessToken: string,
  body: SaveReplanRequest,
): Promise<ApiResponse<null>> {
  const res = await client.post<ApiResponse<null>>('/api/replans', body, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.data
}
