import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IMessageSender } from '../../../types/message/message-type'

interface IState {
  message: IMessageSender
}

const initialState: IState = {
  message: {} as IMessageSender,
}

export const replyMessageSlice = createSlice({
  name: 'replying-message',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<IMessageSender>) => {
      state.message = action.payload
    },
    removeMessage: (state) => {
      state.message = {} as IMessageSender
    },
  },
})

export default replyMessageSlice.reducer

export const { setMessage, removeMessage } = replyMessageSlice.actions
