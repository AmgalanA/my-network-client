import { createAsyncThunk } from '@reduxjs/toolkit'
import { Socket } from 'socket.io'
import { io } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import { $api } from '../../http'
import { postApi } from '../../http/post/post-api'
import { profileApi } from '../../http/profile/profile-api'
import {
  IComment,
  ICommentPayload,
  ILikeCommentPayload,
} from '../../types/post/comment/comment-type'
import { ILike } from '../../types/post/like-type'
import { IPost } from '../../types/post/post-type'
import { IProfile } from '../../types/profile/profile-type'

export const postsActionCreators = {
  sendPostApi: createAsyncThunk(
    'posts/sendPostApi',
    async (formData: FormData) => {
      try {
        const response = await $api.post<IPost>('/post/create', formData)

        const postSender = await postApi.getPostSender([response.data])

        return postSender[0]
      } catch (error) {
        return error
      }
    }
  ),

  getPostsApi: createAsyncThunk('posts/getPostsApi', async (limit: number) => {
    try {
      const response = await $api.get<IPost[]>(`/post/get?limit=${limit}`)

      const postSenders = await postApi.getPostSender(response.data)

      return postSenders
    } catch (error) {
      return error
    }
  }),

  toggleLikePostApi: createAsyncThunk(
    'posts/toggleLikePost',
    async (likePayload: ILike) => {
      try {
        const response = await $api.put(`/post/toggle-like-post`, likePayload)

        return response.data
      } catch (error) {
        return error
      }
    }
  ),

  sendCommentApi: createAsyncThunk(
    'posts/sendComment',
    async (commentPayload: ICommentPayload) => {
      try {
        const response = await $api.post<IComment>(
          `/comment/send`,
          commentPayload
        )

        const sender = await profileApi.get(response.data.senderId)

        return {
          comment: response.data,
          sender,
        }
      } catch (error) {
        return error
      }
    }
  ),

  likeCommentApi: createAsyncThunk(
    'posts/likeComment',
    async (likeCommentPayload: ILikeCommentPayload) => {
      try {
        const response = await $api.put<IComment>(
          '/comment/toggle-like',
          likeCommentPayload
        )

        const sender = await profileApi.get(response.data.senderId)

        return {
          comment: response.data,
          sender,
        }
      } catch (error) {
        return error
      }
    }
  ),

  getBySenderIdApi: createAsyncThunk(
    'posts/getBySenderId',
    async (profileId: number) => {
      try {
        const posts = await postApi.getPosts(profileId)

        const senderPosts = await postApi.getPostSender(posts)

        return senderPosts
      } catch (error) {
        return error
      }
    }
  ),
}
