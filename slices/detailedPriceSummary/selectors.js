export function getTotalVehiclePriceWithSavings(state) {
  return (
    state?.detailedPriceSummary?.dealerizedPrice
      ?.totalVehiclePriceWithSavings ?? null
  );
}

export function getGrossRetailWithVehicleRegistrationTax(state) {
  return (
    state?.detailedPriceSummary?.nonDealerizedPrice?.totalPriceWithoutIncentives
      ?.grossRetailWithVehicleRegistrationTax ?? null
  );
}

export function getGrossRetailWithVehicleRegistrationTaxBasePrice(state) {
  return (
    state?.detailedPriceSummary?.nonDealerizedPrice?.basePrice
      ?.grossRetailWithVehicleRegistrationTax ?? null
  );
}
