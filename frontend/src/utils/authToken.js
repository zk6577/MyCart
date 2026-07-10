import axios from 'axios'

const AUTH_TOKEN_KEY = 'onecartUserToken'

export const setAuthToken = (token) => {
  if (!token) return

  localStorage.setItem(AUTH_TOKEN_KEY, token)
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
}

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  delete axios.defaults.headers.common.Authorization
}

const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)

if (storedToken) {
  axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`
}
