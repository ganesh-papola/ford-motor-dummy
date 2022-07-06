import { reducer } from './slice';
import { actions } from './slice';
import { initialState } from './slice';

describe('fma reducers', () => {
  it('should load initialState', () => {
    expect(reducer(initialState, {})).toMatchSnapshot();
  });

  describe('fmaIsAuthenticated', () => {
    it('should set isAuthenticated to payload', () => {
      const state = reducer(
        initialState,
        actions.authenticationStateChanged(true)
      );
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('paymentPlanFail', () => {
    it('should set overrideFmaRequired to payload', () => {
      const state = reducer(initialState, actions.setOverrideFmaRequired(true));
      expect(state.overrideFmaRequired).toBe(true);
    });
  });
});
