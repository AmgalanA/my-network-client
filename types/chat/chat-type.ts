import { IProfile } from '../profile/profile-type'
import { IChatInvite } from './chat-invites/chat-invites-type'
import { IChatLeaving } from './chat-leavings/chat-leaving-type'
import {
  IChatMessage,
  IChatMessageSender,
} from './chat-messages/chat-message-type'

export interface IChat {
  admins: number[]
  audios: string[]
  avatar: string
  creatorId: number
  description: string
  id: number
  images: string[]
  members: number[]
  name: string
  videos: string[]
  messages: IChatMessage[]
}

export interface ChatState {
  chat: IChat
  lastMessage: IChatMessageSender
}

export interface ShowingChatState {
  members: IProfile[]
  chat: IChat
  messages: IChatMessageSender[]
  invites: IChatInvite[]
  leavings: IChatLeaving[]
}
