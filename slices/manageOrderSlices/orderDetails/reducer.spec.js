import { actions, reducer } from './slice';
import { fetchManageOrderDetails } from './thunks';
import initialState from './initialState';

describe('orderManageData reducer', () => {
  it('should return initialState', () => {
    expect(reducer(initialState, { type: 'nothing' })).toMatchInlineSnapshot(
      `
      Object {
        "data": Object {
          "accessoryData": Object {},
          "alternativeLenderSelection": false,
          "cartCheckoutCompleted": true,
          "channel": "WEB",
          "chargingData": Object {},
          "code": "sit-10895021",
          "created": "2021-12-13T17:23:53+0000",
          "deliveryData": Object {},
          "entries": Array [
            Object {
              "financeData": Object {
                "blackOutPeriod": false,
                "quote": Object {
                  "amountPayableLessGmfv": 13873,
                },
              },
            },
          ],
          "isInvalidColor": false,
          "isVehicleConfigChange": false,
          "offersAndIncentivesData": Object {},
          "offlinePriceChanges": Object {},
          "orderConfirmedDate": "2021-12-13T17:23:53+0000",
          "orderType": "order",
          "paymentThreshold": "500.0",
          "protectionPlansData": Object {},
          "purchaseData": Object {},
          "readyToPurchase": false,
          "reservationDate": "2021-12-13T17:23:53.640Z",
          "status": "CREATED",
          "statusDisplay": "created",
          "totalPrice": Object {},
          "user": Object {},
        },
        "hasFailed": false,
        "hasSucceeded": false,
        "hasSucceededWithValidData": false,
        "isLoading": false,
      }
    `
    );
  });

  it('should return pending state', () => {
    const expectedState = {
      isLoading: true,
      hasFailed: false,
      hasSucceeded: false,
      hasSucceededWithValidData: false,
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
    const state = reducer(initialState, fetchManageOrderDetails.pending);
    expect(state).toEqual(expectedState);
  });

  it('should return rejected state', () => {
    const expectedState = {
      isLoading: false,
      hasFailed: true,
      hasSucceeded: false,
      hasSucceededWithValidData: false,
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
    const state = reducer(initialState, fetchManageOrderDetails.rejected);
    expect(state).toEqual(expectedState);
  });

  it('should return success state', () => {
    const expectedState = {
      isLoading: false,
      hasFailed: false,
      hasSucceeded: true,
      hasSucceededWithValidData: true,
    };
    const state = reducer(initialState, fetchManageOrderDetails.fulfilled);
    expect(state).toEqual(expectedState);
  });

  it('should reset back to initial state', () => {
    const state = reducer(initialState, actions.reset);
    expect(state).toEqual(initialState);
  });
});
