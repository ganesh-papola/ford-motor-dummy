import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import WhiteCheckGreenBack from '@Assets/images/checkMarks/whitecheck_greenback.svg';
import CurrencyFormatter from '@Utils/currencyFormatter/CurrencyFormatter';
import CheckBox from '@Common/inputs/checkBox/CheckBox';
import PrimaryButton from '@Common/buttons/button/primaryButton/PrimaryButton';
import './DeliveryCard.scss';
import { DELIVERY_CARDS_TYPES } from '@Constants/main';
import AnalyticsService from '../../../services/analyticsService/AnalyticsService';
import { PLAN_CODES } from '@Constants/calculator';
import FDSTooltip from '../../fds/tooltip/FDSTooltip';
import { PROVIDERS } from '@Constants/calculator';

export const DeliveryCard = ({
  address,
  addToFinance,
  addToFinanceLabel,
  calculated,
  cardType,
  checkmarkAltText,
  collectionFee,
  contentType,
  ctaName,
  selectButtonText,
  selectButtonAriaLabel,
  selectedText,
  deliveryFee,
  deliveryPostalCodeLabel,
  deliveryUnavailableCta,
  deliveryUnavailableContentType,
  deliveryUnavailableText,
  deliveryUnavailableToolTipText,
  deliveryUnavailableToolTipTitle,
  deliveryZipcode,
  enableDeliveryFinancing,
  isDeliveryUnavailable = false,
  isNewOrder,
  isSelected = false,
  name,
  paymentProvider,
  selectedFinancePlan,
  title,
  titleToolTipCta,
  titleToolTipContentType,
  titleToolTipText,
  titleToolTipTitle,
  updateDeliveryApplyFinance,
  updateDeliveryFinance,
  updateDeliveryFinanceHasSucceeded,
  updateDeliveryOptions,
  updateSelectedDeliveryMethod,
  freeDeliveryLabel,
  cartTotalPrice,
  isDealerized,
  isDealerSelectEnabled,
  updateDeliveryMethodShowDealer,
  deliveryCardContent,
  collectionCardContent,
  showDealerSelect,
}) => {
  const cssClasses = classnames('delivery-card', {
    selected: isSelected,
  });

  const nonDealerizedCartContent =
    cardType !== DELIVERY_CARDS_TYPES.COLLECTION
      ? deliveryCardContent
      : collectionCardContent;

  const fee =
    cardType === DELIVERY_CARDS_TYPES.COLLECTION ? collectionFee : deliveryFee;

  const feeWithCurrency = CurrencyFormatter.formatPrice({
    price: fee,
  });

  const [isAddToFinanceChecked, setAddToFinanceChecked] = useState(
    addToFinance
  );

  useEffect(() => {
    if (updateDeliveryFinanceHasSucceeded) {
      updateDeliveryApplyFinance({
        addToFinance: isAddToFinanceChecked,
      });
    }
  }, [updateDeliveryFinanceHasSucceeded]);

  const handleClick = () => {
    if (isDealerSelectEnabled) {
      if (!showDealerSelect) {
        updateDeliveryMethodShowDealer({
          deliveryMethodShowDealer: true,
        });
      }
      if (!isDealerized) {
        updateSelectedDeliveryMethod({
          deliveryMethodSelected: cardType,
        });
      }
    }
    if (isDealerized || !isDealerSelectEnabled) {
      updateDeliveryOptions({
        selectedDeliveryMethod: cardType,
        addToFinance:
          cardType === DELIVERY_CARDS_TYPES.COLLECTION
            ? false
            : isAddToFinanceChecked,
      });
    }

    AnalyticsService.deliveryMethodCta(
      contentType,
      ctaName,
      cardType,
      cartTotalPrice
    );
  };

  const titleToolTipOnClick = () =>
    AnalyticsService.ctaClick(titleToolTipContentType, titleToolTipCta);
  const deliveryUnavailableOnClick = () =>
    AnalyticsService.ctaClick(
      deliveryUnavailableContentType,
      deliveryUnavailableCta
    );

  const handleAddToFinance = (isChecked) => {
    setAddToFinanceChecked(isChecked);
    updateDeliveryFinance({
      cardType: cardType,
      addToFinance: isChecked,
      deliveryZipcode: deliveryZipcode,
    });
  };

  return (
    <div className={cssClasses}>
      <div className="title">
        {title}
        {(titleToolTipTitle || titleToolTipText) && (
          <FDSTooltip
            customClass="delivery-unavailable__tooltip"
            title={titleToolTipTitle}
            content={titleToolTipText}
            handleTooltipClick={() => {
              titleToolTipOnClick();
            }}
          />
        )}
      </div>
      {!isDealerized && (
        <div className="delivery-card__content">{nonDealerizedCartContent}</div>
      )}
      {isDealerized && (
        <div className="address">
          {cardType === DELIVERY_CARDS_TYPES.COLLECTION && (
            <>
              <div>{name}</div>
              <div>{address}</div>
            </>
          )}
          {isNewOrder &&
            cardType === DELIVERY_CARDS_TYPES.DELIVERY &&
            !isDeliveryUnavailable && (
              <>
                <div>{deliveryPostalCodeLabel}</div>
                <div>{deliveryZipcode}</div>
              </>
            )}
          {!isNewOrder &&
            !isDeliveryUnavailable &&
            cardType === DELIVERY_CARDS_TYPES.DELIVERY && (
              <>
                <div>{name}</div>
                <div>{address}</div>
              </>
            )}
        </div>
      )}
      {isDealerized && isDeliveryUnavailable ? (
        <div className="delivery-unavailable">
          {deliveryUnavailableText}
          {(deliveryUnavailableToolTipText ||
            deliveryUnavailableToolTipTitle) && (
            <FDSTooltip
              customClass="delivery-unavailable__tooltip"
              title={deliveryUnavailableToolTipTitle}
              content={deliveryUnavailableToolTipText}
              handleTooltipClick={() => {
                deliveryUnavailableOnClick();
              }}
            />
          )}
        </div>
      ) : (
        <div className="fee">
          {deliveryFee
            ? feeWithCurrency
            : freeDeliveryLabel
            ? freeDeliveryLabel
            : feeWithCurrency}
        </div>
      )}
      {/*
        financeType !== FINANCE_TYPES_Displayed.CASH &&
        financeType does not seem to be a good value to key off as this value is
        different in different languages so in Norwegian "Cash" is not "Cash"
       */}
      {enableDeliveryFinancing &&
        calculated &&
        isSelected &&
        selectedFinancePlan !== PLAN_CODES.CASH &&
        !isDeliveryUnavailable &&
        paymentProvider === PROVIDERS.SANTANDER &&
        deliveryFee > 0 && (
          <div className="add-to-finance">
            <CheckBox
              className="add-to-finance-checkbox"
              defaultCheck={isAddToFinanceChecked}
              onClick={(isChecked) => {
                handleAddToFinance(isChecked);
              }}
            >
              <span className="add-to-finance__label">{addToFinanceLabel}</span>
            </CheckBox>
          </div>
        )}
      {isSelected ? (
        <div className="selected-block">
          <div className="selected-text">
            {selectedText}
            <img
              className="check"
              src={WhiteCheckGreenBack}
              alt={checkmarkAltText}
            />
          </div>
        </div>
      ) : (
        <PrimaryButton
          text={selectButtonText}
          ariaLabel={selectButtonAriaLabel}
          disabled={isDealerized && isDeliveryUnavailable}
          theme="light"
          chevron="no"
          position="center"
          type="button"
          handleClick={handleClick}
        />
      )}
    </div>
  );
};

export default DeliveryCard;
