import initialState from './initialState';
import { reducer, actions as asDealerSearchActions } from './slice';
import {
  autoAllocateDealerFromBrowserLocation,
  getSuggestedDealers,
  allocateDealer,
} from './thunks';
import {
  updateDeliveryOptionsSuccess,
  updateReservationDeliveryData,
  updateSelectedDeliveryMethod,
} from '@Ducks/deliveryData/actions';
import {
  createCartTry,
  getCartSuccess,
  orderToCartSuccess,
} from '@Ducks/sap/actions';
import { DELIVERY_CARDS_TYPES } from '@Constants/main';
import { getEstimatedGroupByFromGetCartResponseBody } from '@Slices/dealerSearch/utilities';

const {
  setDeliveryGeoCoords,
  setDeliveryPostalCode,
  setDeliveryRadius,
  setGroupBy,
  clearLocationErrorMessage,
  clearAutoAllocationErrors,
} = asDealerSearchActions;

describe('dealerSearch reducer', () => {
  it('should return initial state for unknown action', () => {
    expect(reducer(initialState, { type: '' })).toEqual(initialState);
  });

  describe(`for action type ${setDeliveryGeoCoords}`, () => {
    it('should set lat and long to values from payload', () => {
      const payload = { latitude: '12.34', longitude: '56.78' };
      const expectedState = getInitStateWithUpdatedDeliveryProps(payload);
      const nextState = reducer(initialState, setDeliveryGeoCoords(payload));

      expect(nextState).toEqual(expectedState);
    });

    it('should set lat and long values to null for invalid payload', () => {
      const payload = { monkey: '🐵' };
      const previousGeoCoords = { latitude: '51.57', longitude: '0.44' };
      const previousState = getInitStateWithUpdatedDeliveryProps(
        previousGeoCoords
      );
      const expectedState = getInitStateWithUpdatedDeliveryProps({
        latitude: null,
        longitude: null,
      });
      const nextState = reducer(previousState, setDeliveryGeoCoords(payload));

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${setDeliveryPostalCode}`, () => {
    it('should set postal code to value from payload', () => {
      const payload = '12345';
      const expectedState = getInitStateWithUpdatedDeliveryProps({
        postalCode: payload,
      });
      const nextState = reducer(initialState, setDeliveryPostalCode(payload));

      expect(nextState).toEqual(expectedState);
    });

    it('should set postal code value to null for invalid payload', () => {
      const payload = undefined;
      const previousPostalCode = '12345';
      const previousState = getInitStateWithUpdatedDeliveryProps({
        postalCode: previousPostalCode,
      });
      const expectedState = getInitStateWithUpdatedDeliveryProps({
        postalCode: null,
      });
      const nextState = reducer(previousState, setDeliveryPostalCode(payload));

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${setDeliveryRadius}`, () => {
    it('should set radius to value from payload', () => {
      const payload = 123;
      const expectedState = getInitStateWithUpdatedDeliveryProps({
        radius: payload,
      });
      const nextState = reducer(initialState, setDeliveryRadius(payload));

      expect(nextState).toEqual(expectedState);
    });

    it('should set radius value to null for invalid payload', () => {
      const payload = undefined;
      const previousRadius = null;
      const previousState = getInitStateWithUpdatedDeliveryProps({
        radius: previousRadius,
      });
      const expectedState = getInitStateWithUpdatedDeliveryProps({
        radius: null,
      });
      const nextState = reducer(previousState, setDeliveryRadius(payload));

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${setGroupBy}`, () => {
    it('should update groupBy value', () => {
      const groupBy = 'group by, not group buy';
      const expectedState = {
        ...initialState,
        searchParams: {
          ...initialState.searchParams,
          groupBy,
        },
      };
      const nextState = reducer(initialState, setGroupBy(groupBy));

      expect(nextState).toEqual(expectedState);
    });

    it('should set groupBy value to null for invalid payload', () => {
      const expectedState = {
        ...initialState,
        searchParams: {
          ...initialState.searchParams,
          groupBy: null,
        },
      };
      const nextState = reducer(initialState, setGroupBy());

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${clearLocationErrorMessage}`, () => {
    it('should set getGeoCoordsFromBrowser error to null', () => {
      const expectedState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          getGeoCoordsFromBrowser: {
            ...initialState.dataRequests.getGeoCoordsFromBrowser,
            error: null,
          },
        },
      };
      const nextState = reducer(initialState, clearLocationErrorMessage());

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${clearAutoAllocationErrors}`, () => {
    it('should clear AutoAllocation errors to null', () => {
      const previousState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          autoAllocateDealerFromBrowserLocation: {
            ...initialState.dataRequests.autoAllocateDealerFromBrowserLocation,
            error: 'Error!',
          },
        },
      };
      const expectedState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          autoAllocateDealerFromBrowserLocation: {
            ...initialState.dataRequests.autoAllocateDealerFromBrowserLocation,
            error: null,
          },
        },
      };
      const nextState = reducer(previousState, clearAutoAllocationErrors());

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${autoAllocateDealerFromBrowserLocation.pending.type}`, () => {
    it('should set error to null and isLoading to true', () => {
      const previousState = { ...initialState };
      const expectedState = {
        ...previousState,
        dataRequests: {
          ...previousState.dataRequests,
          autoAllocateDealerFromBrowserLocation: {
            ...previousState.dataRequests.autoAllocateDealerFromBrowserLocation,
            isLoading: true,
            error: null,
          },
        },
      };
      const action = {
        type: autoAllocateDealerFromBrowserLocation.pending.type,
      };
      const nextState = reducer(previousState, action);

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${autoAllocateDealerFromBrowserLocation.fulfilled.type}`, () => {
    it('should set error to null, isLoading to false, and record selectedDealer data', () => {
      const previousState = { ...initialState };
      const expectedDistance = 785;
      const expectedState = {
        ...previousState,
        selectedDealer: {
          ...previousState.selectedDealer,
          distance: expectedDistance,
        },
      };
      const action = {
        type: autoAllocateDealerFromBrowserLocation.fulfilled.type,
        payload: { distanceToDealer: expectedDistance },
      };
      const nextState = reducer(previousState, action);

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${autoAllocateDealerFromBrowserLocation.rejected.type}`, () => {
    it('should record error message and set isLoading to false', () => {
      const previousState = { ...initialState };
      const expectedErrorMessage = 'This is the expected error message';
      const expectedState = {
        ...previousState,
        dataRequests: {
          ...previousState.dataRequests,
          autoAllocateDealerFromBrowserLocation: {
            ...previousState.dataRequests.autoAllocateDealerFromBrowserLocation,
            isLoading: false,
            error: expectedErrorMessage,
          },
        },
      };
      const action = {
        type: autoAllocateDealerFromBrowserLocation.rejected.type,
        error: expectedErrorMessage,
      };
      const nextState = reducer(previousState, action);

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${getSuggestedDealers.pending.type}`, () => {
    it('sets isLoading to true and error to false', () => {
      const previousState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          getSuggestedDealers: {
            isLoading: false,
            error: 'something!',
          },
        },
      };

      const expectedState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          getSuggestedDealers: {
            isLoading: true,
            error: null,
          },
        },
      };

      const action = {
        type: getSuggestedDealers.pending.type,
      };
      const nextState = reducer(previousState, action);

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${getSuggestedDealers.fulfilled.type}`, () => {
    it('sets isLoading to false and update dealers list and delivery address', () => {
      const expectedDealersList = {
        vendors: [
          { distance: 45, name: 'Gates of Harlow' },
          { distance: 215, name: 'Gates of Stevanage' },
        ],
      };
      const expectedDealerLeadTimeGroupMatched = true;

      const previousState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          getSuggestedDealers: {
            isLoading: true,
            error: null,
          },
        },
      };

      const expectedState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          getSuggestedDealers: {
            isLoading: false,
            error: null,
          },
        },
        searchParams: {
          ...initialState.searchParams,
          delivery: {
            ...initialState.searchParams.delivery,
            latitude: 12,
            longitude: 34,
          },
        },
        suggestedDealers: expectedDealersList,
        dealerLeadTimeGroupMatched: expectedDealerLeadTimeGroupMatched,
      };

      const action = {
        type: getSuggestedDealers.fulfilled.type,
        payload: {
          deliveryAddress: {
            position: [12, 34],
          },
          dealerSearchResults: {
            dealerLeadTimeGroupMatched: expectedDealerLeadTimeGroupMatched,
            vendors: expectedDealersList,
          },
        },
      };
      const nextState = reducer(previousState, action);
      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${getSuggestedDealers.rejected.type}`, () => {
    it('sets isLoading to false and error to error from payload', () => {
      const error = 'this is the error!';
      const previousState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          getSuggestedDealers: {
            isLoading: true,
            error: null,
          },
        },
      };

      const expectedState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          getSuggestedDealers: {
            isLoading: false,
            error,
          },
        },
      };

      const action = {
        type: getSuggestedDealers.rejected.type,
        error,
      };
      const nextState = reducer(previousState, action);

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${allocateDealer.pending.type}`, () => {
    it('sets isLoading to true and error to false', () => {
      const previousState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          allocateDealer: {
            isLoading: false,
            error: 'something!',
          },
        },
      };

      const expectedState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          allocateDealer: {
            isLoading: true,
            error: null,
          },
        },
      };

      const action = {
        type: allocateDealer.pending.type,
      };
      const nextState = reducer(previousState, action);

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${allocateDealer.fulfilled.type}`, () => {
    it('sets isLoading to false and update dealer information and dealer distance', () => {
      const expectedDealerDistance = 555.35;
      const previousState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          allocateDealer: {
            isLoading: true,
            error: null,
          },
        },
      };

      const expectedState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          allocateDealer: {
            isLoading: false,
            error: null,
          },
        },
        selectedDealer: {
          ...initialState.selectedDealer,
          distance: expectedDealerDistance,
        },
      };

      const action = {
        type: allocateDealer.fulfilled.type,
        payload: { distanceToDealer: expectedDealerDistance },
      };
      const nextState = reducer(previousState, action);

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${allocateDealer.rejected.type}`, () => {
    it('sets isLoading to false and error to error from payload', () => {
      const error = 'this is the error from select dealer from dropdown!';
      const previousState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          allocateDealer: {
            isLoading: true,
            error: null,
          },
        },
      };

      const expectedState = {
        ...initialState,
        dataRequests: {
          ...initialState.dataRequests,
          allocateDealer: {
            isLoading: false,
            error,
          },
        },
      };

      const action = {
        type: allocateDealer.rejected.type,
        error,
      };
      const nextState = reducer(previousState, action);

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${createCartTry().type}`, () => {
    it('should update groupBy', () => {
      const groupBy = 'gro up by';
      const expectedState = getInitStateWithUpdatedSearchParams({ groupBy });
      const nextState = reducer(initialState, createCartTry({ groupBy }));

      expect(nextState).toEqual(expectedState);
    });

    it('should set groupBy value to null for invalid payload', () => {
      const groupBy = 'gro up by';
      const expectedState = getInitStateWithUpdatedSearchParams({
        groupBy: null,
      });
      const nextState = reducer(
        initialState,
        createCartTry({ INVALID: groupBy })
      );

      expect(nextState).toEqual(expectedState);
    });
  });

  describe(`for action type ${getCartSuccess().type}`, () => {
    it('should set the value of hasInventory for a valid payload', () => {
      const previousState = { ...initialState };
      const expectedHasInventory = true;
      const payload = {
        entries: [{ hasInventory: expectedHasInventory }],
      };
      const nextState = reducer(previousState, {
        type: getCartSuccess().type,
        payload,
      });
      const nextHasInventory = nextState.searchParams.hasInventory;

      expect(nextHasInventory).toEqual(expectedHasInventory);
    });

    it('should not set the value of hasInventory for an invalid payload', () => {
      const previousState = getInitStateWithUpdatedSearchParams({
        hasInventory: false,
      });
      const expectedHasInventory = previousState.searchParams.hasInventory;
      const payload = {
        entries: [{ hasInventoreee: 'no this aint right' }],
      };
      const nextState = reducer(previousState, {
        type: getCartSuccess().type,
        payload,
      });
      const nextHasInventory = nextState.searchParams.hasInventory;

      expect(nextHasInventory).toEqual(expectedHasInventory);
    });

    describe('when getCart response contains a valid groupBy property', () => {
      it('should set the value of groupBy to value received from getCart response', () => {
        const previousState = { ...initialState };
        const getCartResponseBodyWithValidGroupBy = getGetCartResponseBodyWithValidGroupBy();
        const expectedGroupBy = getCartResponseBodyWithValidGroupBy?.groupBy;
        const action = {
          type: getCartSuccess().type,
          payload: getCartResponseBodyWithValidGroupBy,
        };
        const nextState = reducer(previousState, action);
        const nextGroupBy = nextState.searchParams.groupBy;

        expect(nextGroupBy).toEqual(expectedGroupBy);
      });
    });

    describe('when getCart response does not contain a valid groupBy property', () => {
      describe('and when a valid groupBy value does not already exist in state', () => {
        describe('and when a valid estimatedGroupBy can be computed', () => {
          it('should set the value of groupBy to estimatedGroupBy', () => {
            const previousState = { ...initialState };
            const getCartResponseBodyWithValidGroupByData = getGetCartResponseBodyWithoutValidGroupByWithValidMockGroupByData();
            const expectedGroupBy = getEstimatedGroupByFromGetCartResponseBody(
              getCartResponseBodyWithValidGroupByData
            );
            const nextState = reducer(previousState, {
              type: getCartSuccess().type,
              payload: getCartResponseBodyWithValidGroupByData,
            });
            const nextGroupBy = nextState.searchParams.groupBy;

            expect(nextGroupBy).toEqual(expectedGroupBy);
          });
        });

        describe('and when a valid estimatedGroupBy can be not be computed', () => {
          it('should not set the value of groupBy to estimatedGroupBy', () => {
            const previousState = { ...initialState };
            const expectedGroupBy = previousState.searchParams.groupBy;
            const nextState = reducer(previousState, {
              type: getCartSuccess().type,
              payload: {},
            });
            const nextGroupBy = nextState.searchParams.groupBy;

            expect(nextGroupBy).toEqual(expectedGroupBy);
          });
        });
      });

      describe('and when a valid groupBy value already exists in state', () => {
        it('should not set the value of groupBy to estimatedGroupBy', () => {
          const previousState = getInitStateWithUpdatedSearchParams({
            groupBy: 'this is a valid groupBy value',
          });
          const getCartResponseBodyWithValidGroupByData = getGetCartResponseBodyWithoutValidGroupByWithValidMockGroupByData();
          const expectedGroupBy = previousState.searchParams.groupBy;
          const nextState = reducer(previousState, {
            type: getCartSuccess().type,
            payload: getCartResponseBodyWithValidGroupByData,
          });
          const nextGroupBy = nextState.searchParams.groupBy;

          expect(nextGroupBy).toEqual(expectedGroupBy);
        });
      });
    });
  });

  describe(`for action types ${orderToCartSuccess().type}, ${
    getCartSuccess().type
  }`, () => {
    it('should update additionalFilters for a valid payload', () => {
      const additionalFilters = 'another filter!';
      const expectedState = getInitStateWithUpdatedSearchParams({
        additionalFilters,
      });
      const payload = { entries: [{ dealer: { additionalFilters } }] };
      const nextStates = [
        reducer(initialState, orderToCartSuccess(payload)),
        reducer(initialState, getCartSuccess(payload)),
      ];

      expect(nextStates).toEqual(Array(2).fill(expectedState));
    });

    it('should not set additionalFilters to null for invalid payload', () => {
      const previousState = { ...initialState };
      const additionalFilters = 'another filter!';
      const payload = { entries: [{ INVALID: { additionalFilters } }] };
      const nextStates = [
        reducer(previousState, orderToCartSuccess(payload)),
        reducer(previousState, getCartSuccess(payload)),
      ];

      expect(nextStates).toEqual(Array(2).fill(previousState));
    });
  });

  describe(`for action types ${[getCartSuccess, updateDeliveryOptionsSuccess]
    .map((actionCreator) => actionCreator().type)
    .join(', ')}`, () => {
    it('should set the delivery method type for a valid payload', () => {
      const previousState = { ...initialState };
      const expectedDeliveryMethodType = DELIVERY_CARDS_TYPES.DELIVERY;
      const expectedState = getInitStateWithUpdatedDeliveryProps({
        methodType: expectedDeliveryMethodType,
      });
      const payload = {
        deliveryData: {
          deliveryMethodSelected: { type: expectedDeliveryMethodType },
        },
      };
      const nextStates = [
        getCartSuccess,
        updateDeliveryOptionsSuccess,
      ].map((actionCreator) =>
        reducer(previousState, { type: actionCreator().type, payload })
      );

      expect(nextStates).toEqual(Array(nextStates.length).fill(expectedState));
    });

    it('should not set the delivery method type for an invalid payload', () => {
      const previousState = { ...initialState };
      const payload = {
        deliveryData: {
          deliveryMethodSelected: { INVALID: 'something awful' },
        },
      };
      const nextStates = [getCartSuccess, updateDeliveryOptionsSuccess]
        .map((actionCreator) => actionCreator().type)
        .map((type) => reducer(previousState, { type, payload }));

      expect(nextStates).toEqual(Array(nextStates.length).fill(previousState));
    });
  });

  describe(`for action types ${[
    updateSelectedDeliveryMethod,
    updateReservationDeliveryData,
  ]
    .map((actionCreator) => actionCreator().type)
    .join(', ')}`, () => {
    it('should set the delivery method type for a valid payload', () => {
      const previousState = { ...initialState };
      const expectedDeliveryMethodType = DELIVERY_CARDS_TYPES.COLLECTION;
      const expectedState = getInitStateWithUpdatedDeliveryProps({
        methodType: expectedDeliveryMethodType,
      });
      const payload = {
        deliveryMethodSelected: expectedDeliveryMethodType,
      };
      const nextStates = [
        updateSelectedDeliveryMethod,
        updateReservationDeliveryData,
      ]
        .map((actionCreator) => actionCreator().type)
        .map((type) => reducer(previousState, { type, payload }));

      expect(nextStates).toEqual(Array(nextStates.length).fill(expectedState));
    });

    it('should not set the delivery method type for an invalid payload', () => {
      const previousState = { ...initialState };
      const payload = {
        deliveryData: {
          deliveryMethodSelected: { INVALID: 'something awful' },
        },
      };
      const nextStates = [
        updateSelectedDeliveryMethod,
        updateReservationDeliveryData,
      ]
        .map((actionCreator) => actionCreator().type)
        .map((type) => reducer(previousState, { type, payload }));

      expect(nextStates).toEqual(Array(nextStates.length).fill(previousState));
    });
  });
});

function getInitStateWithUpdatedDeliveryProps(deliveryProps) {
  return {
    ...initialState,
    searchParams: {
      ...initialState?.searchParams,
      delivery: {
        ...initialState?.searchParams?.delivery,
        ...deliveryProps,
      },
    },
  };
}

function getInitStateWithUpdatedSearchParams(searchParams) {
  return {
    ...initialState,
    searchParams: {
      ...initialState.searchParams,
      ...searchParams,
    },
  };
}

function getGetCartResponseBodyWithValidGroupBy() {
  return {
    groupBy:
      'WAEGB-CGW-2021-CX727BEVSUVGBR202100,11LP8,ACMRJ_VS-LE,BS-SA,DR--H_EN-C2_HTHAE_TR-WA,PNZAT-45450.0',
  };
}

function getGetCartResponseBodyWithoutValidGroupByWithValidMockGroupByData() {
  return {
    entries: [
      {
        product: {
          catalogId: 'WAEGB-CGW-2021-CX727BEVSUVGBR202100',
          features: [
            {
              family: {
                code: '#T#',
              },
              values: [
                {
                  code: '11MSJ',
                  guxCategoryLabels: 'trim',
                  guxCategories: ['trim'],
                },
              ],
            },
            {
              family: {
                code: 'MarketedSeries',
              },
              values: [
                {
                  code: 'ACMRA_VS-KZ',
                  guxCategoryLabels: 'series',
                  guxCategories: ['series'],
                },
              ],
            },
            {
              family: {
                code: 'BS-',
              },
              values: [
                {
                  code: 'BS-SA',
                  guxCategoryLabels: 'bodystyle',
                  guxCategories: ['bodystyle'],
                },
              ],
            },
            {
              family: {
                code: 'PowerTrain',
              },
              values: [
                {
                  code: 'DR--D_EN-EH_HTHAD_TR-WA',
                  guxCategoryLabels: 'powertrain.HBD.HAT',
                },
              ],
            },
            {
              family: {
                code: 'PAA',
              },
              values: [
                {
                  code: 'PNZAT',
                  guxCategoryLabels: 'paint.black',
                },
              ],
            },
            {
              family: {
                code: 'ACC',
              },
              values: [
                {
                  code: 'ACC',
                  guxCategoryLabels: 'features.accessories',
                },
              ],
            },
            {
              family: {
                code: 'OCC',
              },
              values: [
                {
                  code: 'OCC',
                  guxCategoryLabels: 'features.occ',
                },
              ],
            },
          ],
        },
      },
    ],
  };
}
