import client from './client'
import type { ApiResponse, NicknameCheckData, OAuthLoginData } from '@/shared/types/auth'

export async function kakaoOAuthLogin(
  accessToken: string,
): Promise<ApiResponse<OAuthLoginData>> {
  const res = await client.post<ApiResponse<OAuthLoginData>>(
    '/api/auth/oauth/kakao',
    { accessToken },
  )
  return res.data
}

export async function checkNickname(
  nickname: string,
): Promise<ApiResponse<NicknameCheckData>>{
  const res = await client.get<ApiResponse<NicknameCheckData>>(
    '/api/auth/nickname/check',
    { params: {nickname} },
  )
  return res.data
}