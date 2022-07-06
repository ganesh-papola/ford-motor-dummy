import * as selectors from './selectors';
import initialState from './initialState';

describe('reservationMisc selectors', () => {
  describe('getFinalPayment', () => {
    it('returns initial state value of finalPayment', () => {
      const expectedValue = initialState.finalPayment;
      const selectedValue = selectors.getFinalPayment({
        reservationMisc: { ...initialState },
      });

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of finalPayment', () => {
      const expectedValue = 2123.67;
      const state = { reservationMisc: { finalPayment: expectedValue } };
      const selectedValue = selectors.getFinalPayment(state);

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns 0 when node or parent node is undefined', () => {
      const stateWithoutParent = {};
      const stateWithoutNode = { reservationMisc: {} };

      expect(selectors.getFinalPayment(stateWithoutParent)).toEqual(null);
      expect(selectors.getFinalPayment(stateWithoutNode)).toEqual(null);
    });
  });
});
