import { $api } from '..'
import { IChatInvite } from '../../types/chat/chat-invites/chat-invites-type'
import { IChatLeaving } from '../../types/chat/chat-leavings/chat-leaving-type'
import { IChatMessage } from '../../types/chat/chat-messages/chat-message-type'
import { IChat } from '../../types/chat/chat-type'
import { IJoinChatPayload } from '../../types/chat/members/join-chat'
import { profileApi } from '../profile/profile-api'

export const ChatApi = {
  create: async (formData: FormData) => {
    const response = await $api.post(`/chat/create`, formData)

    return response.data
  },

  getOne: async (id: number) => {
    const response = await $api.get<IChat>(`/chat/get-one/${id}`)

    return response.data
  },

  fetchChat: async (chat: IChat) => {
    const messages = await Promise.all(
      chat.messages.map(async (message) => {
        const sender = await profileApi.get(message.senderId)

        return {
          message,
          sender,
        }
      })
    )

    const invites = await ChatApi.getInvites(chat.id)
    const leavings = await ChatApi.getLeavings(chat.id)

    const members = await profileApi.fetchProfiles(chat.members)

    return {
      messages,
      members,
      invites,
      leavings,
      chat,
    }
  },

  getInvites: async (id: number) => {
    const response = await $api.get<IChatInvite[]>(`/chat/get-invites/${id}`)

    return response.data
  },

  getLeavings: async (id: number) => {
    const response = await $api.get<IChatLeaving[]>(`/chat/get-leavings/${id}`)

    return response.data
  },

  getChat: async (chat: IChat) => {
    const lastMessage = await ChatApi.getLastMessage(chat.id)

    if (!lastMessage) {
      return {
        lastMessage: {},
        chat,
      }
    }

    return {
      lastMessage,
      chat,
    }
  },

  getByMemberId: async (profileId: number) => {
    const response = await $api.get<IChat[]>(
      `/chat/get-by-member-id/${profileId}`
    )

    return response.data
  },

  getLastMessage: async (id: number) => {
    const response = await $api.get<IChatMessage>(
      `/chat/get-last-message/${id}`
    )

    if (!response.data) {
      return null
    }

    const sender = await profileApi.get(response.data.senderId)

    return {
      message: response.data,
      sender,
    }
  },

  sendMessage: async (formData: FormData): Promise<IChatMessage | Error> => {
    try {
      const response = await $api.post<IChatMessage>(
        `/chat/send-message`,
        formData
      )

      return response.data
    } catch (error: any) {
      console.log(`Error sending chat message: ${error}`)
      return error
    }
  },

  addMembers: async (payload: IJoinChatPayload): Promise<Error | IChat[]> => {
    try {
      const response = await Promise.all(
        payload.profiles.map(async (profile) => {
          const response = await $api.put<IChat>(`/chat/add-member`, {
            ...payload,
            toId: profile.id,
            toName: profile.name,
          })

          return response.data
        })
      )

      return response
    } catch (error: any) {
      return error
    }
  },
}
