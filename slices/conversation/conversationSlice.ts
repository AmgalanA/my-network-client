import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { ConversationType } from '../../types/conversation/conversation-type'
import { conversationActionCreators } from './action-creators'

interface IState {
  conversation: ConversationType
  loading: boolean
  error: string
}

const initialState: IState = {
  conversation: {} as ConversationType,
  loading: false,
  error: '',
}

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversation: (state, action: PayloadAction<ConversationType>) => {
      state.conversation = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        state.conversation = action.payload.conversationReducer.conversation
      })
      .addCase(
        conversationActionCreators.fetchConversation.pending,
        (state, action: any) => {
          state.loading = true
        }
      )
      .addCase(
        conversationActionCreators.fetchConversation.fulfilled,
        (state, action: any) => {
          state.conversation = action.payload
        }
      )
      .addCase(
        conversationActionCreators.fetchConversation.rejected,
        (state, action: any) => {
          console.log(`Fetching conversation error: ${action.payload}`)
          state.error = action.payload
        }
      )
  },
})

export default conversationSlice.reducer

export const { setConversation } = conversationSlice.actions
