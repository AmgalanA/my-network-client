import { IProfile } from '../profile/profile-type'

export interface ITokens {
  accessToken: string
  refreshToken: string
}

export interface IAuthResponse {
  tokens: ITokens
  profile: IProfile
}
