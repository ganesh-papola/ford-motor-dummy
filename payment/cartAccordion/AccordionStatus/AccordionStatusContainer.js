import React from 'react';
import { useSelector } from 'react-redux';
import { getFinancialPlans } from '@Ducks/ngc/selectors';
import {
  getApr,
  getFinancePlanForCartIsCash,
  getFinanceType,
  getTerm,
} from '@Ducks/calculator/selectors';
import * as deliveryDataSelectors from '@Ducks/deliveryData/selectors';
import { getAddedPlansCount } from '@Ducks/protectionPlanData/selectors';
import * as cartSelectors from '@Ducks/cart/selectors';
import AccordionStatus from './AccordionStatus';
import * as tradeInSelector from '@Ducks/tradeInData/selectors';
import * as accessorySelectors from '@Ducks/accessories/selectors';
import * as chargingSelectors from '@Ducks/charging/selectors';

const AccordionStatusContainer = (props) => {
  const { accordionType } = props;
  return (
    <AccordionStatus
      {...props}
      financePlans={useSelector(getFinancialPlans)}
      isComplete={useSelector((state) =>
        cartSelectors.getIsCartAccordionComplete(state, accordionType)
      )}
      selectedPlanName={useSelector(getFinanceType)}
      selectedTerm={useSelector(getTerm)}
      selectedApr={useSelector(getApr)}
      showWarning={useSelector(cartSelectors.isShowCartWarning)}
      isCash={useSelector(getFinancePlanForCartIsCash)}
      isShowPaymentAccordionWarning={useSelector(
        cartSelectors.isShowPaymentAccordionWarning
      )}
      selectedDeliveryMethod={useSelector(
        deliveryDataSelectors.getDeliveryMethodSelected
      )}
      isTaxesFeesSelected={true}
      isShowTaxesFeesAccordionWarning={useSelector(
        cartSelectors.isShowTaxesFeesAccordionWarning
      )}
      addedProtectionPlans={useSelector(getAddedPlansCount)}
      selectedTradIn={useSelector((state) =>
        tradeInSelector.getSelectedTradInYearMakeModel(state, props.appraisalId)
      )}
      addedAccessories={useSelector(
        accessorySelectors.getAddedAccessoriesCount
      )}
      addedCharging={useSelector(chargingSelectors.getAddedChargingCount)}
    />
  );
};

export default AccordionStatusContainer;
