import { useCallback, useEffect, useMemo, useState } from 'react'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../constants/auth'
import { ROUTES } from '../constants/routes'
import api from '../api/axios'
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from '../utils/storage'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())
  const [user, setUser] = useState(() => getStoredUser())

  const login = useCallback((authData) => {
    const nextToken = authData?.token
    const nextUser = {
      email: authData?.email,
      name: authData?.name,
    }

    setStoredToken(nextToken)
    setStoredUser(nextUser)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const logout = useCallback((options = { redirect: true }) => {
    clearStoredAuth()
    setToken(null)
    setUser(null)

    if (options.redirect && window.location.pathname !== ROUTES.login) {
      window.location.assign(ROUTES.login)
    }
  }, [])

  const getCurrentUser = useCallback(() => getStoredUser(), [])
  const isAuthenticated = useCallback(() => Boolean(getStoredToken()), [])

  useEffect(() => {
    const handleForcedLogout = () => logout({ redirect: false })
    const handleStorageChange = (event) => {
      if (event.key === AUTH_TOKEN_KEY) {
        setToken(event.newValue)
      }

      if (event.key === AUTH_USER_KEY) {
        setUser(getStoredUser())
      }
    }

    window.addEventListener('auth:logout', handleForcedLogout)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('auth:logout', handleForcedLogout)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [logout])

  useEffect(() => {
    if (token && (!user || !user.id)) {
      api.get('/api/auth/me')
        .then((response) => {
          if (response?.data?.success && response.data.data) {
            const fullUser = response.data.data
            setStoredUser(fullUser)
            setUser(fullUser)
          }
        })
        .catch((err) => {
          console.error('Failed to fetch user profile:', err)
        })
    }
  }, [token, user])

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      getCurrentUser,
      isAuthenticated,
    }),
    [getCurrentUser, isAuthenticated, login, logout, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
