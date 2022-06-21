import axios from 'axios'
import { $api } from '..'
import { IToggleFriendsPayload } from '../../types/profile/friend-type'
import { IProfile } from '../../types/profile/profile-type'

export const profileApi = {
  get: async (id: number) => {
    const response = await $api.get<IProfile>(`/profile/get-one/${id}`)

    return response.data
  },

  fetchProfiles: async (ids: number[]) => {
    const members = await Promise.all(
      ids.map(async (id) => {
        const member = await profileApi.get(id)

        return member
      })
    )

    return members
  },

  update: async (formData: FormData) => {
    const response = await $api.put<IProfile>(`/profile/update`, formData)

    return response.data
  },

  toggleFriend: async (payload: IToggleFriendsPayload) => {
    const response = await $api.put<IProfile>(
      `/profile/toggle-friends`,
      payload
    )

    return response.data
  },

  fetchFriends: async (id: number) => {
    const response = await $api.get<IProfile[]>(`/profile/fetch-friends/${id}`)

    return response.data
  },
}
