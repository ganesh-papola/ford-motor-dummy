import { getFinancePlanDefaultToCash } from '@Ducks/calculator/selectors';
import { getUserCustomerType } from '@Ducks/userData/selectors';
import { getSelectedFinancialPlanCodeDefaultToCash } from '@Ducks/ngc/selectors';

/**
 * @typedef {import('./initialState').VehicleUiConfig} VehicleUiConfig
 */

/**
 * @typedef {import('./initialState').VehicleUiConfigSharedOptions} VehicleUiConfigSharedOptions
 */

/**
 * @typedef {import('./initialState').VehicleUiConfigPaymentMethod} VehicleUiConfigPaymentMethod
 */

/**
 * @typedef ReduxStateForVehicleUiConfig
 * @property {VehicleUiConfig} vehicleUiConfig
 */

/**
 * Gets the vehicle ui configuration from the redux store.
 * @param {ReduxStateForVehicleUiConfig} state The redux state.
 * @returns {VehicleUiConfig} The vehicle ui configuation.
 */
export const getVehicleUiConfig = (state) => state.vehicleUiConfig;

/**
 * Gets the vehicle ui configuration from the redux store for the current customer type.
 * @param {ReduxStateForVehicleUiConfig} state The redux state.
 * @returns {VehicleUiConfigSharedOptions} The vehicle ui configuation.
 */
export const getVehicleUiConfigForSelectedCustomerType = (state) =>
  getVehicleUiConfig(state)[getUserCustomerType(state)] || {};

/**
 * Gets the vehicle ui configuration payment methods.
 * @param {ReduxStateForVehicleUiConfig} state The redux state.
 * @returns {Array.<VehicleUiConfigPaymentMethod>} The vehicle ui configuation.
 */
export const getVehicleUiConfigPaymentMethods = (state) =>
  getVehicleUiConfig(state)?.paymentMethods || [];

/**
 * Gets the available payment method codes.
 * @param {ReduxStateForVehicleUiConfig} state The redux state.
 * @returns {Array.<string>} The available payment method codes.
 */
export const getAvailablePaymentMethods = (state) =>
  // plan code keys in vehicle UI config that are
  // valid plan code (ignoring isLoading, global suppress
  // values, etc.)
  getVehicleUiConfigPaymentMethods(state).map(
    (paymentMethod) => paymentMethod.planCode
  );

/**
 * Returns the loading state for the vehicle ui config.
 * @param {ReduxStateForVehicleUiConfig} state The redux state.
 * @returns {boolean} Whether or not the vehicle ui config fetch call is loading.
 */
export const getIsLoading = (state) => getVehicleUiConfig(state).isLoading;

/**
 * Returns true if the load was successful in vehicle ui config
 * @param {ReduxStateForVehicleUiConfig} state The redux state.
 * @returns {boolean} Whether or not the vehicle ui config loaded successfully
 */
export const getHasLoadedSuccessfully = (state) =>
  getVehicleUiConfig(state).hasLoadedSuccessfully;

