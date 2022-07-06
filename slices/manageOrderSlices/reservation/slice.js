import { createSlice } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { fetchReservationDetails } from './thunks';
import initialState from './initialState';

export const slice = createSlice({
  name: 'reservation',
  initialState,
  reducers,
  extraReducers: (builder) => {
    builder.addCase(fetchReservationDetails.pending, (state) => {
      state.isLoading = true;
      state.hasFailed = false;
      state.hasSucceeded = false;
    });

    builder.addCase(fetchReservationDetails.fulfilled, (state) => {
      state.isLoading = false;
      state.hasFailed = false;
      state.hasSucceeded = true;
      state.hasSucceededWithValidData = true;
    });

    builder.addCase(fetchReservationDetails.rejected, (state) => {
      state.isLoading = false;
      state.hasFailed = true;
      state.hasSucceeded = false;
    });
  },
});

export const { actions, reducer } = slice;
