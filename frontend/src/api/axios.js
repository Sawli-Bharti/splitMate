import axios from 'axios'
import { ROUTES } from '../constants/routes'
import { clearStoredAuth, getStoredToken } from '../utils/storage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearStoredAuth()
      window.dispatchEvent(new Event('auth:logout'))

      if (window.location.pathname !== ROUTES.login) {
        window.location.assign(ROUTES.login)
      }
    }

    return Promise.reject(error)
  },
)

export default api
