import client from './client'
import type { ApiResponse, NicknameCheckData, OAuthLoginData, OAuthRegisterData } from '@/shared/types/auth'

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

export async function registerOAuth(
  tempToken: string,
  nickname: string,
  s3Key?: string,
): Promise<ApiResponse<OAuthRegisterData>>{
  const res = await client.post<ApiResponse<OAuthRegisterData>>(
    '/api/auth/oauth/register',
    { tempToken, nickname, s3Key },
  )
  return res.data
}