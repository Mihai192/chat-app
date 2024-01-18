import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    sideBarSettingsActive: false,
	sideBarSettingsType : '',
	sideBarChat: false,
	activeChat : null,
	socket : null
  },
  reducers: {
    changeSideBarSettingsStatus : (state, value) => {
        state.sideBarSettingsActive = value.payload;
    },
	changeSideBarSettingsType : (state, value) => {
		state.sideBarSettingsType = value.payload;
	},
	changeSideBarChatStatus : (state, value) => {
		state.sideBarChat = value.payload;
	},
	changeActiveChat : (state, value) => {
		state.activeChat = value.payload;
	},
	changeSocket : (state, value) => {
		state.socket = value.payload;
	}
  }
})


export const { changeSideBarSettingsStatus, changeSideBarChatStatus, changeSideBarSettingsType, changeActiveChat, changeSocket } = appSlice.actions

export default appSlice.reducer