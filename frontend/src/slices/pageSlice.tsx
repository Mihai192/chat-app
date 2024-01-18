import { createSlice } from '@reduxjs/toolkit'

export const pageSlice = createSlice({
  name: 'page',
  initialState: {
    type: "loading"
  },
  reducers: {
    toAgreementPage : state => {
        state.type = "agreement";
    },
	toLoadingPage : state => {
		state.type = "loading";
	},
	verifyPhoneNumber : state => {
		state.type = "verify-phone-number";
	},
	appPage : state => {
		state.type = "app-page"
	},
	signUp : state => {
		state.type = "sign-up"
	},
	loginPage : state => {
		state.type = "login-page"
	}
  }
})

// Action creators are generated for each case reducer function
export const { toAgreementPage, toLoadingPage, signUp, verifyPhoneNumber, appPage, loginPage } = pageSlice.actions

export default pageSlice.reducer