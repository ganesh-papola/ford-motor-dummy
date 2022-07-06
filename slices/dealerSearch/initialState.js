/**
 * @type {DealerSearchState}
 */
const initialState = {
  suggestedDealers: [],
  dealerLeadTimeGroupMatched: false,

  dataRequests: {
    autoAllocateDealerFromBrowserLocation: {
      error: null,
      isLoading: false,
      shouldTriggerErrMsgInUi: true,
    },

    allocateDealer: {
      error: null,
      isLoading: false,
      shouldTriggerErrMsgInUi: true,
    },

    getGeoCoordsFromBrowser: {
      error: null,
      isLoading: false,
      shouldTriggerErrMsgInUi: false,
    },

    getSuggestedDealers: {
      error: null,
      isLoading: false,
      shouldTriggerErrMsgInUi: false,
    },
  },

  searchParams: {
    additionalFilters: null,
    delivery: {
      country: {
        isocode: null,
        name: null,
      },
      latitude: null,
      longitude: null,
      methodType: null,
      postalCode: null,
      radius: 300,
    },
    groupBy: null,
    hasInventory: null,
    isDeliveryMethodFixed: true,
    isOrderEnrolled: true,
    sort: 'byDistance',
  },

  selectedDealer: {
    dealerLeadTimeGroupMatched: null,
    distance: null,
    id: null,
    leadTime: null,
    name: null,
  },
};

export { initialState as default };
