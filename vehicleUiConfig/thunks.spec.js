import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as thunks from './thunks';
import axios from 'axios';

jest.mock('axios');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Vehicle UI config Thunks', () => {
  describe('getVehicleUiConfig', () => {
    it('returns GET_VEHICLE_UI_CONFIG_SUCCESS when call succeeds', async () => {
      axios.post.mockResolvedValue({ data: {}, status: 200 });

      const expectedActions = ['GET_VEHICLE_UI_CONFIG_SUCCESS'];
      const store = mockStore({});
      const requestParms = { useMock: false, mockData: {} };

      return store
        .dispatch(thunks.getVehicleUiConfig(requestParms))
        .then(() => {
          const actions = store.getActions();
          const actionTypes = actions.map((ac) => ac.type);
          expect(actionTypes).toEqual(expectedActions);
        });
    });

    it('returns GET_VEHICLE_UI_CONFIG_FAILURE when call fails', async () => {
      axios.post.mockRejectedValue();
      const expectedActions = ['GET_VEHICLE_UI_CONFIG_FAILURE'];
      const store = mockStore({});

      return store.dispatch(thunks.getVehicleUiConfig({})).catch(() => {
        const actions = store.getActions();
        const actionTypes = actions.map((ac) => ac.type);
        expect(actionTypes).toEqual(expectedActions);
      });
    });
  });
});
