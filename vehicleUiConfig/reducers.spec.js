import reducers from './reducers';
import * as actions from './actions';
import initialState from './initialState';
import ICE_MICRO_MOCK from './mockState';
import { PLAN_CODES } from '@Constants/calculator';

/**
 * @typedef {import('./initialState').VehicleUiConfig} VehicleUiConfig
 */

const cashVehicleUiConfig = {
  planCode: PLAN_CODES.CASH,
  category: 'cash',
  customerType: 'retail',
  options: {
    showIncentives: false,
    showTradeIn: true,
    showProtectionPlans: true,
    showTaxesAndFees: true,
    accessoryThreshold: 3500,
  },
};

/** @type {VehicleUiConfig}  */
const mockThunkResult = {
  ...ICE_MICRO_MOCK,
};

mockThunkResult.paymentMethods = mockThunkResult.paymentMethods.filter(
  (method) => method.planCode !== PLAN_CODES.CASH
);

mockThunkResult.paymentMethods.push(cashVehicleUiConfig);

describe('vehicle ui config reducers', () => {
  it('should set is loading true on try', () => {
    const state = reducers(initialState, actions.tryGetVehicleUiConfig());
    expect(state.isLoading).toBe(true);
  });

  it('should set is loading false on failure', () => {
    const state = reducers(initialState, actions.getVehicleUiConfigFailure());
    expect(state.isLoading).toBe(false);
  });

  it('should set response on success with non-empty response', () => {
    const state = reducers(
      initialState,
      actions.getVehicleUiConfigSuccess({
        ...mockThunkResult,
      })
    );
    expect(
      state.paymentMethods.find((method) => method.planCode === PLAN_CODES.CASH)
    ).toEqual(cashVehicleUiConfig);
  });

  it('should not set response on success with empty response', () => {
    const state = reducers(
      initialState,
      actions.getVehicleUiConfigSuccess(undefined)
    );
    expect(state).toBe(initialState);
  });
});
