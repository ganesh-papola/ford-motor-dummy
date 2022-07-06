import * as selectors from './selectors';
import initialState from '@Slices/dealerSearch/initialState';
import { getMockDealerSearchQueryParams } from '@Services/dealerSearch/dealerSearchServiceMocks';
import { getMockUpdateDealerRequestBody } from '@Services/updateDealer/updateDealerServiceMocks';
import PropertiesService from '@Services/propertiesService/PropertiesService';
import {
  getSuggestedDealers,
  getDealerLeadTimeGroupMatched,
} from './selectors';

describe('dealerSearch selectors', () => {
  describe('getDealerSearchQueryParams', () => {
    it('returns the current value of the dealer search query params', () => {
      const expectedQueryParams = getMockDealerSearchQueryParams();
      const {
        additionalFilters,
        deliveryMethod,
        groupBy,
        hasInventory,
        isDeliveryMethodFixed,
        isOrderEnrolled,
        latitude,
        longitude,
        radius,
        sort,
      } = expectedQueryParams;
      const currentState = {
        dealerSearch: {
          ...initialState,
          searchParams: {
            ...initialState?.searchParams,
            additionalFilters,
            delivery: {
              ...initialState?.searchParams?.delivery,
              latitude,
              longitude,
              methodType: deliveryMethod,
              radius,
            },
            groupBy,
            hasInventory,
            isDeliveryMethodFixed,
            isOrderEnrolled,
            sort,
          },
        },
      };
      const selectedQueryParams = selectors.getDealerSearchQueryParams(
        currentState
      );

      expect(selectedQueryParams).toEqual(expectedQueryParams);
    });
  });

  describe('getUpdateDealerRequestBody', () => {
    it('returns the request body with current values from dealerSearch state', () => {
      const expectedRequestBody = getMockUpdateDealerRequestBody();
      const {
        dealerId,
        hasInventory,
        dealerLeadTimeGroupMatched,
        additionalFilters,
        deliveryData: {
          deliveryZipcode: postalCode,
          deliveryCountry: { isocode, name },
          deliveryMethodSelected: { type: methodType },
          deliveryLat: latitude,
          deliveryLong: longitude,
        },
      } = expectedRequestBody;
      const currentState = {
        dealerSearch: {
          ...initialState,
          searchParams: {
            ...initialState?.searchParams,
            additionalFilters,
            delivery: {
              ...initialState?.searchParams.delivery,
              country: { isocode, name },
              latitude,
              longitude,
              methodType,
              postalCode,
            },
            hasInventory,
          },

          selectedDealer: {
            ...initialState?.selectedDealer,
            dealerLeadTimeGroupMatched,
            id: dealerId,
          },
        },
      };
      const selectedRequestBody = selectors.getUpdateDealerRequestBody(
        currentState
      );

      expect(selectedRequestBody).toEqual(expectedRequestBody);
    });
  });

  describe('getAutoAllocateDealerHasFailed', () => {
    it('returns a boolean value if dealer select has failed', () => {
      const currentState = {
        dealerSearch: {
          ...initialState,
          dataRequests: {
            ...initialState.dataRequests,
            autoAllocateDealerFromBrowserLocation: {
              ...initialState.dataRequests
                .autoAllocateDealerFromBrowserLocation,
              error: 'Browser location failed',
            },
          },
        },
      };
      const expectedHasDealerSearchFailed = selectors.getAutoAllocateDealerHasFailed(
        currentState
      );
      expect(expectedHasDealerSearchFailed).toBeTruthy();
    });
  });

  describe('getDealerSelectDealerDistance', () => {
    it('returns the correct value if there is one assigned', () => {
      const currentState = {
        dealerSearch: {
          ...initialState,
          selectedDealer: {
            distance: 10,
          },
        },
      };
      const result = selectors.getDealerSelectDealerDistance(currentState);
      expect(result).toEqual(10);
    });

    it('returns null if there is nothing set', () => {
      const currentState = {
        dealerSearch: {
          ...initialState,
        },
      };
      const result = selectors.getDealerSelectDealerDistance(currentState);
      expect(result).toEqual(null);
    });
  });

  describe('getDealerSelectDealerDistanceFormatted', () => {
    it('returns the correct value if there is one assigned', () => {
      PropertiesService.getPageProperties = jest.fn().mockImplementation(() => {
        return {
          numberValueDecimalLength: '2',
          numberDecimalDelimiter: '.',
        };
      });

      const currentState = {
        dealerSearch: {
          ...initialState,
          selectedDealer: {
            distance: 10.12345,
          },
        },
      };
      const result = selectors.getDealerSelectDealerDistanceFormatted(
        currentState
      );
      expect(result).toEqual('10.12');
    });
  });

  describe('getSuggestedDealers', () => {
    it('returns array of dealers, with the shortest lead time first and the remaining in ascending order of distance', () => {
      const expectedDealersList = [
        {
          code: 'GBR|42184|MA|F',
          distance: 9.890421,
          leadTime: '10',
          name: 'Gates of Woodford',
        },
        {
          code: 'GBR|42184|LA|F',
          distance: 10.824661,
          leadTime: '5',
          name: 'Gates of Enfield',
        },
        {
          code: 'GBR|42184|JA|F',
          distance: 18.444471,
          leadTime: '20',
          name: 'Gates of St Albans',
        },
        {
          code: 'GBR|42184|AA|F',
          distance: 22.295828,
          leadTime: '15',
          name: 'Gates of Harlow',
        },
        {
          code: 'GBR|42184|AA|F',
          distance: 23.295828,
          leadTime: '5',
          name: 'Gates of Harlow further away',
        },
        {
          code: 'GBR|42184|AA|F',
          distance: 24.295828,
          leadTime: '5',
          name: 'Gates of Harlow further further away',
        },
      ];

      const currentState = {
        dealerSearch: {
          suggestedDealers: expectedDealersList,
        },
      };

      const sortedDealerList = [
        {
          code: 'GBR|42184|LA|F',
          distance: 10.824661,
          leadTime: '5',
          name: 'Gates of Enfield',
        },
        {
          code: 'GBR|42184|MA|F',
          distance: 9.890421,
          leadTime: '10',
          name: 'Gates of Woodford',
        },
        {
          code: 'GBR|42184|JA|F',
          distance: 18.444471,
          leadTime: '20',
          name: 'Gates of St Albans',
        },
        {
          code: 'GBR|42184|AA|F',
          distance: 22.295828,
          leadTime: '15',
          name: 'Gates of Harlow',
        },
        {
          code: 'GBR|42184|AA|F',
          distance: 23.295828,
          leadTime: '5',
          name: 'Gates of Harlow further away',
        },
        {
          code: 'GBR|42184|AA|F',
          distance: 24.295828,
          leadTime: '5',
          name: 'Gates of Harlow further further away',
        },
      ];

      const result = getSuggestedDealers(currentState);

      expect(result).toEqual(sortedDealerList);
    });
  });

  describe('getDealerLeadTimeGroupMatched', () => {
    it('returns lead time group matched', () => {
      const expectedDealersList = true;

      const currentState = {
        dealerSearch: {
          dealerLeadTimeGroupMatched: true,
        },
      };

      const result = getDealerLeadTimeGroupMatched(currentState);
      expect(result).toEqual(expectedDealersList);
    });
  });

  // TODO: US2913698: add missing test for getUserLocationHasFailed
});
