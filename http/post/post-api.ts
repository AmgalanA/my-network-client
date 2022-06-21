import { $api } from '..'
import {
  IComment,
  ICommentPayload,
} from '../../types/post/comment/comment-type'
import { ILike } from '../../types/post/like-type'
import { IPost } from '../../types/post/post-type'
import { IProfile } from '../../types/profile/profile-type'
import { commentApi } from './comment/comment-api'

export const postApi = {
  getPostSender: async (posts: IPost[]) => {
    const postsSender = await Promise.all(
      posts.map(async (post) => {
        const senderResponse = await $api.get<IProfile>(
          `/profile/get-one/${post.senderId}`
        )

        const comments = await commentApi.get(post.id)

        return {
          sender: senderResponse.data,
          post,
          comments,
        }
      })
    )

    return postsSender
  },

  getPosts: async (profileId: number) => {
    const response = await $api.get<IPost[]>(
      `/post/get-by-sender-id/${profileId}`
    )

    return response.data
  },

  createPost: async (formData: FormData) => {
    const response = await $api.post<IPost>(`/post/create`, formData)

    const postSender = await postApi.getPostSender([response.data])

    return postSender[0]
  },
}
