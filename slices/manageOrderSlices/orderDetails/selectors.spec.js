import * as selectors from './selectors';
import initialState from './initialState';

const state = {
  manageOrderData: {
    ...initialState,
  },
};

describe('OrderManageData selectors', () => {
  describe('getIsLoading', () => {
    it('returns initial value of isLoading', () => {
      const expectedValue = state.manageOrderData.isLoading;
      const selectedValue = selectors.getIsLoading(state);

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of isLoading', () => {
      const currentState = {
        ...state,
        manageOrderData: {
          isLoading: true,
        },
      };
      const expectedValue = currentState.manageOrderData.isLoading;
      const selectedValue = selectors.getIsLoading(currentState);

      expect(selectedValue).toEqual(expectedValue);
    });
  });

  describe('getHasSucceeded', () => {
    it('returns initial value of hasSucceeded', () => {
      const expectedValue = state.manageOrderData.hasSucceeded;
      const selectedValue = selectors.getHasSucceeded(state);

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of hasSucceeded', () => {
      const currentState = {
        ...state,
        manageOrderData: {
          hasSucceeded: true,
        },
      };
      const expectedValue = currentState.manageOrderData.hasSucceeded;
      const selectedValue = selectors.getHasSucceeded(currentState);

      expect(selectedValue).toEqual(expectedValue);
    });
  });

  describe('getHasSucceededWithValidData', () => {
    it('returns initial value of hasSucceededWithValidData', () => {
      const expectedValue = state.manageOrderData.hasSucceededWithValidData;
      const selectedValue = selectors.getHasSucceededWithValidData(state);

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of hasSucceededWithValidData', () => {
      const currentState = {
        ...state,
        manageOrderData: {
          hasSucceededWithValidData: true,
        },
      };
      const expectedValue =
        currentState.manageOrderData.hasSucceededWithValidData;
      const selectedValue = selectors.getHasSucceededWithValidData(
        currentState
      );

      expect(selectedValue).toEqual(expectedValue);
    });
  });

  describe('getHasFailed', () => {
    it('returns initial value of hasFailed', () => {
      const expectedValue = state.manageOrderData.hasFailed;
      const selectedValue = selectors.getHasFailed(state);

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of hasFailed', () => {
      const currentState = {
        ...state,
        manageOrderData: {
          hasFailed: true,
        },
      };
      const expectedValue = currentState.manageOrderData.hasFailed;
      const selectedValue = selectors.getHasFailed(currentState);

      expect(selectedValue).toEqual(expectedValue);
    });
  });

  describe('orderManage data custom selectors', () => {
    const localState = {
      manageOrderData: {
        isLoading: false,
        hasSucceeded: false,
        hasSucceededWithValidData: false,
        hasFailed: false,
        data: {
          accessoryData: {},
          alternativeLenderSelection: false,
          cartCheckoutCompleted: true,
          channel: 'WEB',
          chargingData: {},
          code: 'sit-10895021',
          created: '2021-12-13T17:23:53+0000',
          deliveryData: {},
          entries: [
            {
              financeData: {
                blackOutPeriod: false,
                quote: {
                  amountPayableLessGmfv: 13873,
                },
              },
            },
          ],
          isInvalidColor: false,
          isVehicleConfigChange: false,
          offersAndIncentivesData: {},
          offlinePriceChanges: {},
          orderConfirmedDate: '2021-12-13T17:23:53+0000',
          orderType: 'order',
          paymentThreshold: '500.0',
          protectionPlansData: {},
          purchaseData: {},
          readyToPurchase: false,
          reservationDate: '2021-12-13T17:23:53.640Z',
          status: 'CREATED',
          statusDisplay: 'created',
          totalPrice: {},
          user: {},
        },
      },
    };
    it('getManageOrderData returns manageOrder data', () => {
      const expectedState = {
        isLoading: false,
        hasSucceeded: false,
        hasSucceededWithValidData: false,
        hasFailed: false,
        data: {
          accessoryData: {},
          alternativeLenderSelection: false,
          cartCheckoutCompleted: true,
          channel: 'WEB',
          chargingData: {},
          code: 'sit-10895021',
          created: '2021-12-13T17:23:53+0000',
          deliveryData: {},
          entries: [
            {
              financeData: {
                blackOutPeriod: false,
                quote: {
                  amountPayableLessGmfv: 13873,
                },
              },
            },
          ],
          isInvalidColor: false,
          isVehicleConfigChange: false,
          offersAndIncentivesData: {},
          offlinePriceChanges: {},
          orderConfirmedDate: '2021-12-13T17:23:53+0000',
          orderType: 'order',
          paymentThreshold: '500.0',
          protectionPlansData: {},
          purchaseData: {},
          readyToPurchase: false,
          reservationDate: '2021-12-13T17:23:53.640Z',
          status: 'CREATED',
          statusDisplay: 'created',
          totalPrice: {},
          user: {},
        },
      };
      const selector = selectors.getManageOrderData(localState);
      expect(selector).toEqual(expectedState);
    });
    it('getManageOrderData returns empty object with no data or wrong data', () => {
      const failedState = [];
      const selector = selectors.getManageOrderData(failedState);
      expect(selector).toEqual({});
    });
    it('getFinancialData returns finance data object', () => {
      const expectedState = {
        blackOutPeriod: false,
        quote: {
          amountPayableLessGmfv: 13873,
        },
      };
      const selector = selectors.getFinancialData(localState);
      expect(selector).toEqual(expectedState);
    });
    it('getFinancialData returns empty array when no data', () => {
      const failedState = {};
      const selector = selectors.getFinancialData(failedState);
      expect(selector).toEqual([]);
    });
    it('getFinancialQuote returns quote data object', () => {
      const expectedState = {
        amountPayableLessGmfv: 13873,
      };
      const selector = selectors.getFinancialQuote(localState);
      expect(selector).toEqual(expectedState);
    });
    it('getFinancialQuote returns empty object when no correct data', () => {
      const failedState = [];
      const selector = selectors.getFinancialQuote(failedState);
      expect(selector).toEqual({});
    });
  });
});
