import client from './client'
import type { ApiResponse, OAuthLoginData } from '@/shared/types/auth'

export async function kakaoOAuthLogin(
  accessToken: string,
): Promise<ApiResponse<OAuthLoginData>> {
  const res = await client.post<ApiResponse<OAuthLoginData>>(
    '/api/auth/oauth/kakao',
    { accessToken },
  )
  return res.data
}
