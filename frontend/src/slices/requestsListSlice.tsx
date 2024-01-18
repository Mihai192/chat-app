import { createSlice } from '@reduxjs/toolkit'

export const requestsListSlice = createSlice({
  name: 'requests-list',
  initialState: {
	requests : null
  },
  reducers: {
    changeRequests : (state, value) => {
        state.requests = value.payload;
    },
	
  }
})

// Action creators are generated for each case reducer function
export const {  changeRequests } = requestsListSlice.actions

export default requestsListSlice.reducer