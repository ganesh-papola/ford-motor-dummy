import { actions, reducer } from './slice';
import { fetchReservationDetails } from './thunks';
import initialState from './initialState';

describe('reservation reducer', () => {
  it('should return initialState', () => {
    expect(reducer(initialState, { type: 'nothing' })).toMatchInlineSnapshot(
      `
      Object {
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
    };
    const state = reducer(initialState, fetchReservationDetails.pending);
    expect(state).toEqual(expectedState);
  });

  it('should return rejected state', () => {
    const expectedState = {
      isLoading: false,
      hasFailed: true,
      hasSucceeded: false,
      hasSucceededWithValidData: false,
    };
    const state = reducer(initialState, fetchReservationDetails.rejected);
    expect(state).toEqual(expectedState);
  });

  it('should return success state', () => {
    const expectedState = {
      isLoading: false,
      hasFailed: false,
      hasSucceeded: true,
      hasSucceededWithValidData: true,
    };
    const state = reducer(initialState, fetchReservationDetails.fulfilled);
    expect(state).toEqual(expectedState);
  });

  it('should reset back to initial state', () => {
    const state = reducer(initialState, actions.reset);
    expect(state).toEqual(initialState);
  });
});
