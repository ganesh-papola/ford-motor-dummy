import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getGeocoderAutocompleteSuggestions,
  getAddressDetailsFromLocationId,
} from '@Services/heremapService/HereMapService';
import {
  autoAllocateAndGetDistanceToDealer,
  getGeoCoordsFromBrowser,
  allocateAndGetDistanceToDealer,
  getGetDealerSearchResultsParams,
} from './thunkHelpers';
import { getDealerSearchResults } from '@Services/dealerSearch/dealerSearchService';

export const autoAllocateDealerFromBrowserLocation = createAsyncThunk(
  'dealerSearch/autoAllocateDealerFromBrowserLocation',
  autoAllocateDealerFromBrowserLocationPayloadCreator
);

// TODO: US3150880: add type
// TODO: DS-Cleanup Add test coverage
export async function autoAllocateDealerFromBrowserLocationPayloadCreator(
  params,
  thunkAPI
) {
  const { dispatch, getState } = thunkAPI;
  const position = await getGeoCoordsFromBrowser();

  return await autoAllocateAndGetDistanceToDealer({
    position,
    getState,
    dispatch,
  });
}

export const allocateDealer = createAsyncThunk(
  'dealerSearch/allocateDealer',
  allocateDealerPayloadCreator
);

export async function allocateDealerPayloadCreator(params, thunkAPI) {
  const { selectedDealer } = params;
  const { dispatch, getState } = thunkAPI;
  return await allocateAndGetDistanceToDealer(
    selectedDealer,
    getState,
    dispatch
  );
}

export const getSuggestedDealers = createAsyncThunk(
  'dealerSearch/getSuggestedDealers',
  getSuggestedDealersPayloadCreator
);

export async function getSuggestedDealersPayloadCreator(params, thunkAPI) {
  const { searchString = '' } = params;
  const { getState } = thunkAPI;

  const suggestedLocations = await getGeocoderAutocompleteSuggestions(
    searchString
  );
  let positionFromLocationId;

  if (!suggestedLocations[0].position) {
    positionFromLocationId = await getAddressDetailsFromLocationId(
      suggestedLocations[0].locationId
    );
  }
  const position = suggestedLocations[0].position
    ? suggestedLocations[0].position
    : positionFromLocationId.position;

  const getDealerSearchResultsParams = getGetDealerSearchResultsParams({
    position,
    getState,
  });

  const dealerSearchResults = await getDealerSearchResults(
    getDealerSearchResultsParams
  );

  const deliveryAddress = {
    ...suggestedLocations[0],
    position,
  };

  return {
    dealerSearchResults,
    deliveryAddress,
  };
}
