import { createSlice } from '@reduxjs/toolkit'

export const userContactsSlice = createSlice({
  name: 'user-contacts',
  initialState: {
    contacts : null
  },
  reducers: {
    changeContacts : (state, value) => {
        state.contacts = value.payload;
    }
  }
})

// Action creators are generated for each case reducer function
export const { changeContacts } = userContactsSlice.actions

export default userContactsSlice.reducer