/**
 * Returns the default value (customer-type level property).
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowChargingDefault = (state) =>
  getUiConfigValue(
    getVehicleUiConfigForSelectedCustomerType(state).showCharging
  );

/**
 * Returns the default value (customer-type level property).
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowIncentivesDefault = (state) =>
  getUiConfigValue(
    getVehicleUiConfigForSelectedCustomerType(state).showIncentives
  );

/**
 * Returns the default value (customer-type level property).
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowTradeInDefault = (state) =>
  getUiConfigValue(
    getVehicleUiConfigForSelectedCustomerType(state).showTradeIn
  );

/**
 * Returns the default value (customer-type level property).
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowAccessoriesDefault = (state) =>
  getUiConfigValue(
    getVehicleUiConfigForSelectedCustomerType(state).showAccessories
  );

/**
 * Returns the default value (customer-type level property).
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowDeliveryMethodDefault = (state) =>
  getUiConfigValue(
    getVehicleUiConfigForSelectedCustomerType(state).showDeliveryMethod
  );

/**
 * Returns the default value (customer-type level property).
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowTaxesAndFeesDefault = (state) =>
  getUiConfigValue(
    getVehicleUiConfigForSelectedCustomerType(state).showTaxesAndFees
  );

/**
 * Returns the default value (customer-type level property).
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowProtectionsPlanDefault = (state) =>
  getUiConfigValue(
    getVehicleUiConfigForSelectedCustomerType(state).showProtectionPlans
  );

/**
 * Returns the default value (customer-type level property).
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowSubscriptionsDefault = (state) =>
  getUiConfigValue(
    getVehicleUiConfigForSelectedCustomerType(state).showSubscriptions
  );

/**
 * Returns the default value (customer-type level property).
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowDocusignDefault = (state) =>
  getUiConfigValue(
    getVehicleUiConfigForSelectedCustomerType(state).showDocuSign
  );

/**
 * Returns the default value (customer-type level property).
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowDepositDefault = (state) =>
  getUiConfigValue(
    getVehicleUiConfigForSelectedCustomerType(state).showDeposit
  );

/**
 * Returns the default value (customer-type level property).
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {number}
 */
export const getAccessoryThresholdDefault = (state) =>
  getVehicleUiConfigForSelectedCustomerType(state).accessoryThreshold;

// payment plan specific
/**
 * Returns the config values for the selected payment method.
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {VehicleUiConfigSharedOptions}
 */
export const getVehicleUiConfigForSelectedPaymentPlan = (state) => {
  const financePlan = getFinancePlanDefaultToCash(state);
  return (
    getVehicleUiConfigPaymentMethods(state)?.find(
      (paymentMethod) => paymentMethod.planCode === financePlan
    )?.options || {}
  );
};

/**
 * Returns the config values for the selected payment method.
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {VehicleUiConfigSharedOptions}
 */
export const getVehicleUiConfigForTemporarySelectedPaymentPlan = (state) => {
  const financePlan = getSelectedFinancialPlanCodeDefaultToCash(state);
  return (
    getVehicleUiConfigPaymentMethods(state)?.find(
      (paymentMethod) => paymentMethod.planCode === financePlan
    )?.options || {}
  );
};

// payment plan specific
/**
 * Returns the config values for the selected payment method.
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getVehicleUiConfigForTemporarySelectedPaymentPlanShowDeposit = (
  state
) => {
  return getUiConfigValue(
    getVehicleUiConfigForTemporarySelectedPaymentPlan(state).showDeposit
  );
};

// payment plan specific
/**
 * Returns the config values for the selected payment method.
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getVehicleUiConfigForSelectedPaymentPlanShowDeposit = (state) => {
  return getUiConfigValue(
    getVehicleUiConfigForSelectedPaymentPlan(state).showDeposit
  );
};

/**
 * Returns customer type for the selected payment method.
 * @param {ReduxStateForVehicleUiConfig} state The redux state.
 * @returns {Array.<string>} The customer type(s).
 */
export const getCustomerTypeForSelectedPaymentPlan = (state) => {
  const financePlan = getFinancePlanDefaultToCash(state);
  return (
    getVehicleUiConfigPaymentMethods(state)
      ?.filter((paymentMethod) => paymentMethod.planCode === financePlan)
      ?.map((paymentMethod) => paymentMethod.customerType) || []
  );
};

