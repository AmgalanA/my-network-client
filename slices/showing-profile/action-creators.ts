import { createAsyncThunk } from '@reduxjs/toolkit'

import { profileApi } from '../../http/profile/profile-api'
import { postApi } from '../../http/post/post-api'

export const showingProfileActionCreators = {
  fetchProfile: createAsyncThunk(
    'showing-profile/fetchProfile',
    async (id: number) => {
      try {
        const profile = await profileApi.get(id)

        return profile
      } catch (error) {
        return error
      }
    }
  ),
}
