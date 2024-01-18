import { combineReducers, configureStore } from '@reduxjs/toolkit';
import pageSlice from './slices/pageSlice';
import appSlice from './slices/appSlice';
import userDetailsSlice from './slices/userDetailsSlice';
import requestsListSlice from './slices/requestsListSlice';
import userContactsSlice  from './slices/userContactsSlice';
import userMessages from './slices/userMessages';
export default configureStore({
  reducer: combineReducers({
	page : pageSlice,
	app : appSlice,
	userDetails : userDetailsSlice,
	requestsList : requestsListSlice,
	userContacts : userContactsSlice,
	userMessages : userMessages
  })
});