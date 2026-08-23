import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let waitQueue: ((token: string) => void)[] = []

function flushQueue(token: string) {
  waitQueue.forEach((resolve) => resolve(token))
  waitQueue = []
}

function clearAndRedirect() {
  isRefreshing = false
  waitQueue = []
  localStorage.clear()
  window.location.href = '/'
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // 이미 refresh 중이면 완료될 때까지 대기 후 새 토큰으로 재시도
      if (isRefreshing) {
        return new Promise<string>((resolve) => {
          waitQueue.push(resolve)
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return client(originalRequest)
        })
      }

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        clearAndRedirect()
        return Promise.reject(error)
      }

      isRefreshing = true

      try {
        const res = await axios.post(
          '/api/auth/reissue',
          {},
          { baseURL: BASE_URL, headers: { Authorization: `Bearer ${refreshToken}` } },
        )
        const { accessToken, refreshToken: newRefreshToken } = res.data.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        isRefreshing = false
        flushQueue(accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return client(originalRequest)
      } catch {
        clearAndRedirect()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default client
