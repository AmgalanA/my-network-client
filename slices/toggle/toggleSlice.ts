import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
  isShowingCreateChatModal: boolean
  isShowingChatModal: boolean
}

const initialState: IState = {
  isShowingCreateChatModal: false,
  isShowingChatModal: false,
}

export const toggleSlice = createSlice({
  name: 'toggle',
  initialState,
  reducers: {
    setIsShowingCreateChatModal: (state, action: PayloadAction<boolean>) => {
      state.isShowingCreateChatModal = action.payload
    },
    setIsShowingChatModal: (state, action: PayloadAction<boolean>) => {
      state.isShowingChatModal = action.payload
    },
  },
})

export default toggleSlice.reducer

export const { setIsShowingCreateChatModal, setIsShowingChatModal } =
  toggleSlice.actions
