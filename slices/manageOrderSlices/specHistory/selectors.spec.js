import * as selectors from './selectors';
import initialState from './initialState';

describe('specAdmen selectors', () => {
  describe('getIsLoading', () => {
    it('returns intial value of loading', () => {
      const expectedValue = initialState.isLoading;
      const selectedValue = selectors.getAmendSpecIsLoading(initialState);

      expect(selectedValue).toEqual(expectedValue);
    });
    it('returns current value of isLoading', () => {
      const currentState = { ...initialState, isLoading: true };
      const expectedValue = currentState.isLoading;
      const selectedValue = selectors.getAmendSpecIsLoading(currentState);

      expect(selectedValue).toEqual(expectedValue);
    });
  });

  describe('getHasSucceeded', () => {
    it('returns initial value of hasSucceeded', () => {
      const expectedValue = initialState.hasSucceeded;
      const selectedValue = selectors.getAmendSpecHasSucceeded(initialState);

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of hasSucceeded', () => {
      const currentState = { ...initialState, hasSucceeded: true };
      const expectedValue = currentState.hasSucceeded;
      const selectedValue = selectors.getAmendSpecHasSucceeded(currentState);

      expect(selectedValue).toEqual(expectedValue);
    });
  });

  describe('getHasSucceededWithValidData', () => {
    it('returns initial value of hasSucceededWithValidData', () => {
      const expectedValue = initialState.hasSucceededWithValidData;
      const selectedValue = selectors.getAmendSpecHasSucceededWithValidData(
        initialState
      );

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of hasSucceededWithValidData', () => {
      const currentState = { ...initialState, hasSucceededWithValidData: true };
      const expectedValue = currentState.hasSucceededWithValidData;
      const selectedValue = selectors.getAmendSpecHasSucceededWithValidData(
        currentState
      );

      expect(selectedValue).toEqual(expectedValue);
    });
  });

  describe('getHasFailed', () => {
    it('returns initial value of hasFailed', () => {
      const expectedValue = initialState.hasFailed;
      const selectedValue = selectors.getAmendSpecHasFailed(initialState);

      expect(selectedValue).toEqual(expectedValue);
    });

    it('returns current value of hasFailed', () => {
      const currentState = { ...initialState, hasFailed: true };
      const expectedValue = currentState.hasFailed;
      const selectedValue = selectors.getAmendSpecHasFailed(currentState);

      expect(selectedValue).toEqual(expectedValue);
    });
  });

  describe('getAmendHistoryData', () => {
    const expectedState = {
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
    };

    it('returns initial state', () => {
      const selectedValue = expectedState;
      expect(selectedValue).toEqual(initialState?.data);
    });
    it('returns empty array if no data', () => {
      const expectedState = {};
      const selectedValue = selectors.getAmendHistoryData(expectedState);
      expect(selectedValue).toEqual([]);
    });
  });

  describe('getFormatAmendHistoryData', () => {
    const expectedState = {
      orderAmendments: [
        {
          amendmentDate: '2021-07-07T18:25:52+0000',
          wersCodes: {
            '#T#': {
              label: '',
              value: 'BLACK PERFORATED SENSICO',
            },
          },
        },
      ],
    };

    const localState = {
      isLoading: false,
      hasSucceeded: false,
      hasSucceededWithValidData: false,
      hasFailed: false,
      amendSpecHistory: {
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
                      guxCategories: [
                        {
                          trim: '',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    it('returns initial state', () => {
      const selectedState = selectors.getFormattedOrderAmendments(localState);
      expect(expectedState).toEqual(selectedState);
    });
  });
});
