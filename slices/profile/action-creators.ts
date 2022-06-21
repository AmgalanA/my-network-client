import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { GetServerSidePropsContext, PreviewData } from 'next'
import { setCookie, parseCookies } from 'nookies'
import { ParsedUrlQuery } from 'querystring'

import { loginDto } from '../../types/auth/login-dto'
import { authDto } from '../../types/auth/auth-dto'
import { IAuthResponse } from '../../types/auth/auth-type'
import { tokensApi } from '../../utils/auth/tokensApi'
import { $api } from '../../http'

export const profileActionCreators = {
  registerApi: createAsyncThunk('profile/registerApi', async (dto: authDto) => {
    try {
      const response = await axios.post<IAuthResponse>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`,
        dto
      )

      tokensApi.handleTokens(response.data.tokens)
      return response.data.profile
    } catch (error) {
      return error
    }
  }),

  loginApi: createAsyncThunk('profile/loginApi', async (dto: loginDto) => {
    try {
      const response = await $api.post<IAuthResponse>(`/auth/login`, dto)

      tokensApi.handleTokens(response.data.tokens)

      return response.data.profile
    } catch (error) {
      return error
    }
  }),

  refreshApi: createAsyncThunk(
    'profile/refreshApi',
    async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
      try {
        const { refreshToken } = parseCookies(ctx)

        const response = await axios.post<IAuthResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`,
          {
            token: refreshToken,
          }
        )

        tokensApi.handleTokens(response.data.tokens)

        return response.data.profile
      } catch (error) {
        return error
      }
    }
  ),

  logoutApi: createAsyncThunk('profile/logoutApi', async () => {
    try {
      const { refreshToken } = parseCookies()

      const response = await $api.post(`/auth/logout`, {
        token: refreshToken,
      })

      tokensApi.removeTokens()

      return {
        message: 'success',
      }
    } catch (error) {
      return error
    }
  }),
}
