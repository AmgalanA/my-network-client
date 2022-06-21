import { IProfile } from '../../profile/profile-type'

export interface IComment {
  id: number
  text: string
  sentAt: string
  senderId: number
  postId: number
  likes: number[]
}

export interface ICommentPayload {
  text: string
  senderId: number
  postId: number
}

export interface ICommentSender {
  comment: IComment
  sender: IProfile
}

export interface ILikeCommentPayload {
  id: number
  profileId: number
}
