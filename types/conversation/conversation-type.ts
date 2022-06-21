import { IMessage, IMessageSender } from '../message/message-type'
import { IProfile } from '../profile/profile-type'

export interface IConversation {
  id: number
  ids: number[]
}

export interface ConversationType {
  conversation: IConversation
  messages: IMessageSender[]
  receiver: IProfile
}

export interface ConversationState {
  conversation: IConversation
  lastMessage: IMessageSender
  receiver: IProfile
}

export interface IConversationResponse {
  id: number
  ids: number[]
  messages: IMessage[]
}

export interface IConversationPayload {
  id: number
  currentProfileId: number
}
