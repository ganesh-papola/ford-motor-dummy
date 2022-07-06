import { createSlice } from '@reduxjs/toolkit';
import { reducers } from './reducers';

export const name = 'fma';

export const initialState = {
  isAuthenticated: undefined,
  overrideFmaRequired: false,
  access_token: null,
  isLoading: false,
  guestGUID: null,
};

export const slice = createSlice({
  name,
  initialState,
  reducers,
});

export const actions = slice.actions;
export const reducer = slice.reducer;
