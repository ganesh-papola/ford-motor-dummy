import React from 'react';
import { ACCORDION_TYPES } from '@Constants/main';
import AccessoriesAccordion from './AccessoriesAccordion';
import ChargingAccordion from './ChargingAccordion';
import DealerDeliveryAccordion from './DealerDeliveryAccordion';
import PaymentMethodAccordion from './PaymentMethodAccordion';
import ProtectionPlanAccordion from './ProtectionPlanAccordion';
import TradeInAccordion from './TradeInAccordion';
import TaxesAndFeesAccordion from './TaxesAndFeesAccordion';

export const CartAccordion = (props) => {
  const {
    accordionType,
    showAccessories,
    showCharging,
    showDeliveryMethod,
    showProtectionPlans,
    showTradeIn,
    showTaxesAndFees,
  } = props;

  switch (accordionType) {
    case ACCORDION_TYPES.ACCESSORIES:
      return showAccessories ? <AccessoriesAccordion {...props} /> : null;
    case ACCORDION_TYPES.CHARGING:
      return showCharging ? <ChargingAccordion {...props} /> : null;
    case ACCORDION_TYPES.DEALER_DELIVERY:
      return showDeliveryMethod ? <DealerDeliveryAccordion {...props} /> : null;
    case ACCORDION_TYPES.OFFERS_INCENTIVES:
    case ACCORDION_TYPES.PAYMENT_METHOD:
      return <PaymentMethodAccordion {...props} />;
    case ACCORDION_TYPES.PROTECTION_PLAN:
      return showProtectionPlans ? (
        <ProtectionPlanAccordion {...props} />
      ) : null;
    case ACCORDION_TYPES.TRADE_IN:
      return showTradeIn ? <TradeInAccordion {...props} /> : null;
    case ACCORDION_TYPES.TAXES_AND_FEES:
      return showTaxesAndFees ? <TaxesAndFeesAccordion {...props} /> : null;
    default:
      return null;
  }
};

export default React.memo(CartAccordion, (prevProps, nextProps) => {
  const {
    hasFMAOrGuestGUIDAuth,
    getCartHasSucceededWithValidData,
    financePlans,
  } = nextProps;
  // return true if we should leave the component as is,
  // false if we should re-render
  const shouldNotRender =
    !hasFMAOrGuestGUIDAuth ||
    !getCartHasSucceededWithValidData ||
    !financePlans;

  return shouldNotRender;
});
