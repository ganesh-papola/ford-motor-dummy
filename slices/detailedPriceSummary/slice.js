import initialState from './initialState';
import { createSlice } from '@reduxjs/toolkit';
import * as sapTypes from '@Ducks/sap/types';

export const slice = createSlice({
  name: 'detailedPriceSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      sapTypes.FETCH_RESERVATION_DETAILS_SUCCESS,
      (state, action) => {
        state.dealerizedPrice.totalVehiclePriceWithSavings =
          action?.payload?.data?.entries[0]?.detailedPriceSummary
            ?.dealerizedPrice?.totalVehiclePriceWithSavings ?? null;

        state.nonDealerizedPrice.totalPriceWithoutIncentives.grossRetailWithVehicleRegistrationTax =
          action?.payload?.data?.entries[0]?.detailedPriceSummary
            ?.nonDealerizedPrice?.totalPriceWithoutIncentives
            ?.grossRetailWithVehicleRegistrationTax ?? null;
      }
    );
    builder.addCase(sapTypes.GET_CART_SUCCESS, (state, action) => {
      state.dealerizedPrice.totalVehiclePriceWithSavings =
        action?.payload?.entries[0]?.detailedPriceSummary?.dealerizedPrice
          ?.totalVehiclePriceWithSavings ?? null;

      const basePriceArray =
        action?.payload?.entries[0]?.detailedPriceSummary?.nonDealerizedPrice
          ?.basePrice?.prices;

      const grossRetailWithVehicleRegistrationTaxBasePrice = getValueForSpecifiedType(
        basePriceArray,
        'grossRetailWithVehicleRegistrationTax'
      );

      state.nonDealerizedPrice.basePrice.grossRetailWithVehicleRegistrationTax = grossRetailWithVehicleRegistrationTaxBasePrice;

      const totalPriceWithoutIncentivesArray =
        action?.payload?.entries[0]?.detailedPriceSummary?.nonDealerizedPrice
          ?.totalPriceWithoutIncentives?.prices;

      const grossRetailWithVehicleRegistrationTaxTotalPriceWithoutIncentives = getValueForSpecifiedType(
        totalPriceWithoutIncentivesArray,
        'grossRetailWithVehicleRegistrationTax'
      );

      state.nonDealerizedPrice.totalPriceWithoutIncentives.grossRetailWithVehicleRegistrationTax = grossRetailWithVehicleRegistrationTaxTotalPriceWithoutIncentives;
    });
  },
});

function getValueForSpecifiedType(array = [], specifiedType = '') {
  const filteredArray = array.filter(({ type }) => type === specifiedType);
  return filteredArray[0]?.value ?? null;
}

export const { reducer } = slice;
