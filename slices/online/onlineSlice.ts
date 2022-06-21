import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
  online: number[]
}

const initialState: IState = {
  online: [],
}

export const onlineSlice = createSlice({
  name: 'online',
  initialState,
  reducers: {
    setOnline: (state, action: PayloadAction<number[]>) => {
      state.online = action.payload
    },
  },
})

export default onlineSlice.reducer

export const { setOnline } = onlineSlice.actions
