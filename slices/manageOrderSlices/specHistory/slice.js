import initialState from './initialState';
import { createSlice } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { fetchAmendSpecHistory } from '@Slices/manageOrderSlices/specHistory/thunk';

export const slice = createSlice({
  name: 'amendSpecHistory',
  initialState,
  reducers,
  extraReducers: (builder) => {
    builder.addCase(fetchAmendSpecHistory.pending, (state) => {
      state.isLoading = true;
      state.hasFailed = false;
      state.hasSucceeded = false;
    });
    builder.addCase(fetchAmendSpecHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.hasFailed = false;
      state.hasSucceeded = true;
      state.hasSucceededWithValidData = true;
      state.data = action.payload;
    });
    builder.addCase(fetchAmendSpecHistory.rejected, (state) => {
      state.isLoading = false;
      state.hasFailed = true;
      state.hasSucceeded = false;
    });
  },
});

export const { actions, reducer } = slice;
