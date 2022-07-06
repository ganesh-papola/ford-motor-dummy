import { createSlice } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { fetchManageOrderDetails } from './thunks';
import initialState from './initialState';

export const slice = createSlice({
  name: 'manageOrderData',
  initialState,
  reducers,
  extraReducers: (builder) => {
    builder.addCase(fetchManageOrderDetails.pending, (state) => {
      state.isLoading = true;
      state.hasFailed = false;
      state.hasSucceeded = false;
    });

    builder.addCase(fetchManageOrderDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.hasFailed = false;
      state.hasSucceeded = true;
      state.hasSucceededWithValidData = true;
      state.data = action.payload;
    });

    builder.addCase(fetchManageOrderDetails.rejected, (state) => {
      state.isLoading = false;
      state.hasFailed = true;
      state.hasSucceeded = false;
    });
  },
});

export const { actions, reducer } = slice;
