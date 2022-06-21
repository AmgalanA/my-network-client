import { IProfile } from '../../profile/profile-type'

export interface IChatMessage {
  id: number
  text: string
  senderId: number
  sentAt: string
  images: string[]
  audios: string[]
  videos: string[]
  messageId?: number
  chatId: number
}

export interface IChatMessageSender {
  message: IChatMessage
  sender: IProfile
}
