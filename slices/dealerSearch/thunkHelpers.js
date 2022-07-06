import {
  getAddressDetailsFromPosition,
  getLocationInfoFromCoords,
} from '@Services/heremapService/HereMapService';
import {
  getDealerLeadTimeGroupMatched,
  getDealerSearchQueryParams,
  getUpdateDealerRequestBody,
  getUserAddress,
} from '@Slices/dealerSearch/selectors';
import { getDealerSearchResults } from '@Services/dealerSearch/dealerSearchService';
import CountryInformationService from '@Services/countryInformationService/CountryInformationService';
import PropertiesService from '@Services/propertiesService/PropertiesService';
import { updateDealer } from '@Services/updateDealer/updateDealerService';
import { getDeliveryOptions } from '@Ducks/deliveryData/thunks';
import { getAccessories, getCart } from '@Ducks/sap/thunks';
import { resetConfigStateToken } from '@Ducks/vehicleData/actions';
import { ACCESSORY_PRODUCT_TYPE } from '@Constants/main';
import { updateShowCartNotification } from '@Ducks/cart/actions';
import { getOrderCatalogId } from '@Ducks/orderData/selectors';
import { getOrderCode } from '@Ducks/pricingInformation/selectors';
import { getAccessToken } from '@Slices/fma/selectors';

export function getGetDealerSearchResultsParams({ position, getState }) {
  const incompleteQueryParams = getDealerSearchQueryParams(getState());
  return {
    queryParams: {
      ...incompleteQueryParams,
      catalogId: getOrderCatalogId(getState()),
      latitude: position[0],
      longitude: position[1],
    },
  };
}

export async function allocateAndGetDistanceToDealer(
  dealer,
  getState,
  dispatch
) {
  const userAddress = getUserAddress(getState());
  const dealerId = dealer?.code;
  const distanceToDealer = parseFloat(dealer?.distance);
  const userPosition = { lat: userAddress[0], lng: userAddress[1] };
  const address = await getLocationInfoFromCoords(userPosition);
  const deliveryZipcode = address?.address.PostalCode;
  const deliveryCountryName = address.address.AdditionalData.find(
    ({ key }) => key === 'CountryName'
  )?.value;
  const dealerLeadTimeGroupMatched = getDealerLeadTimeGroupMatched(getState());

  /**
   * update dealer
   */
  const autoAllocatedDealerInfo = {
    dealerId,
    distanceToDealer,
    dealerLeadTimeGroupMatched,
  };
  const deliveryAddressDetails = {
    deliveryZipcode,
    deliveryCountryName,
    deliveryCountryCode: CountryInformationService.getCountryCode(
      PropertiesService.getPageProperties().fmaLangCode
    ),
  };

  const updateDealerParams = getUpdateDealerParams({
    autoAllocatedDealerInfo,
    deliveryAddressDetails,
    geoCoords: {
      lat: userAddress[0],
      lng: userAddress[1],
    },
    getState,
  });

  await updateDealer(updateDealerParams);

  /**
   * update delivery options and cart
   */
  dispatch(
    getDeliveryOptions(
      getGetDeliveryOptionsParams({ updateDealerParams, getState })
    )
  );
  dispatch(getCart({ orderCode: updateDealerParams?.cartId }));

  /**
   * update accessories and charging
   */
  dispatch(resetConfigStateToken());
  dispatch(
    getAccessories({
      productType: ACCESSORY_PRODUCT_TYPE.ACCESSORY,
      orderCode: updateDealerParams?.cartId,
    })
  );
  dispatch(
    getAccessories({
      productType: ACCESSORY_PRODUCT_TYPE.CHARGING,
      orderCode: updateDealerParams?.cartId,
    })
  );
  dispatch(updateShowCartNotification(true));

  /**
   * until distance-to-dealer is persisted in cart response, save it to redux state
   */
  return { distanceToDealer };
}

