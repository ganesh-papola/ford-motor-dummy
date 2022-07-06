import * as selectors from './selectors';

describe('Detailed Price Summary selectors', () => {
  describe('getTotalVehiclePriceWithSavings', () => {
    it('returns current value of getTotalVehiclePriceWithSavings', () => {
      const expectedValue = 98765.43;
      const state = {
        detailedPriceSummary: {
          dealerizedPrice: {
            totalVehiclePriceWithSavings: expectedValue,
          },
        },
      };
      const selectedValue = selectors.getTotalVehiclePriceWithSavings(state);

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns null when parent is undefined', () => {
      const state = {};
      const selectedValue = selectors.getTotalVehiclePriceWithSavings(state);

      expect(selectedValue).toEqual(null);
    });
  });

  describe('Get Total Vehicle Price With Savings', () => {
    it('returns current value of getGrossRetailWithVehicleRegistrationTax', () => {
      const expectedValue = 98765.43;
      const state = {
        detailedPriceSummary: {
          nonDealerizedPrice: {
            totalPriceWithoutIncentives: {
              grossRetailWithVehicleRegistrationTax: expectedValue,
            },
          },
        },
      };
      const selectedValue = selectors.getGrossRetailWithVehicleRegistrationTax(
        state
      );
      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns 0 when parent is undefined', () => {
      const state = {};
      const selectedValue = selectors.getGrossRetailWithVehicleRegistrationTax(
        state
      );

      expect(selectedValue).toEqual(null);
    });
  });

  describe('Get Total Vehicle Price With Savings (Base Price)', () => {
    it('returns current value of getGrossRetailWithVehicleRegistrationTaxBasePrice', () => {
      const expectedValue = 98765.43;
      const state = {
        detailedPriceSummary: {
          nonDealerizedPrice: {
            basePrice: {
              grossRetailWithVehicleRegistrationTax: expectedValue,
            },
          },
        },
      };
      const selectedValue = selectors.getGrossRetailWithVehicleRegistrationTaxBasePrice(
        state
      );
      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns 0 when parent is undefined', () => {
      const state = {};
      const selectedValue = selectors.getGrossRetailWithVehicleRegistrationTaxBasePrice(
        state
      );

      expect(selectedValue).toEqual(null);
    });
  });
});
