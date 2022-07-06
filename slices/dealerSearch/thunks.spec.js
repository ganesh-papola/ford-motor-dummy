jest.mock('@Services/dealerSearch/dealerSearchService', () => ({
  ...jest.requireActual('@Services/dealerSearch/dealerSearchService'),
  getDealerSearchResults: jest.fn(({ queryParams }) => {
    if (queryParams === 'reject') throw new Error('dealer search failed');
    return Promise.resolve({
      vendors: [
        { distance: 45, name: 'Gates of Harlow' },
        { distance: 215, name: 'Gates of Stevanage' },
      ],
      dealerLeadTimeGroupMatched: true,
    });
  }),
}));

jest.mock('@Services/updateDealer/updateDealerService', () => ({
  ...jest.requireActual('@Services/updateDealer/updateDealerService'),
  updateDealer: jest.fn(({ requestBody }) => {
    if (requestBody === 'reject') throw new Error('update dealer failed');
    return Promise.resolve();
  }),
}));

jest.mock('@Slices/dealerSearch/selectors', () => ({
  ...jest.requireActual('@Slices/dealerSearch/selectors'),
  getDealerSearchQueryParams: jest.fn((state) => {
    if (state.reject === true) return 'reject';

    const {
      additionalFilters,
      groupBy,
      isDeliveryMethodFixed,
      isOrderEnrolled,
      sort,
      delivery: { method: deliveryMethod, latitude, longitude, radius },
    } = state.searchParams;

    return {
      additionalFilters,
      deliveryMethod,
      groupBy,
      isDeliveryMethodFixed,
      isOrderEnrolled,
      latitude,
      longitude,
      radius,
      sort,
    };
  }),

  getUpdateDealerRequestBody: jest.fn((state) => {
    if (state.reject === true) return 'reject';
    return {
      mockResponseBodyProp: true,
    };
  }),

  getDeliveryGeoCoords: jest.fn((state) => {
    if (state.reject === true) return 'reject';
    const {
      searchParams: {
        delivery: { latitude: lat, longitude: lng },
      },
    } = state;

    return {
      lat,
      lng,
    };
  }),
}));

jest.mock('@Services/heremapService/HereMapService', () => ({
  ...jest.requireActual('@Services/heremapService/HereMapService'),
  getGeocoderAutocompleteSuggestions: jest.fn((searchString = '') => {
    if (searchString === 'service should fail') {
      return Promise.reject('this is a dealer list service error message');
    } else if (searchString === 'service should return invalid results') {
      return Promise.reject(
        'Validation: [1].position field must have less than or equal to 2 items'
      );
    } else if (searchString === 'E17 8EG') {
      return Promise.resolve([
        { title: 'title1', locationId: '1234' },
        { title: 'title2', locationId: '5678' },
        { title: 'title3', locationId: '9101' },
      ]);
    } else
      return Promise.resolve([
        { title: 'title1', position: [1, 2] },
        { title: 'title2', position: [3.4, 5.6] },
        { title: 'title3', position: [7.89, 10.01] },
      ]);
  }),
  getAddressDetailsFromLocationId: jest.fn((locationId = '') => {
    if (locationId === '1234') {
      return Promise.resolve({ position: [3, 4] });
    } else Promise.reject();
  }),
}));

jest.mock('@Services/propertiesService/PropertiesService.js', () => ({
  __esModule: true,
  default: {
    getPageProperties: jest.fn(() => ({
      fmaLangCode: 'el_gr',
    })),
  },
}));

jest.mock('./thunkHelpers', () => ({
  ...jest.requireActual('./thunkHelpers'),
  autoAllocateAndGetDistanceToDealer: jest.fn(({ position }) => {
    if (position[0] === -999) {
      return Promise.reject('address details service failure');
    }
    return Promise.resolve({ distanceToDealer: 127 });
  }),
  getVendorsList: jest.fn((position) => {
    if (position === 'this is a dealer list service error message') {
      return Promise.reject('address details service failure');
    }
    return Promise.resolve(
      [
        { distance: 45, name: 'Gates of Harlow' },
        { distance: 215, name: 'Gates of Stevanage' },
      ],
      true
    );
  }),

  getGetDealerSearchResultsParams: jest.fn(() => Promise.resolve()),

  allocateAndGetDistanceToDealer: jest.fn((dealer) => {
    if (dealer === 'service should fail') {
      return Promise.reject('Update dealer service failed');
    }
    if (dealer === 'service should return invalid results') {
      return Promise.reject('Selected dealer must be a string');
    }
    return Promise.resolve({ distanceToDealer: 127 });
  }),

  getGeoCoordsFromBrowser: jest.fn(() => Promise.resolve([12.4, 43.7])),
}));

import {
  allocateDealerPayloadCreator,
  autoAllocateDealerFromBrowserLocationPayloadCreator,
  getSuggestedDealersPayloadCreator,
} from './thunks';

import {
  allocateAndGetDistanceToDealer,
  autoAllocateAndGetDistanceToDealer,
  getGeoCoordsFromBrowser,
} from './thunkHelpers';

