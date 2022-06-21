import { IProfile } from '../profile/profile-type'
import { IComment, ICommentSender } from './comment/comment-type'

export interface IPost {
  id: number
  text: string
  senderId: number
  groupId: number
  likes: number[]
  images: string[]
  audios: string[]
  videos: string[]
  postedAt: string
}

export interface IPostSender {
  post: IPost
  sender: IProfile
  comments: ICommentSender[]
}

export interface IFeedPost {
  post: IPost
  sender: IProfile
  comments: IComment[]
}

export interface IShowingPostResponse {
  id: number
  text: string
  senderId: number
  groupId: number
  likes: number[]
  images: string[]
  audios: string[]
  videos: string[]
  postedAt: string
  comments: IComment[]
}
