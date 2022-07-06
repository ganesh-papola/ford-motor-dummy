import { numericFormatter } from '@Utils/Utils';
import PropertiesService from '@Services/propertiesService/PropertiesService';

export function getDealerSearchQueryParams(state) {
  const {
    additionalFilters,
    groupBy,
    hasInventory,
    isDeliveryMethodFixed,
    isOrderEnrolled,
    sort,
    delivery: { methodType: deliveryMethod, latitude, longitude, radius },
  } = state?.dealerSearch?.searchParams;

  return {
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
  };
}

export function getUpdateDealerRequestBody(state) {
  const {
    selectedDealer: { dealerLeadTimeGroupMatched, id: dealerId },
    searchParams: {
      additionalFilters,
      delivery: {
        country: { isocode, name },
        latitude: deliveryLat,
        longitude: deliveryLong,
        methodType: type,
        postalCode: deliveryZipcode,
      },
      hasInventory,
    },
  } = state.dealerSearch;

  return {
    dealerId,
    hasInventory,
    dealerLeadTimeGroupMatched,
    additionalFilters,
    deliveryData: {
      deliveryZipcode,
      deliveryCountry: {
        isocode,
        name,
      },
      deliveryMethodSelected: {
        type,
      },
      deliveryLat,
      deliveryLong,
    },
  };
}

export function getUserLocationHasFailed(state) {
  return state?.dealerSearch?.dataRequests?.getGeoCoordsFromBrowser?.error;
}

export function getDealerSearchFailedErrorMessage(state) {
  const dataRequest = Object.values(state?.dealerSearch?.dataRequests);

  const firstDataRequestWithError = dataRequest.find(
    ({ shouldTriggerErrMsgInUi, error }) => {
      return shouldTriggerErrMsgInUi === true && error !== null;
    }
  );

  if (firstDataRequestWithError === undefined) return null;
  return firstDataRequestWithError?.error.toString();
}

// TODO: Add test coverage
export function getAutoAllocateDealerHasFailed(state) {
  return getDealerSearchFailedErrorMessage(state) !== null;
}

export function getDealerSelectDealerDistance(state) {
  return state?.dealerSearch?.selectedDealer?.distance;
}

export function getDealerSelectDealerDistanceFormatted(state) {
  const distance = state?.dealerSearch?.selectedDealer?.distance;
  const formattedDistance = numericFormatter({
    value: distance,
    forceDecimalLength: PropertiesService.getPageProperties()
      .numberValueDecimalLength,
    decimalDelimiter: PropertiesService.getPageProperties()
      .numberDecimalDelimiter,
  });

  return formattedDistance || null;
}

export function getUserAddress(state) {
  const latitude = state.dealerSearch.searchParams.delivery.latitude;
  const longitude = state.dealerSearch.searchParams.delivery.longitude;
  return [latitude, longitude];
}

export function getSuggestedDealers(state) {
  if (state?.dealerSearch?.suggestedDealers?.length === 0) {
    return [];
  }

  const suggestedDealers = state?.dealerSearch?.suggestedDealers;

  const sortedByLeadTime = [...suggestedDealers]
    .sort((a, b) => a.leadTime - b.leadTime)
    .reduce(
      (prevDealer, currDealer) =>
        Math.floor(currDealer.leadTime) <= prevDealer.min
          ? {
              ...prevDealer,
              min: currDealer.leadTime,
              arr: [...prevDealer.arr, currDealer],
            }
          : prevDealer,
      {
        min: Infinity,
        arr: [],
      }
    )
    .arr.sort((a, b) => a.distance - b.distance);

  return [...new Set([sortedByLeadTime[0], ...suggestedDealers])];
}

export function getDealerLeadTimeGroupMatched(state) {
  return state?.dealerSearch?.dealerLeadTimeGroupMatched;
}
