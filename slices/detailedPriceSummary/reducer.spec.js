import initialState from './initialState';
import { reducer } from './slice';
import * as sapTypes from '@Ducks/sap/types';

describe('detailedPricingSummary', () => {
  it('should return initial state', () => {
    expect(reducer(initialState, { type: 'nothing' })).toMatchInlineSnapshot(`
      Object {
        "dealerizedPrice": Object {
          "totalVehiclePriceWithSavings": null,
        },
        "nonDealerizedPrice": Object {
          "basePrice": Object {
            "grossRetailWithVehicleRegistrationTax": null,
          },
          "totalPriceWithoutIncentives": Object {
            "grossRetailWithVehicleRegistrationTax": null,
          },
        },
      }
    `);
  });

  describe('successful reservation details request', () => {
    it('should set detailedPriceSummary values to corresponding value from response', () => {
      const payload = {
        data: {
          entries: [
            {
              detailedPriceSummary: {
                dealerizedPrice: {
                  totalVehiclePriceWithSavings: 1234.56,
                },
                nonDealerizedPrice: {
                  totalPriceWithoutIncentives: {
                    grossRetailWithVehicleRegistrationTax: 1234.56,
                  },
                },
              },
            },
          ],
        },
      };
      const newState = reducer(initialState, {
        type: sapTypes.FETCH_RESERVATION_DETAILS_SUCCESS,
        payload,
      });

      expect(newState).toMatchInlineSnapshot(`
        Object {
          "dealerizedPrice": Object {
            "totalVehiclePriceWithSavings": 1234.56,
          },
          "nonDealerizedPrice": Object {
            "basePrice": Object {
              "grossRetailWithVehicleRegistrationTax": null,
            },
            "totalPriceWithoutIncentives": Object {
              "grossRetailWithVehicleRegistrationTax": 1234.56,
            },
          },
        }
      `);
    });

    it('should set values to null when response does not contain corresponding value', () => {
      const payload = {
        data: {
          entries: [
            {
              detailedPriceSummary: {},
            },
          ],
        },
      };
      const newState = reducer(initialState, {
        type: sapTypes.FETCH_RESERVATION_DETAILS_SUCCESS,
        payload,
      });

      expect(newState).toMatchInlineSnapshot(`
        Object {
          "dealerizedPrice": Object {
            "totalVehiclePriceWithSavings": null,
          },
          "nonDealerizedPrice": Object {
            "basePrice": Object {
              "grossRetailWithVehicleRegistrationTax": null,
            },
            "totalPriceWithoutIncentives": Object {
              "grossRetailWithVehicleRegistrationTax": null,
            },
          },
        }
      `);
    });
  });

  describe('successful getCart request', () => {
    it('should set detailedPriceSummary values to corresponding value from response', () => {
      const payload = {
        entries: [
          {
            detailedPriceSummary: {
              dealerizedPrice: {
                totalVehiclePriceWithSavings: 1234.56,
              },
              nonDealerizedPrice: {
                basePrice: {
                  prices: [
                    {
                      type: 'grossRetailWithVehicleRegistrationTax',
                      value: 3456.78,
                    },
                  ],
                },
                totalPriceWithoutIncentives: {
                  prices: [
                    {
                      type: 'grossRetailWithVehicleRegistrationTax',
                      value: 8316.67,
                    },
                  ],
                },
              },
            },
          },
        ],
      };
      const newState = reducer(initialState, {
        type: sapTypes.GET_CART_SUCCESS,
        payload,
      });

      expect(newState).toMatchInlineSnapshot(`
        Object {
          "dealerizedPrice": Object {
            "totalVehiclePriceWithSavings": 1234.56,
          },
          "nonDealerizedPrice": Object {
            "basePrice": Object {
              "grossRetailWithVehicleRegistrationTax": 3456.78,
            },
            "totalPriceWithoutIncentives": Object {
              "grossRetailWithVehicleRegistrationTax": 8316.67,
            },
          },
        }
      `);
    });

    it('should set values to null when response does not contain corresponding value', () => {
      const payload = {
        entries: [
          {
            detailedPriceSummary: {},
          },
        ],
      };
      const newState = reducer(initialState, {
        type: sapTypes.GET_CART_SUCCESS,
        payload,
      });

      expect(newState).toMatchInlineSnapshot(`
        Object {
          "dealerizedPrice": Object {
            "totalVehiclePriceWithSavings": null,
          },
          "nonDealerizedPrice": Object {
            "basePrice": Object {
              "grossRetailWithVehicleRegistrationTax": null,
            },
            "totalPriceWithoutIncentives": Object {
              "grossRetailWithVehicleRegistrationTax": null,
            },
          },
        }
      `);
    });
  });
});
