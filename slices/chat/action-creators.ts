import { createAsyncThunk } from '@reduxjs/toolkit'

import { IChat } from '../../types/chat/chat-type'
import { ChatApi } from '../../http/chat/chat-api'

export const chatActionCreators = {
  fetchChat: createAsyncThunk('chat/fetchChat', async (id: number) => {
    try {
      const chat = await ChatApi.getOne(id)

      const fetchedChat = await ChatApi.fetchChat(chat)

      return fetchedChat
    } catch (error) {
      return error
    }
  }),
}
