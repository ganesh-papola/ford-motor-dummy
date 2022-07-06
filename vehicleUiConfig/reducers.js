import * as types from './types';
import produce from 'immer';

/**
 * @typedef {import('@Ducks/vehicleUiConfig/initialState').VehicleUiConfig} VehicleUiConfig
 */

/**
 * @typedef {import('@Ducks/vehicleUiConfig/actions').VehicleUiConfigAction} VehicleUiConfigAction
 */

const reducers = (state = {}, action) =>
  produce(state, (/** @type {VehicleUiConfig} */ draft) => {
    switch (action?.type) {
      case types.TRY_GET_VEHICLE_UI_CONFIG: {
        draft.isLoading = true;
        draft.hasLoadedSuccessfully = false;
        break;
      }

      case types.GET_VEHICLE_UI_CONFIG_FAILURE: {
        draft.isLoading = false;
        draft.hasLoadedSuccessfully = false;
        break;
      }

      case types.GET_VEHICLE_UI_CONFIG_SUCCESS: {
        /** @type {VehicleUiConfigAction} */
        if (!action?.payload) return draft;
        /*
        const typedAction = action;
        if (
          !typedAction?.payload?.retail ||
          !typedAction?.payload?.business ||
          !typedAction?.payload?.paymentMethods
        ) {
          return draft;
        }
        */
        draft.retail = { ...action?.payload?.retail };
        draft.business = { ...action?.payload?.business };
        draft.paymentMethods = [...action?.payload?.paymentMethods];
        draft.isLoading = false;
        draft.hasLoadedSuccessfully = true;

        break;
      }

      default:
        return draft;
    }
  });

export default reducers;
