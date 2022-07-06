/**
 * Thunks
 *
 * @typedef {object} autoAllocateDealerFromLocationIdParams
 * @property {string} locationId
 *
 * @typedef {object} CreateAsyncThunkThunkAPI
 * @property {function} getState
 * @property {function} dispatch
 * @property {function} rejectWithValue
 *
 * @typedef {object} getAutoSuggestLocationsParams
 * @property {string} searchString
 *
 * @typedef {object} getCoordinatesFromLocationServiceParams
 * @property {string} locationId
 *
 * @typedef {object} GeoCoordinates
 * @property {number} latitude
 * @property {number} longitude
 *
 * State
 *
 * @typedef {object} DataRequestInfo
 * @property {string|null} error - Error message received from last request
 * @property {boolean} isLoading - Indicates that request is loading/in-progress
 *
 * @typedef {object} DealerSearchDataRequests
 * @property {DataRequestInfo} getAutoSuggestLocations
 *
 * @typedef {object} DealerSearchDeliveryParams
 * @property {DealerSearchCountry} country
 * @property {string|null} latitude
 * @property {string|null} longitude
 * @property {"delivery"|"collection"|null} method
 * @property {string|null} postalCode
 * @property {string|null} radius
 *
 * @typedef {object} DealerSearchSearchParams
 * @property {string|null} additionalFilters - List of filters customer selected in showroom
 * @property {DealerSearchDeliveryParams} delivery
 * @property {string|null} groupBy - Unique customer selectable product configuration (mandatory for inventory journey)
 * @property {string|null} hasInventory - Indicates whether the customer is on an inventory or inventory-less journey
 * @property {true} isDeliveryMethodFixed - Indicates that results should not include dealers that do not provide the selected delivery method
 * @property {true} isOrderEnrolled - Defines the type of journey: true for an order based journey, false for a reservation journey
 * @typedef {"byDistance"} sort - Sort order: use "byDistance" for auto-allocation
 *
 * @typedef {object} DealerSearchCountry
 * @property {string|null} isocode - Dealer ISO country code
 * @property {string|null} name - Dealer country code
 *
 * @typedef {object} DealerSearchSelectedDealer
 * @property {DealerSearchCountry} country
 * @property {boolean|null} dealerLeadTimeGroupMatched - Indicates that there is inventory for the selected "lead time group"
 * @property {number|null} distance - Distance between delivery location and dealer
 * @property {string|null} id - Dealer id
 * @property {string|null} leadTime - The number of weeks to fulfill the order/sale
 * @property {string|null} name - Dealer name
 *
 * @typedef {object} DealerSearchAutoSuggestLocation
 *
 * @typedef {object} DealerSearchState
 * @property {DealerSearchDataRequests} dataRequests
 * @property {DealerSearchSearchParams} searchParams
 * @property {DealerSearchSelectedDealer} selectedDealer
 * @property {DealerSearchAutoSuggestLocation} autoSuggestLocations
 * @property {DealerSearchDealersList} suggestedDealers
 * @property {boolean} dealerLeadTimeGroupMatched
 */
