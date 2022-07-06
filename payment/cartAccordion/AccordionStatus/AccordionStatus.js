import React from 'react';
import cssClasses from 'classnames';
import './AccordionStatus.scoped.scss';
import WhiteCheckGreenBack from '@Assets/images/checkMarks/whitecheck_greenback.svg';
import WarningIcon from '@Assets/images/warning/warning-alert-secondary.svg';
import { removeSpacesCharacters } from '@Utils/Utils';
import {
  ACCORDION_TYPES,
  DELIVERY_CARDS_TYPES,
  SYMBOLS,
} from '@Constants/main';

export const AccordionStatus = ({
  isRequired,
  requiredText,
  title,
  subtitle,
  checkmarkAltText,
  warningAltText,
  isComplete,
  showWarning,
  accordionType,
  selectedPlanName,
  isCash,
  isShowPaymentStatusDetails,
  selectedTerm,
  selectedApr,
  termPrefix,
  termSuffix,
  selectedDeliveryMethod,
  subtitleClose = '',
  addedCharging,
  selectedTradIn,
  addedAccessories,
  planAdded,
  addedProtectionPlans,
  total,
  payment,
  paymentText,
  deliveryCardTitle,
  collectionCardTitle,
  isShowGreenCheck = true,
  selectedPaymentCategory,
}) => {
  const titleClasses = cssClasses('title', {
    warning: showWarning && isRequired && !isComplete,
    selected: isComplete,
  });

  const getAccordionDetails = () => {
    // TODO: move conditionals into selector
    if (accordionType === ACCORDION_TYPES.PAYMENT_METHOD) {
      if (!isShowPaymentStatusDetails) {
        return selectedPlanName;
      }

      // All plans with apr should show the apr in this authoring
      if (!isCash) {
        if (typeof selectedApr === 'number' && selectedApr >= 0) {
          return `${selectedPlanName} ${SYMBOLS.HYPHEN} ${selectedApr}${SYMBOLS.PERCENTAGE} ${termPrefix} ${selectedTerm} ${termSuffix}`;
        } else {
          return `${selectedPlanName} ${SYMBOLS.HYPHEN} ${selectedTerm} ${termSuffix}`;
        }
      }
      return selectedPlanName;
    } else if (accordionType === ACCORDION_TYPES.DEALER_DELIVERY) {
      if (selectedDeliveryMethod === DELIVERY_CARDS_TYPES.DELIVERY) {
        return deliveryCardTitle;
      } else if (selectedDeliveryMethod === DELIVERY_CARDS_TYPES.COLLECTION) {
        return collectionCardTitle;
      }
    } else if (accordionType === ACCORDION_TYPES.PROTECTION_PLAN) {
      return `${addedProtectionPlans} ${planAdded}`;
    } else if (accordionType === ACCORDION_TYPES.CHARGING) {
      return `${addedCharging} ${subtitleClose}`;
    } else if (accordionType === ACCORDION_TYPES.ACCESSORIES) {
      return `${addedAccessories} ${subtitleClose}`;
    } else if (accordionType === ACCORDION_TYPES.TRADE_IN) {
      return `${subtitleClose} ${selectedTradIn}`;
    } else if (accordionType === ACCORDION_TYPES.TAXES_AND_FEES) {
      return `${subtitleClose}`;
    } else if (accordionType === ACCORDION_TYPES.OFFERS_INCENTIVES) {
      return `${subtitleClose}`;
    }
  };
  const shouldDisplayDetails = () => {
    if (
      accordionType === ACCORDION_TYPES.PAYMENT_METHOD &&
      selectedPaymentCategory
    ) {
      return false;
    }
    return !isComplete;
  };

  return (
    <>
      <div className="accordion-status">
        <div className="accordion-status__copy">
          <h2
            className={titleClasses}
            role="region"
            aria-live="polite"
            id={`${removeSpacesCharacters(title)}-accordionTitle`}
          >
            {title}
            {isRequired && !isComplete && (
              <span className="required-text"> {requiredText}</span>
            )}
            {isComplete && isShowGreenCheck && (
              <img
                className="check"
                src={WhiteCheckGreenBack}
                alt={checkmarkAltText}
              />
            )}
            {isRequired && !isComplete && showWarning && (
              <img
                className="warning-icon"
                src={WarningIcon}
                alt={warningAltText}
              />
            )}
          </h2>
          {shouldDisplayDetails() ? (
            <p className="subtitle">{subtitle}</p>
          ) : (
            <div className="accordion-details">{getAccordionDetails()}</div>
          )}
        </div>

        {payment && paymentText && (
          <div className="accordion-status__monthly">
            <div className="accordion-status__monthly-value">{payment}</div>
            <div className="accordion-status__monthly-message">
              {paymentText}
            </div>
          </div>
        )}

        {/* if there is a total associated with the accordion type, display it here */}
        {total && <div className="accordion-status__total">{total}</div>}
      </div>
    </>
  );
};

export default AccordionStatus;