describe('dealerSearch thunks', () => {
  afterEach(() => jest.clearAllMocks());

  describe('autoAllocateDealerFromBrowserLocationPayloadCreator', () => {
    it('should call autoAllocateAndGetDistanceToDealer with correct parameters', async () => {
      const position = [12.4, 43.7];
      const dispatch = jest.fn();
      const getState = jest.fn();
      const thunkAPI = { dispatch, getState };
      const expectedArgument = { position, getState, dispatch };

      expect.assertions(3);
      await autoAllocateDealerFromBrowserLocationPayloadCreator(
        undefined,
        thunkAPI
      );

      expect(getGeoCoordsFromBrowser).toHaveBeenCalledTimes(1);
      expect(autoAllocateAndGetDistanceToDealer).toHaveBeenCalledTimes(1);
      expect(autoAllocateAndGetDistanceToDealer).toHaveBeenCalledWith(
        expectedArgument
      );
    });
  });

  describe('getSuggestedDealersPayloadCreator', () => {
    it('should reject with error message when service call fails', async () => {
      const expectedErrorMessage =
        'this is a dealer list service error message';
      const searchString = 'service should fail';
      const thunkAPI = { getState: jest.fn() };
      expect.assertions(1);
      await expect(
        getSuggestedDealersPayloadCreator({ searchString }, thunkAPI)
      ).rejects.toEqual(expectedErrorMessage);
    });

    it('should reject with validation message when service returns invalid results', async () => {
      const expectedErrorMessage =
        'Validation: [1].position field must have less than or equal to 2 items';
      const searchString = 'service should return invalid results';
      const thunkAPI = { getState: jest.fn() };
      expect.assertions(1);
      await expect(
        getSuggestedDealersPayloadCreator({ searchString }, thunkAPI)
      ).rejects.toEqual(expectedErrorMessage);
    });

    it('should resolve with an array of suggested dealers and deliveryAddress when service returns valid response for location string', async () => {
      const expectedDealersList = {
        dealerSearchResults: {
          vendors: [
            { distance: 45, name: 'Gates of Harlow' },
            { distance: 215, name: 'Gates of Stevanage' },
          ],
          dealerLeadTimeGroupMatched: true,
        },
        deliveryAddress: { position: [1, 2], title: 'title1' },
      };
      const searchString = 'this is a valid search string';
      const thunkAPI = { getState: jest.fn() };
      expect.assertions(1);
      await expect(
        getSuggestedDealersPayloadCreator({ searchString }, thunkAPI)
      ).resolves.toEqual(expectedDealersList);
    });

    it('should resolve with an array of suggested dealers and deliveryAddress when service returns valid response for Postal code', async () => {
      const expectedDealersList = {
        dealerSearchResults: {
          vendors: [
            { distance: 45, name: 'Gates of Harlow' },
            { distance: 215, name: 'Gates of Stevanage' },
          ],
          dealerLeadTimeGroupMatched: true,
        },
        deliveryAddress: {
          position: [3, 4],
          title: 'title1',
          locationId: '1234',
        },
      };
      const searchString = 'E17 8EG';
      const thunkAPI = { getState: jest.fn() };
      expect.assertions(1);
      await expect(
        getSuggestedDealersPayloadCreator({ searchString }, thunkAPI)
      ).resolves.toEqual(expectedDealersList);
    });
  });

  describe('allocateDealerPayloadCreator', () => {
    it('should call allocateAndGetDistanceToDealer with correct parameters', async () => {
      const selectedDealer = { title: 'Gates of Harlow', position: [0, 0] };
      const getState = jest.fn();
      const dispatch = jest.fn();
      const thunkAPI = { getState, dispatch };
      const expectedArguments = [selectedDealer, getState, dispatch];

      expect.assertions(2);
      await allocateDealerPayloadCreator({ selectedDealer }, thunkAPI);

      expect(allocateAndGetDistanceToDealer).toHaveBeenCalledTimes(1);
      expect(allocateAndGetDistanceToDealer.mock.calls[0]).toEqual(
        expectedArguments
      );
    });

    it('should reject with error message when service call fails', async () => {
      const expectedErrorMessage = 'Update dealer service failed';
      const selectedDealer = 'service should fail';
      const thunkAPI = { dispatch: jest.fn(), getState: jest.fn() };
      expect.assertions(1);
      await expect(
        allocateDealerPayloadCreator({ selectedDealer }, thunkAPI)
      ).rejects.toEqual(expectedErrorMessage);
    });

    it('should reject with validation message when service returns invalid results', async () => {
      const expectedErrorMessage = 'Update dealer service failed';
      const selectedDealer = 'service should fail';
      const thunkAPI = { getState: jest.fn() };
      expect.assertions(1);
      await expect(
        allocateDealerPayloadCreator({ selectedDealer }, thunkAPI)
      ).rejects.toEqual(expectedErrorMessage);
    });

    it('should resolve with the distance to the allocated dealer when service returns valid response', async () => {
      const selectedDealer = { title: 'Gates of Harlow', position: [1, 2] };
      const thunkAPI = { getState: jest.fn() };

      expect.assertions(1);
      await expect(
        allocateDealerPayloadCreator({ selectedDealer }, thunkAPI)
      ).resolves.toEqual({ distanceToDealer: 127 });
    });
  });
});
