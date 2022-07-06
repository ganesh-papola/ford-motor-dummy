import * as actions from './actions';
import VehicleUiConfigService from '@Services/vehicleUiConfigService/VehicleUiConfigService';
import {
  getFuelType,
  getMarketingNameplate,
  getSeriesCode,
} from '@Ducks/vehicleData/selectors';

/**
 * Fetches the vehicle ui config for the current cart
 * TODO: this is incorrect use of `params`. Our param is an object
 * - Kyle Hooks 6/24/2021
 * @param useMock
 * @param mockData
 */
export const getVehicleUiConfig = ({ useMock = false, mockData = {} } = {}) => {
  return (dispatch, getState) => {
    if (useMock) {
      dispatch(actions.getVehicleUiConfigSuccess(mockData));
    } else {
      const state = getState();
      return VehicleUiConfigService.getVehicleUiConfig({
        vehicleLine: getMarketingNameplate(state),
        fuelType: getFuelType(state),
        wersCode: getSeriesCode(state),
      })
        .then((data) => {
          dispatch(actions.getVehicleUiConfigSuccess(data));
        })
        .catch(() => {
          dispatch(actions.getVehicleUiConfigFailure());
        });
    }
  };
};
