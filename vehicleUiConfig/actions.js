import * as types from './types';

/**
 * @typedef {import('@Ducks/vehicleUiConfig/initialState').VehicleUiConfig} VehicleUiConfig
 */

/**
 * @typedef {object} VehicleUiConfigAction
 * @property {VehicleUiConfig} payload
 * @property {string} type
 */

/**
 * @typedef {object} VehicleUiConfigEmptyAction
 * @property {(undefined)} payload
 * @property {string} type
 */

/**
 * @param {VehicleUiConfig} payload - The new config.
 * @returns {VehicleUiConfigAction} The redux action.
 */
export const getVehicleUiConfigSuccess = (payload) => ({
  type: types.GET_VEHICLE_UI_CONFIG_SUCCESS,
  payload,
});

/**
 * @param {(undefined)} [payload] - An empty payload
 * @returns {VehicleUiConfigEmptyAction} The redux action.
 */
export const getVehicleUiConfigFailure = (payload) => ({
  type: types.GET_VEHICLE_UI_CONFIG_FAILURE,
  payload,
});

/**
 * @param {(undefined)} [payload] - An empty payload
 * @returns {VehicleUiConfigEmptyAction} The redux action.
 */
export const tryGetVehicleUiConfig = (payload) => ({
  type: types.TRY_GET_VEHICLE_UI_CONFIG,
  payload,
});
