import { destroyCookie, setCookie } from 'nookies'

import { tokensDto } from '../../types/auth/tokens/tokens-dto'

export const tokensApi = {
  handleTokens: (tokensDto: tokensDto) => {
    setCookie(null, 'refreshToken', tokensDto.refreshToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    setCookie(null, 'accessToken', tokensDto.accessToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    return tokensDto
  },

  removeTokens: () => {
    destroyCookie(null, 'refreshToken')

    destroyCookie(null, 'accessToken')

    return ''
  },
}
