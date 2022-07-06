import initialState from './initialState';
import { createSlice } from '@reduxjs/toolkit';
import * as sapTypes from '@Ducks/sap/types';

export const slice = createSlice({
  name: 'reservationMisc',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      sapTypes.FETCH_RESERVATION_DETAILS_SUCCESS,
      (state, action) => {
        state.finalPayment = action?.payload?.data?.finalPayment ?? null;
      }
    );
  },
});

export const { reducer } = slice;
