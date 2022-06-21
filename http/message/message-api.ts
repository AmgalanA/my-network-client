import { $api } from '..'
import { IMessage } from '../../types/message/message-type'
import { profileApi } from '../profile/profile-api'

export const messageApi = {
  send: async (formData: FormData) => {
    const response = await $api.post<IMessage>(
      '/conversation/send-message',
      formData
    )

    return response.data
  },

  get: async (id: number) => {
    const response = await $api.get<IMessage>(`/conversation/get-message/${id}`)

    const sender = await profileApi.get(response.data.senderId)

    return {
      message: response.data,
      sender,
    }
  },

  getLast: async (conversationId: number) => {
    const response = await $api.get<IMessage>(
      `/conversation/get-last-message/${conversationId}`
    )

    const sender = await profileApi.get(response.data.senderId)

    return {
      message: response.data,
      sender,
    }
  },
}
