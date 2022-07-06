import SpecAmendHistoryService from '@Services/specAmendHistoryService/SpecAmendHistoryService';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAmendSpecHistory = createAsyncThunk(
  'amendSpecHistory/fetchData',
  updateAmendSpecHistory
);

async function updateAmendSpecHistory(payload) {
  const orderId = payload;
  const accessToken = window.fma.CATBundle.access_token;
  const response = await SpecAmendHistoryService.getSpecAmendHistory(
    orderId,
    accessToken
  );
  return response.data;
}
