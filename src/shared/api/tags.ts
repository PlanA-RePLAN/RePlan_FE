import type { CreateTagRequest, CreateTagData, Tag } from '../types/tag'
import { ApiResponse } from '../types/auth'
import client from './client'

export async function getTags(
  accessToken: string,
): Promise<ApiResponse<Tag[]>> {
  const res = await client.get<ApiResponse<Tag[]>>('/api/tags', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.data
}

export async function createTag(
  accessToken: string,
  body: CreateTagRequest,
): Promise<ApiResponse<CreateTagData>> {
  const res = await client.post<ApiResponse<CreateTagData>>('/api/tags', body, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.data
}
