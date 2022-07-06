import { createAsyncThunk } from '@reduxjs/toolkit';
import CountryInformationService from '@Services/countryInformationService/CountryInformationService';
import PropertiesService from '@Services/propertiesService/PropertiesService';
import SapCommerceService from '@Services/sapCommerceService/SapCommerceService';

export const fetchReservationDetails = createAsyncThunk(
  'reservation/fetchDetails',
  fetchReservationDetailsPayloadCreator
);

/**
 * @typedef {object} ReservationDetailsParams
 * @property {string} reservationId - The ID of the reservation to fetch
 * @property {boolean} shouldLoadFinanceDataFromSap - On specific pages we don't want payment data to load
 * from sap and instead of load it from IAL all the time
 * (for example: RTO page should load finance data from IAL and
 * reservationDetails page should load it from SAP)
 * @property {boolean} useMock - ???
 */

/**
 * Gets the reservation details for the given reservation.
 * @param {ReservationDetailsParams} payload
 * @returns {Promise} TBD
 */
async function fetchReservationDetailsPayloadCreator(payload) {
  const { reservationId } = payload;
  const accessToken = window?.fma?.CATBundle?.access_token;
  const countryCode = CountryInformationService.getCountryCode(
    PropertiesService.getPageProperties().fmaLangCode
  );

  const response = await SapCommerceService.reservationDetails(
    reservationId,
    accessToken,
    countryCode
  );

  return response.data;
}
