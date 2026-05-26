export interface OAuthLoginData {
  isNewUser: boolean
  tempToken: string | null
  accessToken: string | null
  refreshToken: string | null
}

export interface ApiResponse<T> {
  status: number
  success: boolean
  data: T | null
  error: string | null
}