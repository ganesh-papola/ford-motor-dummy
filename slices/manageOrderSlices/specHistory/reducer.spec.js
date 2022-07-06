import { actions, reducer } from './slice';
import { fetchAmendSpecHistory } from '@Slices/manageOrderSlices/specHistory/thunk';
import initialState from './initialState';

describe('amend spec history reducer', () => {
  it('should return initialState', () => {
    expect(reducer(initialState, { type: 'nothing' })).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "specHistory": Array [
            Object {
              "amendmentDate": "2021-07-07T18:25:52+0000",
              "deliveryDate": "2021-10-07T18:25:52+0000",
              "isPriceChanged": "true / false",
              "wersCodes": Array [
                Object {
                  "family": Object {
                    "code": "#T#",
                  },
                  "values": Array [
                    Object {
                      "code": "11LP8",
                      "description": "BLACK PERFORATED SENSICO",
                      "guxCategories": Array [
                        "trim",
                      ],
                      "guxCategoryDescription": "Trims",
                      "guxCategoryLabels": "trim",
                    },
                  ],
                },
              ],
            },
          ],
        },
        "hasFailed": false,
        "hasSucceeded": false,
        "hasSucceededWithValidData": false,
        "isLoading": false,
      }
    `);
  });

  it('should return pending state', () => {
    const expectedState = {
      isLoading: true,
      hasFailed: false,
      hasSucceeded: false,
      hasSucceededWithValidData: false,
      data: {
        specHistory: [
          {
            amendmentDate: '2021-07-07T18:25:52+0000',
            deliveryDate: '2021-10-07T18:25:52+0000',
            isPriceChanged: 'true / false',
            wersCodes: [
              {
                family: {
                  code: '#T#',
                },
                values: [
                  {
                    code: '11LP8',
                    description: 'BLACK PERFORATED SENSICO',
                    guxCategoryLabels: 'trim',
                    guxCategoryDescription: 'Trims',
                    guxCategories: ['trim'],
                  },
                ],
              },
            ],
          },
        ],
      },
    };
    const state = reducer(initialState, fetchAmendSpecHistory.pending);
    expect(state).toEqual(expectedState);
  });

  it('should return rejected state', () => {
    const expectedState = {
      isLoading: false,
      hasFailed: true,
      hasSucceeded: false,
      hasSucceededWithValidData: false,
      data: {
        specHistory: [
          {
            amendmentDate: '2021-07-07T18:25:52+0000',
            deliveryDate: '2021-10-07T18:25:52+0000',
            isPriceChanged: 'true / false',
            wersCodes: [
              {
                family: {
                  code: '#T#',
                },
                values: [
                  {
                    code: '11LP8',
                    description: 'BLACK PERFORATED SENSICO',
                    guxCategoryLabels: 'trim',
                    guxCategoryDescription: 'Trims',
                    guxCategories: ['trim'],
                  },
                ],
              },
            ],
          },
        ],
      },
    };
    const state = reducer(initialState, fetchAmendSpecHistory.rejected);
    expect(state).toEqual(expectedState);
  });

  it('should return success state', () => {
    const expectedState = {
      isLoading: false,
      hasFailed: false,
      hasSucceeded: true,
      hasSucceededWithValidData: true,
    };
    const state = reducer(initialState, fetchAmendSpecHistory.fulfilled);
    expect(state).toEqual(expectedState);
  });

  it('should reset back to initial state', () => {
    const state = reducer(initialState, actions.reset);
    expect(state).toEqual(initialState);
  });
});
