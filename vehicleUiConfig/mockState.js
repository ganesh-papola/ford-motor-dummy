/**
 * @typedef {import('@Ducks/vehicleUiConfig/initialState').VehicleUiConfig} VehicleUiConfig
 */

/**
 * @type {VehicleUiConfig}
 */
const ICE_MICRO_MOCK = {
  retail: {
    showDelivery: false,
    showDocusign: false,
    showDeposit: false,
    showTradeIn: false,
    showProtectionPlans: false,
    showTaxesAndFees: false,
    showModemAuthorization: false,
  },
  business: {},

  paymentMethods: [
    {
      planCode: 'fsl',
      category: 'LEASE',
      customerType: 'retail',
      options: {
        showDeposit: false,
        showAccessories: false,
        accessoryThreshold: 3500,
      },
    },
    {
      planCode: 'fsli',
      category: 'LEASE',
      customerType: 'retail',
      options: {
        showDeposit: false,
        showAccessories: true,
        accessoryThreshold: 2500,
      },
    },
    {
      planCode: 'c',
      category: 'CASH',
      customerType: 'retail',
      options: {},
    },
    {
      planCode: '0',
      category: 'FINANCE',
      customerType: 'retail',
      options: {},
    },
    {
      planCode: '731',
      category: 'FINANCE',
      customerType: 'retail',
      options: {},
    },
    {
      planCode: 'pl',
      category: 'LEASE',
      customerType: 'business',
      options: {},
    },
  ],
};

export const BUSINESS_SKIP_DOCUSIGN_MOCK = {
  business: {
    showOffersAndIncentives: false,
    showTaxesAndFees: false,
    showProtectionPlans: false,
  },
  paymentMethods: [
    {
      customerType: 'business',
      options: {},
      category: 'cash',
      planCode: 'c',
    },
    {
      customerType: 'business',
      options: {
        showDocusign: false,
      },
      category: 'lease',
      planCode: 'fsl',
    },
    {
      customerType: 'business',
      options: {
        showDocusign: false,
      },
      category: 'lease',
      planCode: 'fsli',
    },
  ],
};

export const BUSINESS_DEPOSIT_MOCK = {
  business: {
    showOffersAndIncentives: false,
    showTaxesAndFees: false,
    showProtectionPlans: false,
  },
  paymentMethods: [
    {
      customerType: 'business',
      options: {},
      category: 'cash',
      planCode: 'c',
    },
    {
      customerType: 'business',
      options: {
        showDeposit: false,
      },
      category: 'lease',
      planCode: 'fsl',
    },
    {
      customerType: 'business',
      options: {
        showDeposit: false,
      },
      category: 'lease',
      planCode: 'fsli',
    },
  ],
};

export const BUSINESS_SKIP_DOCUSIGN_AND_DEPOSIT_MOCK = {
  business: {
    showOffersAndIncentives: false,
    showTaxesAndFees: false,
    showProtectionPlans: false,
  },
  paymentMethods: [
    {
      customerType: 'business',
      options: {},
      category: 'cash',
      planCode: 'c',
    },
    {
      customerType: 'business',
      options: {
        showDocusign: false,
        showDeposit: false,
      },
      category: 'lease',
      planCode: 'fsl',
    },
    {
      customerType: 'business',
      options: {
        showDocusign: false,
        showDeposit: false,
      },
      category: 'lease',
      planCode: 'fsli',
    },
  ],
};

export const RETAIL_SKIP_DOCUSIGN_MOCK = {
  retail: {
    showOffersAndIncentives: false,
    showTaxesAndFees: false,
    showProtectionPlans: false,
  },
  paymentMethods: [
    {
      customerType: 'retail',
      options: {
        showDocusign: false,
      },
      category: 'cash',
      planCode: 'c',
    },
    {
      customerType: 'retail',
      options: {
        showDocusign: false,
      },
      category: 'finance',
      planCode: '0',
    },
  ],
};

export const RETAIL_SKIP_DEPOSIT_MOCK = {
  retail: {
    showOffersAndIncentives: false,
    showTaxesAndFees: false,
    showProtectionPlans: false,
  },
  paymentMethods: [
    {
      customerType: 'retail',
      options: {
        showDeposit: false,
      },
      category: 'cash',
      planCode: 'c',
    },
    {
      customerType: 'retail',
      options: {
        showDeposit: false,
      },
      category: 'finance',
      planCode: '0',
    },
  ],
};

export const RETAIL_SKIP_DOCUSIGN_AND_DEPOSIT_MOCK = {
  retail: {
    showOffersAndIncentives: false,
    showTaxesAndFees: false,
    showProtectionPlans: false,
  },
  paymentMethods: [
    {
      customerType: 'retail',
      options: {
        showDocusign: false,
        showDeposit: false,
      },
      category: 'cash',
      planCode: 'c',
    },
    {
      customerType: 'retail',
      options: {
        showDocusign: false,
        showDeposit: false,
      },
      category: 'finance',
      planCode: '0',
    },
  ],
};

export default ICE_MICRO_MOCK;
