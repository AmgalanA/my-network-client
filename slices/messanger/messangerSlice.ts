import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { ChatState } from '../../types/chat/chat-type'
import { ConversationState } from '../../types/conversation/conversation-type'
import { messangerActionCreators } from './action-creators'

interface IState {
  conversations: ConversationState[]
  chats: ChatState[]
  loading: boolean
  error: string
}

const initialState: IState = {
  conversations: [],
  chats: [],
  loading: false,
  error: '',
}

export const messangerSlice = createSlice({
  name: 'messanger',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        state.conversations = action.payload.messangerReducer.conversations
        state.chats = action.payload.messangerReducer.chats
      })
      .addCase(messangerActionCreators.fetchConversations.pending, (state) => {
        state.loading = true
      })
      .addCase(
        messangerActionCreators.fetchConversations.fulfilled,
        (state, action: any) => {
          if (action.payload[0]) {
            state.conversations = action.payload
          }
        }
      )
      .addCase(
        messangerActionCreators.fetchConversations.rejected,
        (state, action: any) => {
          state.error = action.payload
          console.log('Fetch messanger conversations error: ', action.payload)
        }
      )

      .addCase(messangerActionCreators.fetchChats.pending, (state) => {
        state.loading = true
      })
      .addCase(
        messangerActionCreators.fetchChats.fulfilled,
        (state, action: any) => {
          console.log('Action: ', action)
          if (action.payload[0]) {
            state.chats = action.payload
          }
        }
      )
      .addCase(
        messangerActionCreators.fetchChats.rejected,
        (state, action: any) => {
          state.error = action.payload
          console.log('Fetch messanger chats error: ', action.payload)
        }
      )
  },
})

export default messangerSlice.reducer
