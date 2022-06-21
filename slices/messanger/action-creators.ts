import { createAsyncThunk } from '@reduxjs/toolkit'
import { ChatApi } from '../../http/chat/chat-api'
import { conversationApi } from '../../http/conversation/conversation-api'

export const messangerActionCreators = {
  fetchConversations: createAsyncThunk(
    'messanger/fetchConversations',
    async (profileId: number) => {
      try {
        const conversations = await conversationApi.getByProfileId(profileId)

        const messangerConversations = await Promise.all(
          conversations.map((conversation) => {
            const messangerConversation =
              conversationApi.fetchMessangerConversation(
                conversation,
                profileId
              )

            return messangerConversation
          })
        )

        messangerConversations.sort(function (a, b) {
          return (
            Number(b.lastMessage.message.sentAt) -
            Number(a.lastMessage.message.sentAt)
          )
        })

        return messangerConversations
      } catch (error) {
        return error
      }
    }
  ),

  fetchChats: createAsyncThunk(
    '/messanger/fetchChats',
    async (profileId: number) => {
      try {
        const chats = await ChatApi.getByMemberId(profileId)

        const messangerChats = await Promise.all(
          chats.map(async (chat) => {
            const messangerChat = await ChatApi.getChat(chat)

            return messangerChat
          })
        )

        return messangerChats
      } catch (error) {
        return error
      }
    }
  ),
}