/**
 * Returns the payment method property value
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowChargingForSelectedPaymentPlan = (state) =>
  mergeDefaultAndPaymentPlanValues(
    getVehicleUiConfigForSelectedPaymentPlan(state).showCharging,
    getShouldShowChargingDefault(state)
  );

/**
 * Returns the payment method property value
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowIncentivesForSelectedPaymentPlan = (state) =>
  mergeDefaultAndPaymentPlanValues(
    getVehicleUiConfigForSelectedPaymentPlan(state).showIncentives,
    getShouldShowIncentivesDefault(state)
  );

/**
 * Returns the payment method property value
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowTradeInForSelectedPaymentPlan = (state) =>
  mergeDefaultAndPaymentPlanValues(
    getVehicleUiConfigForSelectedPaymentPlan(state).showTradeIn,
    getShouldShowTradeInDefault(state)
  );

/**
 * Returns the payment method property value
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowAccessoriesForSelectedPaymentPlan = (state) =>
  mergeDefaultAndPaymentPlanValues(
    getVehicleUiConfigForSelectedPaymentPlan(state).showAccessories,
    getShouldShowAccessoriesDefault(state)
  );

/**
 *
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowDeliveryMethodForSelectedPaymentPlan = (state) =>
  mergeDefaultAndPaymentPlanValues(
    getVehicleUiConfigForSelectedPaymentPlan(state).showDeliveryMethod,
    getShouldShowDeliveryMethodDefault(state)
  );

/**
 * Returns the payment method property value
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowTaxesAndFeesForSelectedPaymentPlan = (state) =>
  mergeDefaultAndPaymentPlanValues(
    getVehicleUiConfigForSelectedPaymentPlan(state).showTaxesAndFees,
    getShouldShowTaxesAndFeesDefault(state)
  );

/**
 * Returns the payment method property value
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowProtectionPlansForSelectedPaymentPlan = (state) =>
  mergeDefaultAndPaymentPlanValues(
    getVehicleUiConfigForSelectedPaymentPlan(state).showProtectionPlans,
    getShouldShowProtectionsPlanDefault(state)
  );

/**
 * Returns the payment method property value
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowSubscriptionsForSelectedPaymentPlan = (state) =>
  mergeDefaultAndPaymentPlanValues(
    getVehicleUiConfigForSelectedPaymentPlan(state).showSubscriptions,
    getShouldShowSubscriptionsDefault(state)
  );

/**
 * Returns the payment method property value
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowDocusignForSelectedPaymentPlan = (state) =>
  mergeDefaultAndPaymentPlanValues(
    getVehicleUiConfigForSelectedPaymentPlan(state).showDocuSign,
    getShouldShowDocusignDefault(state)
  );

/**
 * Returns the payment method property value
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {boolean}
 */
export const getShouldShowDepositForSelectedPaymentPlan = (state) =>
  mergeDefaultAndPaymentPlanValues(
    getVehicleUiConfigForSelectedPaymentPlan(state).showDeposit,
    getShouldShowDepositDefault(state)
  );

/**
 * Returns the payment method property value
 * @param {ReduxStateForVehicleUiConfig} state The redux state
 * @returns {number}
 */
export const getAccessoryThresholdForSelectedPaymentPlan = (state) =>
  mergeDefaultAndPaymentPlanValues(
    getVehicleUiConfigForSelectedPaymentPlan(state).accessoryThreshold,
    getAccessoryThresholdDefault(state)
  );

/**
 * Gets the final value for a configuration based on the global and payment plan specific values.
 * @param {*} paymentPlanValue The config value for a specific payment plan.
 * @param {*} defaultValue The config value globally.
 * @returns {boolean} The final config value, after the global and payment method values are merged.
 */
// eslint-disable-next-line buy/selectors-must-have-state
export const mergeDefaultAndPaymentPlanValues = (
  paymentPlanValue,
  defaultValue
) => {
  defaultValue = getUiConfigValue(defaultValue);

  // override not defined, so return default
  if (paymentPlanValue === undefined) {
    return defaultValue;
  }

  // override defined, return override
  return paymentPlanValue;
};

/**
 * Get the boolean accordion value from its current undefined or boolean value.
 * @param {boolean} showAccordionValue The current value (undefined or boolean)
 * @returns {boolean}
 */
// eslint-disable-next-line buy/selectors-must-have-state
export const getUiConfigValue = (showAccordionValue) => {
  // true if literally true, or if undefined
  return showAccordionValue === undefined || showAccordionValue === true;
};
