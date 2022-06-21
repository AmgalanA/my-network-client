import { $api } from '..'
import { IConversationResponse } from '../../types/conversation/conversation-type'
import { messageApi } from '../message/message-api'
import { profileApi } from '../profile/profile-api'

export const conversationApi = {
  create: async (ids: number[]) => {
    const response = await $api.post<IConversationResponse>(
      `/conversation/create`,
      { ids }
    )

    return response.data
  },

  fetchConversation: async (id: number, currentProfileId: number) => {
    const response = await $api.get<IConversationResponse>(
      `/conversation/get-one/${id}`
    )

    const messagesSender = await Promise.all(
      response.data.messages.map(async (message) => {
        const sender = await profileApi.get(message.senderId)

        return {
          sender,
          message,
        }
      })
    )

    const receiverId = response.data.ids.filter(
      (id) => id !== currentProfileId
    )[0]

    const receiver = await profileApi.get(receiverId)

    return {
      conversation: response.data,
      messages: messagesSender,
      receiver,
    }
  },

  getByProfileId: async (profileId: number) => {
    const response = await $api.get<IConversationResponse[]>(
      `/conversation/get-by-profile-id/${profileId}`
    )

    return response.data
  },

  fetchMessangerConversation: async (
    conversation: IConversationResponse,
    currentProfileId: number
  ) => {
    const lastMessage = await messageApi.getLast(conversation.id)

    const receiverId = conversation.ids.filter(
      (id) => id !== currentProfileId
    )[0]

    const receiver = await profileApi.get(receiverId)

    return {
      conversation,
      lastMessage,
      receiver,
    }
  },
}
