import { useEffect } from 'react'

export default function NaverCallback() {
  useEffect(() => {
    // 네이버 암시적 플로우는 토큰을 hash(#access_token=...&state=...)로 전달
    const params = new URLSearchParams(window.location.hash.replace('#', '?'))
    const accessToken = params.get('access_token')
    const state = params.get('state')
    if (accessToken && state) {
      window.location.href = `com.plana.replan://oauth/naver?access_token=${accessToken}&state=${state}`
    }
  }, [])

  return null
}
