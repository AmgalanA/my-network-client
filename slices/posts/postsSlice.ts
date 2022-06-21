import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { IPost, IPostSender } from '../../types/post/post-type'
import { postsActionCreators } from './action-creators'

interface IState {
  posts: IPostSender[]
  loading: boolean
}

const initialState: IState = {
  posts: [],
  loading: false,
}

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<IPostSender[]>) => {
      state.posts = action.payload
    },
    addPost: (state, action: PayloadAction<IPostSender>) => {
      state.posts = [...state.posts, action.payload]
    },
  },
  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        state.posts = action.payload.postsReducer.posts
      })
      .addCase(postsActionCreators.sendPostApi.pending, (state) => {
        console.log('Posts pending')
        state.loading = true
      })
      .addCase(
        postsActionCreators.sendPostApi.fulfilled,
        (state, action: any) => {
          console.log(action)
          if (action.payload.post) {
            state.posts = [...state.posts, action.payload]
          }
          state.loading = false
        }
      )
      .addCase(
        postsActionCreators.sendPostApi.rejected,
        (state, action: any) => {
          console.log(`Posts Error: ${action.payload}`)
          state.loading = false
        }
      )

      .addCase(postsActionCreators.getPostsApi.pending, (state) => {
        console.log('Get Posts pending')
        state.loading = true
      })
      .addCase(
        postsActionCreators.getPostsApi.fulfilled,
        (state, action: any) => {
          if (action.payload.length) {
            state.posts = action.payload
          }
          state.loading = false
        }
      )
      .addCase(
        postsActionCreators.getPostsApi.rejected,
        (state, action: any) => {
          console.log(`Get Posts Error: ${action.payload}`)
          state.loading = false
        }
      )

      .addCase(postsActionCreators.toggleLikePostApi.pending, (state) => {
        console.log('Like Post pending')
      })
      .addCase(
        postsActionCreators.toggleLikePostApi.fulfilled,
        (state, action: any) => {
          if (action.payload.likes) {
            state.posts = state.posts.map((post) => {
              if (post.post.id === action.payload.id) {
                return {
                  ...post,
                  post: action.payload,
                }
              } else {
                return post
              }
            })
          }
        }
      )
      .addCase(
        postsActionCreators.toggleLikePostApi.rejected,
        (state, action: any) => {
          console.log(`Like Post Error: ${action.payload}`)
          state.loading = false
        }
      )

      .addCase(postsActionCreators.sendCommentApi.pending, (state) => {
        console.log('Send comment pending')
      })
      .addCase(
        postsActionCreators.sendCommentApi.fulfilled,
        (state, action: any) => {
          if (action.payload.comment) {
            state.posts = state.posts.map((post) => {
              if (post.post.id === action.payload.comment.postId) {
                return {
                  ...post,
                  comments: [...post.comments, action.payload],
                }
              } else {
                return post
              }
            })
          }
        }
      )
      .addCase(
        postsActionCreators.sendCommentApi.rejected,
        (state, action: any) => {
          console.log(`Send comment Error: ${action.payload}`)
          state.loading = false
        }
      )

      .addCase(postsActionCreators.likeCommentApi.pending, (state) => {
        console.log('Like comment pending')
      })
      .addCase(
        postsActionCreators.likeCommentApi.fulfilled,
        (state, action: any) => {
          if (action.payload.comment) {
            state.posts = state.posts.map((post) => {
              if (post.post.id === action.payload.comment.postId) {
                return {
                  ...post,
                  comments: post.comments.map((comment) => {
                    if (comment.comment.id === action.payload.comment.id) {
                      return {
                        ...comment,
                        comment: action.payload.comment,
                      }
                    } else {
                      return comment
                    }
                  }),
                }
              } else {
                return post
              }
            })
          }
        }
      )
      .addCase(
        postsActionCreators.likeCommentApi.rejected,
        (state, action: any) => {
          console.log(`Like comment Error: ${action.payload}`)
          state.loading = false
        }
      )

      .addCase(postsActionCreators.getBySenderIdApi.pending, (state) => {
        console.log('Get by sender id pending')
      })
      .addCase(
        postsActionCreators.getBySenderIdApi.fulfilled,
        (state, action: any) => {
          state.posts = action.payload
        }
      )
      .addCase(
        postsActionCreators.getBySenderIdApi.rejected,
        (state, action: any) => {
          console.log(`Get by sender id Error: ${action.payload}`)
          state.loading = false
        }
      )
  },
})

export default postsSlice.reducer

export const { setPosts, addPost } = postsSlice.actions
