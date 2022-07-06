import React, { useEffect, useRef, useCallback, useState } from 'react';
import cssClasses from 'classnames';
import AccordionSlider from '@Common/accordionSlider/AccordionSlider';
import Arrow, { ArrowOrientation } from '@Common/arrow/Arrow';
import { DELIVERY_CARDS_TYPES } from '@Constants/main';
import { removeSpacesCharacters } from '@Utils/Utils';
import AccordionStatusContainer from './AccordionStatus/AccordionStatusContainer';
import DeliveryCardContainer from '../../../components/cart/deliveryCard/DeliveryCardContainer';
import useUpdateAccordionLabel from './useUpdateAccordionLabel';
import useRegisterCartAccordion from './useRegisterCartAccordion';
import './CartAccordion.scoped.scss';
import './CartAccordion.scss';
import { ACCORDION_TYPES } from '@Constants/main';
import AnalyticsService from '../../../services/analyticsService/AnalyticsService';
import { DealerSelect } from './DealerSelect/DealerSelect';
import PageLevelErrorComponent from '@Common/pageLevelErrorComponent/PageLevelErrorComponent';

export const DealerDeliveryAccordion = (props) => {
  const {
    dealerId,
    accordionType,
    isRequired,
    isShowPaymentStatusDetails,
    // accordion text
    requiredText,
    subtitle,
    title,
    // --
    // close/open accordion stuffs
    isOpen = true,
    alwaysExpandDuringAccordionProgression = true,
    // --
    isNextStepsClicked,
    checkmarkAltText,
    completeCartAccordion = () => {},
    hideTopBorder,
    warningAltText,
    termPrefix = 'For',
    termSuffix = 'MONTHS',
    toggleCartAccordion = () => {},
    showNextSteps = false,
    onClickFunc = () => {},
    nextStepsText = 'Next Steps',
    skipCartAccordion = () => {},
    nextStepCartAccordion = () => {},
    ppViewCartAddedLabel,
    collectionCardTitle,
    collectionCardTitleToolTipTitle,
    collectionCardTitleToolTipText,
    collectionCardTitleToolTipAltText,
    collectionCardContent,
    customerName,
    customerAddress,
    customerZipCode,
    deliveryCardTitle,
    deliveryCardTitleToolTipTitle,
    deliveryCardTitleToolTipText,
    deliveryCardTitleToolTipAltText,
    deliveryCardTitleToolTipContentType,
    deliveryCardTitleToolTipCtaName,
    dealerName,
    dealerAddress,
    deliveryCardSelectText,
    deliveryCardSelectAriaLabel,
    deliveryCardSelectedText,
    deliveryCardSelectedAriaLabel,
    deliveryUnavailableText,
    deliveryCardContent,
    deliveryUnavailableToolTipText,
    deliveryUnavailableToolTipTitle,
    deliveryUnavailableToolTipAltText,
    deliveryUnavailableToolTipContentType,
    deliveryUnavailableToolTipCtaName,
    enableDeliveryFinancing,
    addToFinanceLabel,
    calculated,
    financeType,
    selectedFinancePlan,
    changeDealerButtonLabel,
    changeDealerButtonAriaLabel,
    selectedDeliveryMethod,
    isDeliveryUnavailable,
    deliveryPostalCodeLabel,
    orderToCartHasSucceeded,
    updateDeliveryOptionsHasSucceeded,
    updateShowCartNotification,
    removeCartNotificationMessages,
    cartId,
    accessToken,
    hasFMAOrGuestGUIDAuth,
    updateDeliveryOptions,
    getDeliveryOptions,
    userCountry,
    accordionContentType,
    accordionExpandCtaName,
    collectionMethodCtaName,
    collectionMethodContentType,
    deliveryMethodCtaName,
    deliveryMethodContentType,
    freeDeliveryLabel,
    dealerSelectLocationInputLabel,
    dealerSelectLocationInputErrorMessage,
    dealerSelectEmptyResultsErrorMessage,
    dealerSelectDropdownDistanceUnitOfMeasure,
    dealerSelectUseMyLocationLabel,
    dealerSelectInternationalCustomerButtonText,
    dealerSelectInternationalCustomerTooltipTitle,
    dealerSelectInternationalCustomerTooltipContent,
    dealerSelectLocationSubmitButtonAriaText,
    dealerSelectInternationalCustomerButtonLink,
    dealerSelectInternationalCustomerButtonLinkQueryParam,
    dealerSearchParams,
    firstMinLeadTime,
    firstMaxLeadTime,
    suggestedDealers,
    dealerSelectAvailabilityPlaceHolder,
    dealerSelectChangeDealerText,
    dealerSelectChangeDealerPath,
    dealerSelectChangeDealerPathQueryParam,
    dealerSelectDealerDistance,
    dealerSelectDealerDistanceCopy,
    deliveryDataDealerDistance,
    dealerSelectSearchByDealerButtonText,
    dealerSelectSearchByDealerButtonLink,
    dealerSelectSearchByDealerButtonLinkQueryParam,
    dealerSelectSearchByDealerSeparator,
    dealerSelectToolTipAriaLabel,
    isDealerSelectEnabled,
    userHasGuestGUID,
    isProfileSuccess,
    getGeoCoordsFromBrowser,
    hasUserLocationFailed,
    clearLocationErrorMessage,
    isDealerized,
    showDealerSelect,
    autoAllocateDealerFromBrowserLocation,
    dealerZipCode,
    autoAllocateDealerHasFailed,
    dealerSearchWarningModalTitle,
    dealerSearchWarningModalBodyContent,
    dealerSearchWarningModalCtaLabel,
    dealerSearchWarningModalCtaAriaLabel,
    checkDealerSearchWarningModal,
  } = props;

  const accordionRef = useRef(null);

  const [
    isAccordionCloseTransitionCompleted,
    setIsAccordionCloseTransitionCompleted,
  ] = useState(!isOpen);

  const onAccordionTransitionEnd = useCallback(() => {
    setIsAccordionCloseTransitionCompleted(!isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!accordionRef.current) {
      return;
    }

    accordionRef.current.addEventListener(
      'transitionend',
      onAccordionTransitionEnd
    );

    return () => {
      accordionRef.current.removeEventListener(
        'transitionend',
        onAccordionTransitionEnd
      );
    };
  }, [onAccordionTransitionEnd]);

  useUpdateAccordionLabel(accordionType, title);

  useRegisterCartAccordion({
    accordionType,
    isRequired,
    alwaysExpandDuringAccordionProgression,
  });

  const isGetDeliveryBeenCalledRef = useRef(false);

  useEffect(() => {
    if (selectedDeliveryMethod && isDealerized) {
      completeCartAccordion({
        accordionType: ACCORDION_TYPES.DEALER_DELIVERY,
      });
    }
  }, [selectedDeliveryMethod, isDealerized]);

  // Pre Order updateDeliveryOptions call needed for getCart to return valid delivery data
  useEffect(() => {
    if (
      hasFMAOrGuestGUIDAuth &&
      orderToCartHasSucceeded &&
      !updateDeliveryOptionsHasSucceeded &&
      cartId
    ) {
      updateDeliveryOptions({
        selectedDeliveryMethod:
          selectedDeliveryMethod || DELIVERY_CARDS_TYPES.COLLECTION,
        deliveryZipcode: customerZipCode,
        deliveryCountry: userCountry,
        addToFinance: false,
      });
    }
  }, [orderToCartHasSucceeded, cartId, hasFMAOrGuestGUIDAuth]);

  // Pre Order getDeliveryOptions call
  useEffect(() => {
    if (
      updateDeliveryOptionsHasSucceeded &&
      orderToCartHasSucceeded &&
      hasFMAOrGuestGUIDAuth &&
      cartId
    ) {
      if (!isGetDeliveryBeenCalledRef.current && accessToken) {
        isGetDeliveryBeenCalledRef.current = true;
        getDeliveryOptions({ accessToken, cartId });
      }
    }
  }, [
    updateDeliveryOptionsHasSucceeded,
    cartId,
    orderToCartHasSucceeded,
    hasFMAOrGuestGUIDAuth,
    accessToken,
  ]);

  // New Order getDeliveryOptions call
  useEffect(() => {
    const unath = Boolean(
      cartId && !isProfileSuccess && userHasGuestGUID && !accessToken
    );
    const auth = Boolean(
      cartId && isProfileSuccess && !userHasGuestGUID && accessToken
    );

    if (
      !isDealerSelectEnabled &&
      !isGetDeliveryBeenCalledRef.current &&
      (unath || auth)
    ) {
      isGetDeliveryBeenCalledRef.current = true;
      getDeliveryOptions({ accessToken, cartId });
    }
  }, [cartId, isProfileSuccess, userHasGuestGUID, accessToken]);

  useEffect(() => {
    if (isOpen && isNextStepsClicked) {
      AnalyticsService.onExpandAccordion(
        accordionContentType,
        accordionExpandCtaName
      );
      nextStepCartAccordion({ accordionType });
      document.getElementById(accordionType).focus();
    }
  }, [isOpen, isNextStepsClicked]);

  const onAccordionClick = () => {
    if (!isOpen) {
      setIsAccordionCloseTransitionCompleted(false);
      AnalyticsService.onExpandAccordion(
        accordionContentType,
        accordionExpandCtaName
      );
    }
  };

  const openClasses = cssClasses('header', {
    open: isOpen,
    closed: !isOpen,
  });

  const cartAccordionClasses = cssClasses('cart-accordion', [accordionType], {
    'no-top-border': hideTopBorder,
    ['show-next-steps']: showNextSteps,
  });

  const accordionPaddingClasses = cssClasses('padding-wrapper', {
    'accordion-expand-height': isOpen,
    'accordion-hidden': isAccordionCloseTransitionCompleted,
  });

  const shouldShowBrowserLocationError = hasUserLocationFailed;

  const browserLocationError = (
    <PageLevelErrorComponent
      actionText="Go Back" // TODO: US2913698: enable this value to be authored
      actionTextAria="Go Back" // TODO: US2913698: enable this value to be authored
      apiMessage={null}
      className="accessory-charging-error-page"
      errorHeader={hasUserLocationFailed}
      message={null}
      onClick={clearLocationErrorMessage}
      showApiMessage={null}
    />
  );

  return (
    <div
      className={cartAccordionClasses}
      role="group"
      aria-labelledby={`${removeSpacesCharacters(title)}-accordionTitle`}
    >
      {shouldShowBrowserLocationError && browserLocationError}
      <button
        id={accordionType}
        data-testid="dealerDeliveryAccordion"
        className={openClasses}
        onClick={() => {
          onClickFunc();
          toggleCartAccordion({ accordionType, isOpen });
          onAccordionClick();
        }}
        aria-expanded={isOpen}
        aria-controls={`${removeSpacesCharacters(title)}-accordionContent`}
      >
        <AccordionStatusContainer
          accordionType={accordionType}
          isRequired={isRequired}
          isShowPaymentStatusDetails={isShowPaymentStatusDetails}
          requiredText={requiredText}
          title={title}
          subtitle={subtitle}
          checkmarkAltText={checkmarkAltText}
          warningAltText={warningAltText}
          termPrefix={termPrefix}
          termSuffix={termSuffix}
          selectedDeliveryMethod={selectedDeliveryMethod}
          planAdded={ppViewCartAddedLabel}
          accordionExpandCtaName={accordionExpandCtaName}
          accordionContentType={accordionContentType}
          deliveryCardTitle={deliveryCardTitle}
          collectionCardTitle={collectionCardTitle}
        />
        <div className="toggle">
          <Arrow
            orientation={isOpen ? ArrowOrientation.UP : ArrowOrientation.DOWN}
          />
        </div>
      </button>
      <div ref={accordionRef} className={accordionPaddingClasses}>
        <div
          className="inner-content"
          id={`${removeSpacesCharacters(title)}-accordionContent`}
        >
          <AccordionSlider>
            <DeliveryCardContainer
              cardType={DELIVERY_CARDS_TYPES.DELIVERY}
              title={deliveryCardTitle}
              name={customerName}
              address={customerAddress}
              zipCode={customerZipCode}
              selectButtonText={deliveryCardSelectText}
              selectButtonAriaLabel={deliveryCardSelectAriaLabel}
              isSelected={
                selectedDeliveryMethod === DELIVERY_CARDS_TYPES.DELIVERY
              }
              selectedText={deliveryCardSelectedText}
              selectedButtonAriaLabel={deliveryCardSelectedAriaLabel}
              isDeliveryUnavailable={isDeliveryUnavailable}
              checkmarkAltText={' '}
              titleToolTipAltText={deliveryCardTitleToolTipAltText}
              titleToolTipTitle={deliveryCardTitleToolTipTitle}
              titleToolTipText={deliveryCardTitleToolTipText}
              titleToolTipOnHover={false}
              deliveryUnavailableText={deliveryUnavailableText}
              deliveryCardContent={deliveryCardContent}
              deliveryUnavailableToolTipText={deliveryUnavailableToolTipText}
              deliveryUnavailableToolTipTitle={deliveryUnavailableToolTipTitle}
              deliveryUnavailableToolTipAltText={
                deliveryUnavailableToolTipAltText
              }
              deliveryUnavailableToolTipOnHover={false}
              addToFinanceLabel={addToFinanceLabel}
              calculated={calculated}
              financeType={financeType}
              selectedFinancePlan={selectedFinancePlan}
              deliveryPostalCodeLabel={deliveryPostalCodeLabel}
              changeDealerButtonText={changeDealerButtonLabel}
              changeDealerButtonAriaLabel={changeDealerButtonAriaLabel}
              ctaName={deliveryMethodCtaName}
              contentType={deliveryMethodContentType}
              titleToolTipCta={deliveryCardTitleToolTipCtaName}
              titleToolTipContentType={deliveryCardTitleToolTipContentType}
              deliveryUnavailableCta={deliveryUnavailableToolTipCtaName}
              deliveryUnavailableContentType={
                deliveryUnavailableToolTipContentType
              }
              freeDeliveryLabel={freeDeliveryLabel}
              enableDeliveryFinancing={enableDeliveryFinancing}
              isDealerized={isDealerized}
              isDealerSelectEnabled={isDealerSelectEnabled}
              showDealerSelect={showDealerSelect}
            />
            <DeliveryCardContainer
              cardType={DELIVERY_CARDS_TYPES.COLLECTION}
              title={collectionCardTitle}
              name={dealerName}
              address={dealerAddress}
              selectButtonText={deliveryCardSelectText}
              selectButtonAriaLabel={deliveryCardSelectAriaLabel}
              isSelected={
                selectedDeliveryMethod === DELIVERY_CARDS_TYPES.COLLECTION
              }
              selectedText={deliveryCardSelectedText}
              selectedButtonAriaLabel={deliveryCardSelectedAriaLabel}
              checkmarkAltText={' '}
              titleToolTipAltText={collectionCardTitleToolTipAltText}
              titleToolTipTitle={collectionCardTitleToolTipTitle}
              titleToolTipText={collectionCardTitleToolTipText}
              collectionCardContent={collectionCardContent}
              titleToolTipOnHover={false}
              ctaName={collectionMethodCtaName}
              contentType={collectionMethodContentType}
              freeDeliveryLabel={freeDeliveryLabel}
              enableDeliveryFinancing={enableDeliveryFinancing}
              isDealerized={isDealerized}
              isDealerSelectEnabled={isDealerSelectEnabled}
              showDealerSelect={showDealerSelect}
            />
          </AccordionSlider>
          {isDealerSelectEnabled && (showDealerSelect || isDealerized) && (
            <DealerSelect
              dealerId={dealerId}
              dealerSearchParams={dealerSearchParams}
              dealerSelectLocationInputLabel={dealerSelectLocationInputLabel}
              dealerSelectLocationInputErrorMessage={
                dealerSelectLocationInputErrorMessage
              }
              dealerSelectEmptyResultsErrorMessage={
                dealerSelectEmptyResultsErrorMessage
              }
              dealerSelectDropdownDistanceUnitOfMeasure={
                dealerSelectDropdownDistanceUnitOfMeasure
              }
              dealerSelectUseMyLocationLabel={dealerSelectUseMyLocationLabel}
              dealerSelectInternationalCustomerButtonText={
                dealerSelectInternationalCustomerButtonText
              }
              dealerSelectInternationalCustomerTooltipTitle={
                dealerSelectInternationalCustomerTooltipTitle
              }
              dealerSelectInternationalCustomerTooltipContent={
                dealerSelectInternationalCustomerTooltipContent
              }
              dealerSelectLocationSubmitButtonAriaText={
                dealerSelectLocationSubmitButtonAriaText
              }
              dealerSelectInternationalCustomerButtonLink={
                dealerSelectInternationalCustomerButtonLink
              }
              dealerSelectInternationalCustomerButtonLinkQueryParam={
                dealerSelectInternationalCustomerButtonLinkQueryParam
              }
              dealerSelectDealerName={dealerName}
              firstMinLeadTime={firstMinLeadTime}
              firstMaxLeadTime={firstMaxLeadTime}
              dealerSelectAvailabilityPlaceHolder={
                dealerSelectAvailabilityPlaceHolder
              }
              dealerSelectChangeDealerText={dealerSelectChangeDealerText}
              dealerSelectChangeDealerPath={dealerSelectChangeDealerPath}
              dealerSelectChangeDealerPathQueryParam={
                dealerSelectChangeDealerPathQueryParam
              }
              dealerSelectToolTipAriaLabel={dealerSelectToolTipAriaLabel}
              dealerSelectDealerDistance={dealerSelectDealerDistance}
              dealerSelectDealerDistanceCopy={dealerSelectDealerDistanceCopy}
              deliveryDataDealerDistance={deliveryDataDealerDistance}
              dealerSelectSearchByDealerButtonText={
                dealerSelectSearchByDealerButtonText
              }
              dealerSelectSearchByDealerButtonLink={
                dealerSelectSearchByDealerButtonLink
              }
              dealerSelectSearchByDealerButtonLinkQueryParam={
                dealerSelectSearchByDealerButtonLinkQueryParam
              }
              dealerSelectSearchByDealerSeparator={
                dealerSelectSearchByDealerSeparator
              }
              suggestedDealers={suggestedDealers}
              getGeoCoordsFromBrowser={getGeoCoordsFromBrowser}
              isDealerized={isDealerized}
              autoAllocateDealerFromBrowserLocation={
                autoAllocateDealerFromBrowserLocation
              }
              selectedDeliveryMethod={selectedDeliveryMethod}
              dealerZipCode={dealerZipCode}
              autoAllocateDealerHasFailed={autoAllocateDealerHasFailed}
              dealerSearchWarningModalTitle={dealerSearchWarningModalTitle}
              dealerSearchWarningModalBodyContent={
                dealerSearchWarningModalBodyContent
              }
              dealerSearchWarningModalCtaLabel={
                dealerSearchWarningModalCtaLabel
              }
              dealerSearchWarningModalCtaAriaLabel={
                dealerSearchWarningModalCtaAriaLabel
              }
              checkDealerSearchWarningModal={checkDealerSearchWarningModal}
              clearLocationErrorMessage={clearLocationErrorMessage}
              updateShowCartNotification={updateShowCartNotification}
              removeCartNotificationMessages={removeCartNotificationMessages}
            />
          )}
        </div>

        {showNextSteps && (
          <div className=" flex jc-center pointer bottom-spacing">
            <button
              className="unbutton"
              onClick={() => skipCartAccordion({ accordionType })}
            >
              <span className="next-steps">{nextStepsText}</span>
              <Arrow
                roundBackground
                includeBackground
                orientation="down"
                color="white"
                className="inline"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealerDeliveryAccordion;
