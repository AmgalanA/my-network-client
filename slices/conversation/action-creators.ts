import { createAsyncThunk } from '@reduxjs/toolkit'
import { conversationApi } from '../../http/conversation/conversation-api'
import { IConversationPayload } from '../../types/conversation/conversation-type'

export const conversationActionCreators = {
  fetchConversation: createAsyncThunk(
    '/conversation/fetchConversation',
    async (payload: IConversationPayload) => {
      try {
        const conversation = await conversationApi.fetchConversation(
          payload.id,
          payload.currentProfileId
        )

        return conversation
      } catch (error) {
        return error
      }
    }
  ),
}
