import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { $api } from '../../http'
import { commentApi } from '../../http/post/comment/comment-api'
import { profileApi } from '../../http/profile/profile-api'
import { IPost, IShowingPostResponse } from '../../types/post/post-type'

export const showingPostActionCreators = {
  getPostApi: createAsyncThunk(
    '/showing-post/getPostApi',
    async (id: number) => {
      try {
        const response = await $api.get<IPost>(`/post/get-one/${id}`)

        const sender = await profileApi.get(response.data.senderId)

        const comments = await commentApi.get(response.data.id)

        return {
          post: response.data,
          comments,
          sender,
        }
      } catch (error) {
        return error
      }
    }
  ),
}
