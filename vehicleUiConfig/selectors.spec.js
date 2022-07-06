import * as S from './selectors';
import ICE_MICRO_MOCK from './mockState';
import { CUSTOMER_TYPE, PLAN_CODES } from '@Constants/calculator';

/**
 * @typedef {import('./selectors').ReduxStateForVehicleUiConfig} ReduxStateForVehicleUiConfig
 */

const cashVehicleUiConfig = {
  planCode: PLAN_CODES.CASH,
  category: 'LEASE',
  customerType: 'retail',
  options: {
    showIncentives: false,
    showTradeIn: true,
    showProtectionPlans: true,
    showTaxesAndFees: true,
    accessoryThreshold: 3500,
  },
};

const fsliVehicleUIConfig = ICE_MICRO_MOCK.paymentMethods.find(
  (paymentMethod) => paymentMethod.planCode === 'fsli'
);

/** @type {ReduxStateForVehicleUiConfig}  */
const mockState = {
  vehicleUiConfig: {
    ...ICE_MICRO_MOCK,
  },
  calculator: {
    selectedPaymentPlan: {
      financePlan: PLAN_CODES.CASH,
    },
    confirmedPaymentPlan: {
      financePlan: PLAN_CODES.CASH,
    },
    sharedData: {
      financePlan: PLAN_CODES.CASH,
    },
  },
  userData: {
    customerType: CUSTOMER_TYPE.RETAIL,
  },
};

mockState.vehicleUiConfig.paymentMethods = mockState.vehicleUiConfig.paymentMethods.filter(
  (method) => method.planCode !== PLAN_CODES.CASH
);

mockState.vehicleUiConfig.paymentMethods.push(cashVehicleUiConfig);

