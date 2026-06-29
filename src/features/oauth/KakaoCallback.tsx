import { useEffect } from 'react'

export default function KakaoCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      window.location.href = `com.plana.replan://oauth?code=${code}`
    }
  }, [])

  return null
}
