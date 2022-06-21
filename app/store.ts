import { configureStore, ThunkAction } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import { Action } from 'redux'

import profileReducer from '../slices/profile/profileSlice'
import postsReducer from '../slices/posts/postsSlice'
import showingPostReducer from '../slices/showing-post/showingPostSlice'
import showingProfileReducer from '../slices/showing-profile/showingProfile'
import conversationReducer from '../slices/conversation/conversationSlice'
import replyMessageReducer from '../slices/conversation/reply-message/replyMessageSlice'
import onlineReducer from '../slices/online/onlineSlice'
import messangerReducer from '../slices/messanger/messangerSlice'
import toggleReducer from '../slices/toggle/toggleSlice'
import chatReducer from '../slices/chat/chatSlice'

const makeStore = () =>
  configureStore({
    reducer: {
      profileReducer,
      postsReducer,
      showingPostReducer,
      showingProfileReducer,
      conversationReducer,
      onlineReducer,
      replyMessageReducer,
      messangerReducer,
      toggleReducer,
      chatReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        thunk: { extraArgument: {} },
      }),
    devTools: true,
  })

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>

export const wrapper = createWrapper<AppStore>(makeStore)
