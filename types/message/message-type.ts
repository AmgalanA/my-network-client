import { IProfile } from '../profile/profile-type'

export interface IMessage {
  id: number
  text: string
  senderId: number
  sentAt: string
  images: string[]
  audios: string[]
  videos: string[]
  conversationId?: number
  messageId?: number
}

export interface IMessageSender {
  message: IMessage
  sender: IProfile
}
