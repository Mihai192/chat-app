import { createSlice } from '@reduxjs/toolkit'

export const userMessages = createSlice({
  name: 'user-messages',
  initialState: {
    messages : []
  },
  reducers: {
    changeMessages : (state, value) => {
        state.messages = value.payload;
    },
  }
})

// Action creators are generated for each case reducer function
export const { changeMessages } = userMessages.actions

export default userMessages.reducer