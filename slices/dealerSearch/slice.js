import { createSlice } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import {
  autoAllocateDealerFromBrowserLocation,
  allocateDealer,
  getSuggestedDealers,
} from './thunks';
import initialState from './initialState';
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
import {
  getEstimatedGroupByFromGetCartResponseBody,
  isNonEmptyString,
} from '@Slices/dealerSearch/utilities';

export const validDeliveryMethodTypeValues = Object.values(
  DELIVERY_CARDS_TYPES
);

export const slice = createSlice({
  name: 'dealerSearch',
  initialState,
  reducers,
  extraReducers: (builder) => {
    builder.addCase(autoAllocateDealerFromBrowserLocation.pending, (state) => {
      state.dataRequests.autoAllocateDealerFromBrowserLocation.isLoading = true;
      state.dataRequests.autoAllocateDealerFromBrowserLocation.error = null;
    });

    builder.addCase(
      autoAllocateDealerFromBrowserLocation.fulfilled,
      (state, { payload }) => {
        state.dataRequests.autoAllocateDealerFromBrowserLocation.isLoading = false;
        state.dataRequests.autoAllocateDealerFromBrowserLocation.error = null;
        state.selectedDealer.distance = payload?.distanceToDealer ?? null;
      }
    );

    builder.addCase(
      autoAllocateDealerFromBrowserLocation.rejected,
      (state, { error }) => {
        state.dataRequests.autoAllocateDealerFromBrowserLocation.isLoading = false;
        state.dataRequests.autoAllocateDealerFromBrowserLocation.error = error;
      }
    );

    builder.addCase(allocateDealer.pending, (state) => {
      state.dataRequests.allocateDealer.isLoading = true;
      state.dataRequests.allocateDealer.error = null;
    });

    builder.addCase(allocateDealer.fulfilled, (state, { payload }) => {
      state.dataRequests.allocateDealer.isLoading = false;
      state.selectedDealer.distance = payload?.distanceToDealer ?? null;
    });

    builder.addCase(allocateDealer.rejected, (state, { error }) => {
      state.dataRequests.allocateDealer.isLoading = false;
      state.dataRequests.allocateDealer.error = error;
    });

    builder.addCase(getSuggestedDealers.pending, (state) => {
      state.dataRequests.getSuggestedDealers.error = null;
      state.dataRequests.getSuggestedDealers.isLoading = true;
    });

    builder.addCase(getSuggestedDealers.fulfilled, (state, { payload }) => {
      state.dataRequests.getSuggestedDealers.isLoading = false;
      state.suggestedDealers = payload.dealerSearchResults.vendors;
      state.dealerLeadTimeGroupMatched =
        payload.dealerSearchResults.dealerLeadTimeGroupMatched;
      state.searchParams.delivery.latitude =
        payload.deliveryAddress.position[0];
      state.searchParams.delivery.longitude =
        payload.deliveryAddress.position[1];
    });

    builder.addCase(getSuggestedDealers.rejected, (state, { error }) => {
      state.dataRequests.getSuggestedDealers.error = error;
      state.dataRequests.getSuggestedDealers.isLoading = false;
      state.suggestedDealers = [];
    });

    builder.addCase(createCartTry().type, (state, { payload }) => {
      state.searchParams.groupBy = payload?.groupBy ?? null;
    });

    builder.addCase(getCartSuccess().type, (state, { payload }) => {
      const hasInventory = payload?.entries?.[0]?.hasInventory ?? null;
      if (hasInventory !== null) {
        state.searchParams.hasInventory = hasInventory;
      }

      // TODO: US3150880: revisit showroom to cart browser storage api in order to remove this

      // assign groupBy from getCart response if we receive it
      const groupByFromGetCart = payload?.groupBy ?? null;
      const groupByFromGetCartIsValid = isNonEmptyString(groupByFromGetCart);
      if (groupByFromGetCartIsValid) {
        state.searchParams.groupBy = groupByFromGetCart;
        return;
      }

      // otherwise assign estimated groupBy if we don't already have it in state
      const groupByInState = state.searchParams.groupBy;
      const isValidGroupBy = isNonEmptyString(groupByInState);
      if (isValidGroupBy) return;

      const estimatedGroupBy = getEstimatedGroupByFromGetCartResponseBody(
        payload
      );
      const isValidEstimatedGroupBy = isNonEmptyString(estimatedGroupBy);
      if (!isValidEstimatedGroupBy) return;

      state.searchParams.groupBy = estimatedGroupBy;
    });

    builder.addMatcher(
      ({ type }) =>
        [orderToCartSuccess().type, getCartSuccess().type].includes(type),
      (state, { payload }) => {
        const additionalFilters =
          payload?.entries?.[0]?.dealer?.additionalFilters ?? null;
        if (additionalFilters === null) return;

        state.searchParams.additionalFilters = additionalFilters;
      }
    );

    // TODO: US3150880: write a helper function to perform this repeated array manipulation
    builder.addMatcher(
      ({ type }) => {
        return [getCartSuccess, updateDeliveryOptionsSuccess]
          .map((actionCreator) => actionCreator().type)
          .includes(type);
      },
      (state, { payload }) => {
        const deliveryMethodType =
          payload?.deliveryData?.deliveryMethodSelected?.type ?? null;
        const isValidDeliveryMethodType =
          deliveryMethodType !== null &&
          validDeliveryMethodTypeValues.includes(deliveryMethodType);

        if (!isValidDeliveryMethodType) return;

        state.searchParams.delivery.methodType = deliveryMethodType;
      }
    );

    builder.addMatcher(
      ({ type }) => {
        return [updateSelectedDeliveryMethod, updateReservationDeliveryData]
          .map((actionCreator) => actionCreator().type)
          .includes(type);
      },
      (state, { payload }) => {
        const deliveryMethodType = payload?.deliveryMethodSelected ?? null;
        const isValidDeliveryMethodType =
          deliveryMethodType !== null &&
          validDeliveryMethodTypeValues.includes(deliveryMethodType);

        if (!isValidDeliveryMethodType) return;

        state.searchParams.delivery.methodType = deliveryMethodType;
      }
    );
  },
});

// TODO: US3150880: Remove updateDeliveryOptionsSuccess from this slice

export const { actions, reducer } = slice;
