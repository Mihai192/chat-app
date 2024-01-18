import { createSlice } from '@reduxjs/toolkit'

export const userDetailsSlice = createSlice({
  name: 'user-details',
  initialState: {
    name: null,
	description : null,
	phoneNumber : null,
	profile_image_name : null,
	image : null,
	id : null
  },
  reducers: {
	changeId : (state, value) => {
		state.id = value.payload
	},
    changeName : (state, value) => {
        state.name = value.payload;
    },
	changePhoneNumber : (state, value) => {
		state.phoneNumber = value.payload;
	},
	changeDescription : (state, value) => {
		state.description = value.payload;
	},
	changeProfileImageName : (state, value) => {
		state.profile_image_name = value.payload
	},
	changeProfileImage : (state, value) => {
		state.image = value.payload;
	}
  }
})

// Action creators are generated for each case reducer function
export const { changeId, changeName, changePhoneNumber, changeDescription, changeProfileImageName, changeProfileImage} = userDetailsSlice.actions

export default userDetailsSlice.reducer