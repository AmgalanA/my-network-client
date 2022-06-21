import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { ShowingChatState } from '../../types/chat/chat-type'
import { chatActionCreators } from './action-creators'

interface IState {
  chat: ShowingChatState
  loading: boolean
  error: string
}

const initialState: IState = {
  chat: {} as ShowingChatState,
  loading: false,
  error: '',
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(chatActionCreators.fetchChat.pending, (state) => {
        state.loading = true
      })
      .addCase(chatActionCreators.fetchChat.fulfilled, (state, action: any) => {
        state.chat = action.payload
      })
      .addCase(chatActionCreators.fetchChat.rejected, (state, action: any) => {
        console.log(`Fetch Chat Error: ${action.payload}`)
        state.error = action.payload
      })
      .addCase(HYDRATE, (state, action: any) => {
        state.chat = action.payload.chatReducer.chat
      })
  },
})

export default chatSlice.reducer
