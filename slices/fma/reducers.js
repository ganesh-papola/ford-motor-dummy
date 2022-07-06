import { initialState } from './slice';
export const reducers = {
  authenticationStateChanged: (state, { payload }) => {
    state.isAuthenticated = payload;
  },
  setOverrideFmaRequired: (state, { payload }) => {
    state.overrideFmaRequired = payload;
  },
  accessTokenCreated: (state, { payload }) => {
    state.access_token = payload;
  },
  loadingStateChanged: (state, { payload }) => {
    state.isLoading = payload;
  },
  writeGuestGUID: (state, { payload }) => {
    state.guestGUID = payload;
  },
  clearGuestGUID: (state) => {
    state.guestGUID = initialState.guestGUID;
  },
};
