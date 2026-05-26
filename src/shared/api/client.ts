import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        localStorage.clear()
        window.location.href = '/'
        return Promise.reject(error)
      }

      try {
        const res = await axios.post(
          `${BASE_URL}/api/auth/reissue`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        )
        const { accessToken, refreshToken: newRefreshToken } = res.data.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return client(originalRequest)
      } catch {
        localStorage.clear()
        window.location.href = '/'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error) 
  },
)

export default client
