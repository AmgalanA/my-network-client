import { $api } from '../..'
import {
  ICommentSender,
  ILikeCommentPayload,
} from '../../../types/post/comment/comment-type'

export const commentApi = {
  checkIfLiked: async (likeCommentPayload: ILikeCommentPayload) => {
    const response = await $api.put<boolean>(
      `/comment/check-if-liked`,
      likeCommentPayload
    )

    return response.data
  },

  get: async (postId: number) => {
    const response = await $api.get<ICommentSender[]>(`/comment/get/${postId}`)

    return response.data
  },
}
