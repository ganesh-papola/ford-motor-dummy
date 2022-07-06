import * as selectors from './selectors';
import initialState from './initialState';

describe('Reservation selectors', () => {
  describe('getIsLoading', () => {
    it('returns initial value of isLoading', () => {
      const expectedValue = initialState.isLoading;
      const selectedValue = selectors.getIsLoading(initialState);

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of isLoading', () => {
      const currentState = { ...initialState, isLoading: true };
      const expectedValue = currentState.isLoading;
      const selectedValue = selectors.getIsLoading(currentState);

      expect(selectedValue).toEqual(expectedValue);
    });
  });

  describe('getHasSucceeded', () => {
    it('returns initial value of hasSucceeded', () => {
      const expectedValue = initialState.hasSucceeded;
      const selectedValue = selectors.getHasSucceeded(initialState);

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of hasSucceeded', () => {
      const currentState = { ...initialState, hasSucceeded: true };
      const expectedValue = currentState.hasSucceeded;
      const selectedValue = selectors.getHasSucceeded(currentState);

      expect(selectedValue).toEqual(expectedValue);
    });
  });

  describe('getHasSucceededWithValidData', () => {
    it('returns initial value of hasSucceededWithValidData', () => {
      const expectedValue = initialState.hasSucceededWithValidData;
      const selectedValue = selectors.getHasSucceededWithValidData(
        initialState
      );

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of hasSucceededWithValidData', () => {
      const currentState = { ...initialState, hasSucceededWithValidData: true };
      const expectedValue = currentState.hasSucceededWithValidData;
      const selectedValue = selectors.getHasSucceededWithValidData(
        currentState
      );

      expect(selectedValue).toEqual(expectedValue);
    });
  });

  describe('getHasFailed', () => {
    it('returns initial value of hasFailed', () => {
      const expectedValue = initialState.hasFailed;
      const selectedValue = selectors.getHasFailed(initialState);

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of hasFailed', () => {
      const currentState = { ...initialState, hasFailed: true };
      const expectedValue = currentState.hasFailed;
      const selectedValue = selectors.getHasFailed(currentState);

      expect(selectedValue).toEqual(expectedValue);
    });
  });
});
