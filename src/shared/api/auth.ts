import client from './client'
import type { ApiResponse, NicknameCheckData, OAuthLoginData, OAuthRegisterData, PresignedUrlData } from '@/shared/types/auth'

export async function kakaoOAuthLogin(
  accessToken: string,
): Promise<ApiResponse<OAuthLoginData>> {
  const res = await client.post<ApiResponse<OAuthLoginData>>(
    '/api/auth/oauth/kakao',
    { accessToken },
  )
  return res.data
}

export async function googleOAuthLogin(
  credential: string,
): Promise<ApiResponse<OAuthLoginData>> {
  const res = await client.post<ApiResponse<OAuthLoginData>>(
    '/api/auth/oauth/google',
    { credential },
  )
  return res.data
}

export async function naverOAuthLogin(
  accessToken: string,
): Promise<ApiResponse<OAuthLoginData>> {
  const res = await client.post<ApiResponse<OAuthLoginData>>(
    '/api/auth/oauth/naver',
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
    { nickname, s3Key },
    { headers: { Authorization: `Bearer ${tempToken}` } }
  )
  return res.data
}

export async function getPresignedUrl(
  tempToken: string,
  filename: string,
  contentType: string,
): Promise<ApiResponse<PresignedUrlData>> {
  const res = await client.get<ApiResponse<PresignedUrlData>>(
    '/api/s3/presigned-url',
    {
      headers: { Authorization: `Bearer ${tempToken}` },
      params: { filename, contentType },
    },
  )
  return res.data
}

export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
}