export async function autoAllocateAndGetDistanceToDealer({
  position,
  getState,
  dispatch,
}) {
  /**
   * get address details
   */
  const {
    postalCode: deliveryZipcode,
    countryName: deliveryCountryName,
  } = await getAddressDetailsFromPosition(position);

  /**
   * allocate the nearest dealer (first search result)
   */
  const incompleteQueryParams = getDealerSearchQueryParams(getState());
  const getDealerSearchResultsParams = {
    queryParams: {
      ...incompleteQueryParams,
      catalogId: getOrderCatalogId(getState()),
      latitude: position[0],
      longitude: position[1],
    },
  };
  const { vendors, dealerLeadTimeGroupMatched } = await getDealerSearchResults(
    getDealerSearchResultsParams
  );
  const dealer = vendors[0];
  const dealerId = dealer?.code ?? null;
  const distanceToDealer = dealer?.distance ?? null;

  /**
   * update dealer
   */
  const autoAllocatedDealerInfo = {
    dealerId,
    distanceToDealer,
    dealerLeadTimeGroupMatched,
  };
  const deliveryAddressDetails = {
    deliveryZipcode,
    deliveryCountryName,
    deliveryCountryCode: CountryInformationService.getCountryCode(
      PropertiesService.getPageProperties().fmaLangCode
    ),
  };
  const updateDealerParams = getUpdateDealerParams({
    autoAllocatedDealerInfo,
    deliveryAddressDetails,
    geoCoords: { lat: position[0], lng: position[1] },
    getState,
  });
  await updateDealer(updateDealerParams);

  /**
   * update delivery options and cart
   */
  dispatch(
    getDeliveryOptions(
      getGetDeliveryOptionsParams({ updateDealerParams, getState })
    )
  );
  dispatch(getCart({ orderCode: updateDealerParams?.cartId }));

  /**
   * update accessories and charging
   */
  dispatch(resetConfigStateToken());
  dispatch(
    getAccessories({
      productType: ACCESSORY_PRODUCT_TYPE.ACCESSORY,
      orderCode: updateDealerParams?.cartId,
    })
  );
  dispatch(
    getAccessories({
      productType: ACCESSORY_PRODUCT_TYPE.CHARGING,
      orderCode: updateDealerParams?.cartId,
    })
  );
  dispatch(updateShowCartNotification(true));

  /**
   * until distance-to-dealer is persisted in cart response, save it to redux state
   */
  return { distanceToDealer };
}

export function getGetDeliveryOptionsParams({
  updateDealerParams,
  getState = () => {},
}) {
  return {
    accessToken: getAccessToken(getState()),
    cartId: updateDealerParams?.cartId,
    dealerId: updateDealerParams?.requestBody?.dealerId,
    deliveryLat: updateDealerParams?.requestBody?.deliveryData?.deliveryLat,
    deliveryLong: updateDealerParams?.requestBody?.deliveryData?.deliveryLong,
    deliveryCountry:
      updateDealerParams?.requestBody?.deliveryData?.deliveryCountry.isocode,
    deliveryZipcode:
      updateDealerParams?.requestBody?.deliveryData?.deliveryZipcode,
  };
}

// TODO: US3150880: convert this from a helper function to a service method
// TODO: US3150880: add test coverage
export async function getGeoCoordsFromBrowser() {
  const pos = await new Promise((resolve, reject) => {
    const successHandler = resolve;
    const errorHandler = ({ message }) => reject(message);

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      maximumAge: 60000,
      enableHighAccuracy: true,
    });
  });

  return [pos?.coords?.latitude, pos?.coords?.longitude];
}

export function getUpdateDealerParams({
  autoAllocatedDealerInfo,
  deliveryAddressDetails,
  geoCoords,
  getState,
}) {
  const {
    deliveryZipcode,
    deliveryCountryName,
    deliveryCountryCode,
  } = deliveryAddressDetails;

  const { dealerId, dealerLeadTimeGroupMatched } = autoAllocatedDealerInfo;

  const incompleteUpdateDealerParamsRequestBody = getUpdateDealerRequestBody(
    getState()
  );

  const updateDealerParamsRequestBody = {
    ...incompleteUpdateDealerParamsRequestBody,
    dealerId,
    dealerLeadTimeGroupMatched,
    deliveryData: {
      ...incompleteUpdateDealerParamsRequestBody.deliveryData,
      deliveryZipcode,
      deliveryCountry: {
        ...incompleteUpdateDealerParamsRequestBody.deliveryData.deliveryCountry,
        isocode: deliveryCountryCode,
        name: deliveryCountryName,
      },
      deliveryLat: geoCoords?.lat,
      deliveryLong: geoCoords?.lng,
    },
  };

  // TODO: US3150880: scrub non-mandatory fields like this in the service and then remove this
  if (updateDealerParamsRequestBody.additionalFilters === null) {
    delete updateDealerParamsRequestBody.additionalFilters;
  }
  const cartId = getOrderCode(getState());

  return {
    cartId,
    requestBody: updateDealerParamsRequestBody,
  };
}
