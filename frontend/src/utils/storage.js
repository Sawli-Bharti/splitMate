import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../constants/auth'

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setStoredToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearStoredToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function getStoredUser() {
  const user = localStorage.getItem(AUTH_USER_KEY)

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user)
  } catch {
    localStorage.removeItem(AUTH_USER_KEY)
    return null
  }
}

export function setStoredUser(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  localStorage.removeItem(AUTH_USER_KEY)
}

export function clearStoredAuth() {
  clearStoredToken()
  clearStoredUser()
}
