import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { IProfile } from '../../types/profile/profile-type'
import { showingProfileActionCreators } from './action-creators'
import { IPostSender } from '../../types/post/post-type'

interface IState {
  profile: IProfile
  loading: boolean
}

const initialState: IState = {
  profile: {} as IProfile,
  loading: false,
}

export const showingProfileSlice = createSlice({
  name: 'showing-profile',
  initialState,
  reducers: {
    setShowingProfile: (state, action: PayloadAction<IProfile>) => {
      state.profile = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        state.profile = action.payload.showingProfileReducer.profile
      })
      .addCase(showingProfileActionCreators.fetchProfile.pending, (state) => {
        state.loading = true
        console.log('Fetch profile pending.')
      })
      .addCase(
        showingProfileActionCreators.fetchProfile.fulfilled,
        (state, action: any) => {
          console.log('Payload: ', action.payload)
          state.profile = action.payload
          state.loading = false
        }
      )
      .addCase(
        showingProfileActionCreators.fetchProfile.rejected,
        (state, action: any) => {
          console.log(`Fetch profile error: ${action.payload}`)
          state.loading = false
        }
      )
  },
})

export default showingProfileSlice.reducer

export const { setShowingProfile } = showingProfileSlice.actions
