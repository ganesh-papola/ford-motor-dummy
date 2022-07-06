import initialState from './initialState';
import { reducer } from './slice';
import * as sapTypes from '@Ducks/sap/types';

describe('reservationMisc reducer', () => {
  it('should return initial state', () => {
    expect(reducer(initialState, { type: 'nothing' })).toMatchInlineSnapshot(`
      Object {
        "finalPayment": null,
      }
    `);
  });

  describe('successful reservation details response', () => {
    it('should set finalPayment to the corresponding value from response', () => {
      const payload = {
        data: {
          finalPayment: 1123.58,
        },
      };
      const newState = reducer(initialState, {
        type: sapTypes.FETCH_RESERVATION_DETAILS_SUCCESS,
        payload,
      });

      expect(newState).toMatchInlineSnapshot(`
        Object {
          "finalPayment": 1123.58,
        }
      `);
    });

    it('should set finalPayment to 0 when the response does not contain corresponding value', () => {
      const payload = {
        data: {},
      };
      const newState = reducer(initialState, {
        type: sapTypes.FETCH_RESERVATION_DETAILS_SUCCESS,
        payload,
      });

      expect(newState).toMatchInlineSnapshot(`
        Object {
          "finalPayment": null,
        }
      `);
    });
  });
});
