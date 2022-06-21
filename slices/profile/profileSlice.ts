import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { IProfile } from '../../types/profile/profile-type'
import { profileActionCreators } from './action-creators'

interface IState {
  profile: IProfile | null
}

const initialState: IState = {
  profile: null,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<IProfile>) => {
      state.profile = action.payload
    },
  },

  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (store, action: any) => {
        store.profile = action.payload.profileReducer.profile
      })
      // Register
      .addCase(profileActionCreators.registerApi.pending, () => {
        console.log('Register Pending')
      })
      .addCase(
        profileActionCreators.registerApi.fulfilled,
        (state, action: any) => {
          if (action.payload.id) {
            state.profile = action.payload
          }
        }
      )
      .addCase(profileActionCreators.registerApi.rejected, (state, action) => {
        console.log('Register Error ', action.payload)
      })

      // Login
      .addCase(profileActionCreators.loginApi.pending, () => {
        console.log('Login Pending')
      })
      .addCase(
        profileActionCreators.loginApi.fulfilled,
        (state, action: any) => {
          if (action.payload.id) {
            state.profile = action.payload
          }
        }
      )
      .addCase(profileActionCreators.loginApi.rejected, (state, action) => {
        console.log('Refresh Error ', action.payload)
      })

      // Refresh
      .addCase(profileActionCreators.refreshApi.pending, () => {
        console.log('Refresh Pending')
      })
      .addCase(
        profileActionCreators.refreshApi.fulfilled,
        (state, action: any) => {
          console.log(action.payload)
          if (action.payload.id) {
            state.profile = action.payload
          }
        }
      )
      .addCase(profileActionCreators.refreshApi.rejected, (state, action) => {
        console.log('Refresh Error ', action.payload)
      })

      // Logout
      .addCase(profileActionCreators.logoutApi.pending, () => {
        console.log('Logout Pending')
      })
      .addCase(
        profileActionCreators.logoutApi.fulfilled,
        (state, action: any) => {
          if (action.payload.message) {
            state.profile = null
          }
        }
      )
      .addCase(profileActionCreators.logoutApi.rejected, (state, action) => {
        console.log('Logout Error ', action.payload)
      })
  },
})

export default profileSlice.reducer

export const { setProfile } = profileSlice.actions
