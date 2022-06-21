import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import build from 'next/dist/build'
import { IPostSender } from '../../types/post/post-type'
import { showingPostActionCreators } from './action-creators'

interface IState {
  post: IPostSender
  loading: boolean
}

const initialState: IState = {
  post: {} as IPostSender,
  loading: false,
}

export const showingPostSlice = createSlice({
  name: 'showing-post',
  initialState,
  reducers: {
    setShowingPost: (state, action: PayloadAction<IPostSender>) => {
      state.post = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        state.post = action.payload.showingPostReducer.post
      })
      .addCase(showingPostActionCreators.getPostApi.pending, (state) => {
        console.log('Showing post pending')
        state.loading = true
      })
      .addCase(
        showingPostActionCreators.getPostApi.fulfilled,
        (state, action: any) => {
          if (action.payload.post) {
            state.post = action.payload
          }
        }
      )
      .addCase(
        showingPostActionCreators.getPostApi.rejected,
        (state, action: any) => {
          console.log(`Showing Post Error: ${action.payload}`)
        }
      )
  },
})

export default showingPostSlice.reducer

export const { setShowingPost } = showingPostSlice.actions
