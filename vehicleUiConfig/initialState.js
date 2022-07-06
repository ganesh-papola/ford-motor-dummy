import { CUSTOMER_TYPE } from '@Constants/calculator';

/**
 * @typedef {object} VehicleUiConfigSharedOptions
 * @type {object}
 * @property {boolean} showCharging - True or undefined if the charging accordion should be displayed.
 * @property {boolean} showIncentives - True or undefined if the incentives accordion should be displayed.
 * @property {boolean} showTradeIn - True or undefined if the trade in accordion should be displayed.
 * @property {boolean} showAccessories - True or undefined if the accessories accordion should be displayed.
 * @property {boolean} showDeliveryMethod - True or undefined if the delivery method accordion should be displayed.
 * @property {boolean} showTaxesAndFees - True or undefined if the taxes and fees accordion should be displayed.
 * @property {boolean} showGovernmentIncentives - True or undefined if the government incentives accordion should be displayed.
 * @property {boolean} showProtectionPlans - True or undefined if the protection plan accordion should be displayed.
 * @property {boolean} showSubscriptions - True or undefined if the subscriptions accordion should be displayed.
 * @property {boolean} showDelivery - True or undefined if the delivery charge should be displayed???
 * @property {boolean} showDocusign - True or undefined if docu sign should be displayed???
 * @property {boolean} showDeposit - True or undefined if the deposit value should be displayed???
 * @property {number} accessoryThreshold - Limits on the number of accessories displayed???
 * @global
 */

/**
 * @type {VehicleUiConfigSharedOptions}
 */
const initialStateDefaults = {
  showCharging: true,
  showIncentives: true,
  showTradeIn: true,
  showAccessories: true,
  showDeliveryMethod: true,
  showTaxesAndFees: true,
  showGovernmentIncentives: true,
  showProtectionPlans: true,
  showSubscriptions: true,
  showDelivery: true,
  showDocusign: true,
  showDeposit: true,
  accessoryThreshold: null,
};

/**
 * @typedef {object} VehicleUiConfigPaymentMethod
 * @type {object}
 * @property {string} planCode - The plan ID.
 * @property {('retail'|'business')} customerType - The customer type for this plan. Passed through to checkout, ignored for cart.
 * @property {string} category - The category of the plan ID (e.g. LEASE).
 * @property {VehicleUiConfigSharedOptions} options - The accordion override options for this payment plan.
 * @global
 */

/**
 * @typedef {object} VehicleUiConfig
 * @type {object}
 * @property {VehicleUiConfigSharedOptions} retail - The vehicle UI config state for retail customers. Update this key if {@link CUSTOMER_TYPE} changes.
 * @property {VehicleUiConfigSharedOptions} business - The vehicle UI config state for business customers. Update this key if {@link CUSTOMER_TYPE} changes.
 * @property {Array.<VehicleUiConfigPaymentMethod>} paymentMethods - The available payment methods for all customer types, and their associated configuration state.
 * @property {boolean} isLoading - Whether or not the vehicle ui config is loading from the API call or not. This indicates failure XOR success when false.
 * @property {boolean} hasLoadedSuccessfully - true if the vehicle ui config has finished loading and was successful
 * @global
 */

/**
 * @type {VehicleUiConfig}
 */
const initialState = {
  [CUSTOMER_TYPE.RETAIL]: { ...initialStateDefaults },
  [CUSTOMER_TYPE.BUSINESS]: { ...initialStateDefaults },
  paymentMethods: [],
  isLoading: false,
  hasLoadedSuccessfully: false,
};

export default initialState;
