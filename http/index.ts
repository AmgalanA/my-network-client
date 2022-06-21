import axios from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { IAuthResponse } from '../types/auth/auth-type'

export const $api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    authorization: `Bearer ${parseCookies(null).accessToken}`,
  },
})

$api.interceptors.request.use()

$api.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    console.log('Error: ', error)
    const originalRequest = error.config
    if (
      error.response.status == 403 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true
      try {
        const { refreshToken } = parseCookies()

        const response = await axios.post<IAuthResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`,
          {
            token: refreshToken,
          }
        )

        setCookie(null, 'accessToken', response.data.tokens.accessToken)
        return $api.request(originalRequest)
      } catch (error) {
        console.log('Not authorized: ', error)
      }
    }

    throw error
  }
)