describe('ui selectors', () => {
  describe('for selected payment plan', () => {
    it('should get correct vehicle config for current finance plan if valid', () => {
      const testState = { ...mockState };
      const vehicleUiConfig = S.getVehicleUiConfigForSelectedPaymentPlan(
        testState
      );
      expect(vehicleUiConfig).toEqual(cashVehicleUiConfig.options);
    });

    it('should get an empty vehicle config for current finance plan if invalid', () => {
      const testState = {
        ...mockState,
        calculator: {
          confirmedPaymentPlan: {
            financePlan: 'garbage',
          },
        },
      };
      const vehicleUiConfig = S.getVehicleUiConfigForSelectedPaymentPlan(
        testState
      );
      expect(vehicleUiConfig).toEqual({});
    });

    it('should get correct vehicle config for current finance plan if valid', () => {
      const testState = {
        ...mockState,
        cart: { paymentCalculatorPlanCode: 'fsli' },
      };
      const vehicleUiConfig = S.getVehicleUiConfigForTemporarySelectedPaymentPlan(
        testState
      );
      expect(vehicleUiConfig).toEqual(fsliVehicleUIConfig.options);
    });

    it('should get an empty vehicle config for current finance plan if invalid', () => {
      const testState = {
        ...mockState,
        cart: { paymentCalculatorPlanCode: 'garbage' },
      };
      const vehicleUiConfig = S.getVehicleUiConfigForTemporarySelectedPaymentPlan(
        testState
      );
      expect(vehicleUiConfig).toEqual({});
    });

    it('should return retail and business as customer types if finance plan is c', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          paymentMethods: [
            {
              planCode: 'c',
              category: 'CASH',
              customerType: 'retail',
              options: {},
            },
            {
              planCode: 'c',
              category: 'CASH',
              customerType: 'business',
              options: {},
            },
          ],
        },
      };

      const customerType = S.getCustomerTypeForSelectedPaymentPlan(testState);
      expect(customerType).toEqual(['retail', 'business']);
    });

    it('should return business as customer types if finance plan is pl', () => {
      const testState = {
        ...mockState,
        calculator: {
          confirmedPaymentPlan: {
            financePlan: 'pl',
          },
        },
      };
      const customerType = S.getCustomerTypeForSelectedPaymentPlan(testState);
      expect(customerType).toEqual(['business']);
    });

    it('should return empty array if finance plan is invalid', () => {
      const testState = {
        ...mockState,
        calculator: {
          confirmedPaymentPlan: {
            financePlan: 'invalid',
          },
        },
      };
      const customerType = S.getCustomerTypeForSelectedPaymentPlan(testState);
      expect(customerType).toEqual([]);
    });

    it('should get correct show charging value for current finance plan', () => {
      const testState = { ...mockState };
      const showCharging = S.getShouldShowChargingForSelectedPaymentPlan(
        testState
      );
      expect(showCharging).toBe(true);
    });

    it('should get correct show inventives value for current finance plan', () => {
      const testState = { ...mockState };
      const showIncentives = S.getShouldShowIncentivesForSelectedPaymentPlan(
        testState
      );
      expect(showIncentives).toBe(false);
    });

    it('should get correct show tradein value for current finance plan', () => {
      const testState = { ...mockState };
      const showTradeIn = S.getShouldShowTradeInForSelectedPaymentPlan(
        testState
      );
      expect(showTradeIn).toBe(true);
    });

    it('should get correct show accessories value for current finance plan', () => {
      const testState = { ...mockState };
      const showAccessories = S.getShouldShowAccessoriesForSelectedPaymentPlan(
        testState
      );
      expect(showAccessories).toBe(true);
    });

    it('should get correct show delivery methods value for current finance plan', () => {
      const testState = { ...mockState };
      const showDeliveryMethod = S.getShouldShowDeliveryMethodForSelectedPaymentPlan(
        testState
      );
      expect(showDeliveryMethod).toBe(true);
    });

    it('should get correct show taxes and fees value for current finance plan', () => {
      const testState = { ...mockState };
      const showTaxesAndFees = S.getShouldShowTaxesAndFeesForSelectedPaymentPlan(
        testState
      );
      expect(showTaxesAndFees).toBe(true);
    });

    it('should get correct show protection plan value for current finance plan', () => {
      const testState = { ...mockState };
      const showProtectionPlan = S.getShouldShowProtectionPlansForSelectedPaymentPlan(
        testState
      );
      expect(showProtectionPlan).toBe(true);
    });

    it('should get correct show subscriptions value for current finance plan', () => {
      const testState = { ...mockState };
      const showSubscriptions = S.getShouldShowSubscriptionsForSelectedPaymentPlan(
        testState
      );
      expect(showSubscriptions).toBe(true);
    });

    it('should get correct show docusign value for current finance plan', () => {
      const testState = { ...mockState };
      const showDocusign = S.getShouldShowDocusignForSelectedPaymentPlan(
        testState
      );
      expect(showDocusign).toBe(true);
    });

    it('should get correct show deposit value for current finance plan', () => {
      const testState = { ...mockState };
      const showDeposit = S.getShouldShowDepositForSelectedPaymentPlan(
        testState
      );
      expect(showDeposit).toBe(false);
    });

    it('should get correct accessory threshold value for current finance plan', () => {
      const testState = { ...mockState };
      const accessoryThreshold = S.getAccessoryThresholdForSelectedPaymentPlan(
        testState
      );
      expect(accessoryThreshold).toBe(3500);
    });

    it('should override global value and get correct show charging value for current finance plan', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: {
            showCharging: undefined,
          },
        },
      };
      const showCharging = S.getShouldShowChargingForSelectedPaymentPlan(
        testState
      );
      expect(showCharging).toBe(true);
    });

    it('should override global value and get correct show inventives value for current finance plan', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: {
            showIncentives: true,
          },
        },
      };
      const showIncentives = S.getShouldShowIncentivesForSelectedPaymentPlan(
        testState
      );
      expect(showIncentives).toBe(false);
    });

    it('should override global value and get correct show tradein value for current finance plan', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: {
            showTradeIn: false,
          },
        },
      };
      const showTradeIn = S.getShouldShowTradeInForSelectedPaymentPlan(
        testState
      );
      expect(showTradeIn).toBe(true);
    });

    it('should override global value and get correct show accessories value for current finance plan', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: {
            showAccessories: true,
          },
        },
      };
      const showAccessories = S.getShouldShowAccessoriesForSelectedPaymentPlan(
        testState
      );
      expect(showAccessories).toBe(true);
    });

    it('should override global value and get correct show delivery methods value for current finance plan', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: {
            showDeliveryMethod: false,
          },
        },
      };
      const showDeliveryMethod = S.getShouldShowDeliveryMethodForSelectedPaymentPlan(
        testState
      );
      expect(showDeliveryMethod).toBe(false);
    });

    it('should override global value and get correct show taxes and fees value for current finance plan', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: {
            showTaxesAndFees: true,
          },
        },
      };
      const showTaxesAndFees = S.getShouldShowTaxesAndFeesForSelectedPaymentPlan(
        testState
      );
      expect(showTaxesAndFees).toBe(true);
    });

    it('should override global value and get correct show protection plan value for current finance plan', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: {
            showProtectionPlans: true,
          },
        },
      };
      const showProtectionPlans = S.getShouldShowProtectionPlansForSelectedPaymentPlan(
        testState
      );
      expect(showProtectionPlans).toBe(true);
    });

    it('should override global value and get correct show subscriptions value for current finance plan', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: {
            showSubscriptions: undefined,
          },
        },
      };
      const showSubscriptions = S.getShouldShowSubscriptionsForSelectedPaymentPlan(
        testState
      );
      expect(showSubscriptions).toBe(true);
    });

    it('should override global value and get correct show docusign value for current finance plan', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: {
            showDocusign: undefined,
          },
        },
      };
      const showDocusign = S.getShouldShowDocusignForSelectedPaymentPlan(
        testState
      );
      expect(showDocusign).toBe(true);
    });

    it('should override global value and get correct show deposit value for current finance plan', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: {
            showDeposit: undefined,
          },
        },
      };
      const showDeposit = S.getShouldShowDepositForSelectedPaymentPlan(
        testState
      );
      expect(showDeposit).toBe(true);
    });

    it('should override global value and get correct accessory threshold value for current finance plan', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: {
            accessoryThreshold: 2500,
          },
        },
      };
      const accessoryThreshold = S.getAccessoryThresholdForSelectedPaymentPlan(
        testState
      );
      expect(accessoryThreshold).toBe(3500);
    });
  });

  describe('for customer type', () => {
    it('should get config for selected customer type', () => {
      const testState = { ...mockState };
      const customerTypeVehicleUiConfig = S.getVehicleUiConfigForSelectedCustomerType(
        testState
      );
      expect(customerTypeVehicleUiConfig).toEqual(
        testState.vehicleUiConfig.retail
      );
    });

    it('should get all payment methods', () => {
      const testState = { ...mockState };
      const customerTypeVehicleUiConfigPaymentMethods = S.getVehicleUiConfigPaymentMethods(
        testState
      );
      expect(customerTypeVehicleUiConfigPaymentMethods).toEqual(
        testState.vehicleUiConfig.paymentMethods
      );
    });

    it('should get empty config for selected customer type if none exists', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          retail: undefined,
        },
      };
      const customerTypeVehicleUiConfig = S.getVehicleUiConfigForSelectedCustomerType(
        testState
      );
      expect(customerTypeVehicleUiConfig).toEqual({});
    });

    it('should get empty array for payment methods if none exist', () => {
      const testState = {
        ...mockState,
        vehicleUiConfig: {
          ...mockState.vehicleUiConfig,
          paymentMethods: undefined,
        },
      };
      const customerTypeVehicleUiConfigPaymentMethods = S.getVehicleUiConfigPaymentMethods(
        testState
      );
      expect(customerTypeVehicleUiConfigPaymentMethods).toEqual([]);
    });

    it('should get valid available payment plans', () => {
      // all payment plans are valid by default until the response comes back
      // eslint-disable-next-line prefer-const
      const testState = { ...mockState };
      let validPaymentPlans = S.getAvailablePaymentMethods(testState);
      expect(validPaymentPlans.sort()).toEqual([
        '0',
        '731',
        'c',
        'fsl',
        'fsli',
        'pl',
      ]);

      testState.vehicleUiConfig.paymentMethods = testState.vehicleUiConfig.paymentMethods.filter(
        (paymentMethod) => paymentMethod.planCode !== PLAN_CODES.CASH
      );
      validPaymentPlans = S.getAvailablePaymentMethods(testState);
      expect(validPaymentPlans.sort()).toEqual([
        '0',
        '731',
        'fsl',
        'fsli',
        'pl',
      ]);
    });

    it('should get correct show charging value', () => {
      const testState = { ...mockState };
      const showCharging = S.getShouldShowChargingDefault(testState);
      expect(showCharging).toBe(true);
    });

    it('should get correct show incentives value', () => {
      const testState = { ...mockState };
      const showIncentives = S.getShouldShowIncentivesDefault(testState);
      expect(showIncentives).toBe(true);
    });

    it('should get correct show tradein value', () => {
      const testState = { ...mockState };
      const showTradeIn = S.getShouldShowTradeInDefault(testState);
      expect(showTradeIn).toBe(false);
    });

    it('should get correct show accessories value', () => {
      const testState = { ...mockState };
      const showAccessories = S.getShouldShowAccessoriesDefault(testState);
      expect(showAccessories).toBe(true);
    });

    it('should get correct show delivery methods value', () => {
      const testState = { ...mockState };
      const showDeliveryMethod = S.getShouldShowDeliveryMethodDefault(
        testState
      );
      expect(showDeliveryMethod).toBe(true);
    });

    it('should get correct show taxes and fees value', () => {
      const testState = { ...mockState };
      const showTaxesAndFees = S.getShouldShowTaxesAndFeesDefault(testState);
      expect(showTaxesAndFees).toBe(false);
    });

    it('should get correct show protection plan value', () => {
      const testState = { ...mockState };
      const showProtectionPlans = S.getShouldShowProtectionsPlanDefault(
        testState
      );
      expect(showProtectionPlans).toBe(false);
    });

    it('should get correct show subscriptions value', () => {
      const testState = { ...mockState };
      const showSubscriptions = S.getShouldShowSubscriptionsDefault(testState);
      expect(showSubscriptions).toBe(true);
    });

    it('should get correct show docusign value', () => {
      const testState = { ...mockState };
      const showDocusign = S.getShouldShowDocusignDefault(testState);
      expect(showDocusign).toBe(true);
    });

    it('should get correct show deposit value', () => {
      const testState = { ...mockState };
      const showDeposit = S.getShouldShowDepositDefault(testState);
      expect(showDeposit).toBe(false);
    });

    it('should get correct accessory threshold value', () => {
      const testState = { ...mockState };
      const accessoryThreshold = S.getAccessoryThresholdDefault(testState);
      expect(accessoryThreshold).toBe(undefined);
    });
  });

  describe('global/payment plan value merge', () => {
    it('returns the default when the payment plan value is undefined', () => {
      expect(S.mergeDefaultAndPaymentPlanValues(undefined, true)).toBe(true);
      expect(S.mergeDefaultAndPaymentPlanValues(undefined, false)).toBe(false);
    });

    it('returns the payment plan value when the payment plan value is not undefined', () => {
      expect(S.mergeDefaultAndPaymentPlanValues(true, false)).toBe(true);
      expect(S.mergeDefaultAndPaymentPlanValues(false, true)).toBe(false);
      expect(S.mergeDefaultAndPaymentPlanValues(3500, 2500)).toBe(3500);
    });
  });
});
