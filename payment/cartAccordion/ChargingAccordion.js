import React, { useEffect, useRef, useCallback, useState } from 'react';
import cssClasses from 'classnames';
import AccordionSlider from '@Common/accordionSlider/AccordionSlider';
import Arrow, { ArrowOrientation } from '@Common/arrow/Arrow';
import { ACCESSORY_PRODUCT_TYPE } from '@Constants/main';
import { removeSpacesCharacters } from '@Utils/Utils';
import AccordionStatusContainer from './AccordionStatus/AccordionStatusContainer';
import './CartAccordion.scoped.scss';
import './CartAccordion.scss';
import PrimaryButton from '@Common/buttons/button/primaryButton/PrimaryButton';
import { ACCESSORY_CHARGING_STATES } from '@Constants/main';
import RequestQuoteCard from '@Common/requestQuoteCard/RequestQuoteCardContainer';
import ChargingCard from '@Common/accessoryAndChargingCard/AccessoryAndChargingCardContainer';
import AemMultiFieldHelper from '@Utils/aemMultiFieldHelper/AemMultiFieldHelper';
import ConsolidatedIncludedCardContainer from '../../charging/consolidatedincludedCard/ConsolidatedIncludedCardContainer';
import ListAccessoriesAndChargingCardContainer from '@Common/listAccessoriesAndChargingCard/ListAccessoriesAndChargingCardContainer';
import useUpdateAccordionLabel from './useUpdateAccordionLabel';
import useRegisterCartAccordion from './useRegisterCartAccordion';
import AnalyticsService from '../../../services/analyticsService/AnalyticsService';
import CurrencyFormatter from '@Utils/currencyFormatter/CurrencyFormatter';

export const ChargingAccordion = ({
  isFinanceCodeALD,
  isHideChargingWhenLease,
  accordionType,
  accordionTabName,
  accordionContentType,
  accordionExpandCtaName,
  addedChargingCount,
  includedChargingRedux = [],
  chargingCardChargerIncludedLabel,
  chargingCardViewDetailsLabel,
  chargingPreviousImageChevronAriaLabel,
  chargingNextImageChevronAriaLabel,
  chargingFinanceCheckboxText,
  chargingFinanceCheckboxAriaLabel,
  chargingImageAlt,
  chargingImageNotAvailableText,
  chargingButtonLabelRemove,
  chargingAriaLabelRemove,
  chargingModalTitleLabel,
  chargingRrpLabel,
  chargingMsrpLabel,
  chargingDealerSellingPriceLabel,
  chargingButtonLabelAdd,
  chargingAriaLabelAdd,
  chargingBannerLabelAdded,
  chargingQuoteRequestText,
  chargingQuoteRequestPricingDisclaimer,
  chargingFinanceChangeNotice,
  shouldDisplayChargingFinanceChangeNotice,
  isRequestedQuote,
  availableAndAddedChargingRedux = [],
  addedChargingRedux,
  isRequired,
  isShowPaymentStatusDetails,
  incompleteCartAccordion,
  requiredText,
  title,
  subtitle,
  isOpen = true,
  isNextStepsClicked,
  isComplete,
  checkmarkAltText,
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
  getAccessories,
  ppViewCartAddedLabel,
  chargingPageButtonText,
  chargingPageButtonAriaLabel,
  chargingPageButtonUrl,
  chargingPageButtonOpenUrlIn,
  completeCartAccordion,
  dependencyModalTitleLabel,
  dependencyModalHeaderAdd,
  dependencyModalHeaderRemove,
  dependencyModalSubHeaderAdd,
  dependencyModalSubHeaderRemove,
  dependencyModalPriceDifferenceLabel,
  dependencyModalWillAddLabel,
  dependencyModalWillRemoveLabel,
  dependencyModalAddLabel,
  dependencyModalRemoveLabel,
  dependencyModalCloseAriaDescription,
  dependencyModalConfirmButtonLabel,
  dependencyModalConfirmButtonAriaLabel,
  dependencyModalCancelButtonLabel,
  dependencyModalCancelButtonAriaLabel,
  selectedDeliveryMethod,
  prevOptionAlt,
  nextOptionAlt,
  cartId,
  cqPath,
  RequestQuoteCardTitleLabel,
  RequestQuoteCardRequestQuoteCardImageUrl,
  RequestQuoteCardRequestQuoteCardName,
  RequestQuoteCardViewDetailsLabel,
  RequestQuoteCardButtonRequestLabel,
  RequestQuoteCardButtonCancelLabel,
  RequestQuoteCardAriaLabelRequest,
  RequestQuoteCardAriaLabelCancel,
  RequestQuoteStartingPriceLabel,
  RequestQuoteStartingPrice,
  RequestQuoteCardDescription,
  RequestQuoteToolTipText,
  requestCardDetailModalDisclaimer,
  requestQuoteOverlayDescription,
  consolidatedHeader,
  consolidatedDescription,
  consolidatedButtonText,
  consolidatedButtonAriaLabel,
  consolidatedButtonUrl,
  consolidatedButtonOpenUrlIn,
  consolidatedAltImageText,
  partNumberLabel,
  subtitleClose,
  chargingDisplaySavings,
  chargingSaveLabel,
  requestChargingQuoteCtaData,
  removeChargingQuoteCtaData,
  chargingDetailQuoteContentType,
  chargingAccordionQuoteContentType,
  removeChargingFinanceCtaData,
  addChargingFinanceCtaData,
  chargingById,
  accessoriesById,
  chargingTotalPrice,
  alwaysExpandDuringAccordionProgression,
  acceptConflictCtaNameAnalytics,
  declineConflictCtaNameAnalytics,
  conflictOverlayContentTypeAnalytics,
  accessToken,
  userHasGuestGUID,
  isProfileSuccess,
  featureImageURLs,
}) => {
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

  useEffect(() => {
    const unath = Boolean(
      cartId && !isProfileSuccess && userHasGuestGUID && !accessToken
    );
    const auth = Boolean(
      cartId && isProfileSuccess && !userHasGuestGUID && accessToken
    );

    if (unath || auth) {
      getAccessories({
        productType: ACCESSORY_PRODUCT_TYPE.CHARGING,
        orderCode: cartId,
      });
    }
  }, [cartId, isProfileSuccess, userHasGuestGUID, accessToken]);

  useEffect(() => {
    if (addedChargingCount && !isComplete && !isOpen) {
      completeCartAccordion({ accordionType });
    }
    if (!addedChargingCount && isComplete) {
      incompleteCartAccordion({ accordionType });
    }
  }, [addedChargingCount, isOpen]);

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

  const interContentClasses = cssClasses('inner-content', {
    'no-flex': isComplete,
  });

  const chargingAccessoriesPageCtaClasses = cssClasses(
    'charging-accessories-page-cta',
    {
      'top-spacing': isComplete,
    }
  );

  const accordionPaddingClasses = cssClasses('padding-wrapper', {
    'accordion-expand-height': isOpen,
    'accordion-hidden': isAccordionCloseTransitionCompleted && !isOpen,
  });

  const storeAnalyticsData = () => {
    window.sessionStorage.setItem('chargingAccordionTabName', accordionTabName);
  };
  const getChargingAnalytics = (showOverlay) => {
    const contentType = showOverlay
      ? chargingDetailQuoteContentType
      : chargingAccordionQuoteContentType;
    if (isRequestedQuote) {
      AnalyticsService.chargingRequestOrRemoveQuote({
        contentTypes: contentType,
        ctaAnalyticsData: removeChargingQuoteCtaData,
      });
    } else {
      AnalyticsService.chargingRequestOrRemoveQuote({
        contentTypes: contentType,
        ctaAnalyticsData: requestChargingQuoteCtaData,
      });
    }
  };

  const chargingCard = AemMultiFieldHelper.getMultiFieldProps(
    cqPath + '/chargingIncludedCards'
  );

  const chargingChildren = [];
  if (includedChargingRedux.length + chargingCard.length >= 3) {
    chargingChildren.push(
      <ConsolidatedIncludedCardContainer
        key={chargingChildren.length}
        consolidatedHeader={consolidatedHeader}
        consolidatedDescription={consolidatedDescription}
        consolidatedIncludedCardsLength={
          chargingCard.length + includedChargingRedux.length
        }
        consolidatedButtonText={consolidatedButtonText}
        consolidatedButtonAriaLabel={consolidatedButtonAriaLabel}
        consolidatedButtonUrl={consolidatedButtonUrl}
        consolidatedButtonOpenUrlIn={consolidatedButtonOpenUrlIn}
        consolidatedAltImageText={consolidatedAltImageText}
      />
    );
  } else {
    chargingCard.forEach((card, index) => {
      chargingChildren.push(
        <ChargingCard
          code={card.code}
          key={index}
          isChargerIncluded={true}
          isFinancingAvailable={false}
          cardImageList={featureImageURLs[card.code]}
          cardName={card?.chargingCardName}
          cardDescription={card?.chargingCardModalDescription}
          chargingCardDescription={card?.chargingCardIncludedDescription}
          chargingCardMediumDesc={card?.mediumDescription}
          partId={card?.chargingCardPartId}
          chargerIncludedLabel={chargingCardChargerIncludedLabel}
          viewDetailsLabel={chargingCardViewDetailsLabel}
          noImageLabel={chargingImageNotAvailableText}
          partNumberLabel={partNumberLabel}
          productType={ACCESSORY_PRODUCT_TYPE.CHARGING}
          accordionTabName={accordionTabName}
          accordionContentType={accordionContentType}
          accordionExpandCtaName={accordionExpandCtaName}
          displaySavings={chargingDisplaySavings}
          saveLabel={chargingSaveLabel}
        />
      );
    });
    includedChargingRedux.forEach((card, index) => {
      chargingChildren.push(
        <ChargingCard
          code={card.code}
          key={index}
          isChargerIncluded={true}
          isFinancingAvailable={false}
          cardImageList={featureImageURLs[card.code]}
          cardName={card?.shortDescription}
          cardDescription={card?.longDescription}
          chargingCardDescription={card?.longDescription}
          partId={card?.mappedPartId}
          chargerIncludedLabel={chargingCardChargerIncludedLabel}
          viewDetailsLabel={chargingCardViewDetailsLabel}
          noImageLabel={chargingImageNotAvailableText}
          partNumberLabel={partNumberLabel}
          accordionTabName={accordionTabName}
          productType={ACCESSORY_PRODUCT_TYPE.CHARGING}
          accordionContentType={accordionContentType}
          displaySavings={chargingDisplaySavings}
          saveLabel={chargingSaveLabel}
        />
      );
    });
  }
  if (
    RequestQuoteCardRequestQuoteCardName &&
    !(isFinanceCodeALD && isHideChargingWhenLease)
  ) {
    chargingChildren.push(
      <RequestQuoteCard
        key={chargingChildren.length}
        titleLabel={RequestQuoteCardTitleLabel}
        cardImageUrl={RequestQuoteCardRequestQuoteCardImageUrl}
        alt={RequestQuoteCardRequestQuoteCardName}
        viewDetailsLabel={RequestQuoteCardViewDetailsLabel}
        buttonRequestLabel={RequestQuoteCardButtonRequestLabel}
        buttonCancelLabel={RequestQuoteCardButtonCancelLabel}
        ariaLabelRequest={RequestQuoteCardAriaLabelRequest}
        ariaLabelCancel={RequestQuoteCardAriaLabelCancel}
        startingPriceLabel={RequestQuoteStartingPriceLabel}
        startingPrice={RequestQuoteStartingPrice}
        cardName={RequestQuoteCardRequestQuoteCardName}
        cardDescription={RequestQuoteCardDescription}
        toolTipText={RequestQuoteToolTipText}
        requestCardDetailModalDisclaimer={requestCardDetailModalDisclaimer}
        overlayDescription={requestQuoteOverlayDescription}
        getChargingAnalytics={getChargingAnalytics}
      />
    );
  }
  if (
    chargingChildren.length < 3 &&
    !(isFinanceCodeALD && isHideChargingWhenLease)
  ) {
    availableAndAddedChargingRedux.slice(0, 3).forEach((card) => {
      chargingChildren.push(
        <ChargingCard
          cardImageList={featureImageURLs[card?.code]}
          rrpPrice={card.msrp}
          financeType={card?.financeData?.financeType}
          cardInfo={card}
          key={card.code}
          code={card.code}
          productType={ACCESSORY_PRODUCT_TYPE.CHARGING}
          accessoriesPrice={
            card.dealerSellingPrice ? card.dealerSellingPrice : card.msrp
          }
          cardName={card?.shortDescription}
          cardDescription={card?.longDescription}
          chargingCardDescription={card?.longDescription}
          partId={card?.mappedPartId}
          isCardAdded={card?.state === ACCESSORY_CHARGING_STATES.ADDED}
          rrpLabel={chargingRrpLabel}
          msrpLabel={chargingMsrpLabel}
          isFinancingAvailable={!!chargingFinanceCheckboxText}
          payWithFinanceLabel={chargingFinanceCheckboxText}
          payWithFinanceAriaLabel={chargingFinanceCheckboxAriaLabel}
          previousImageChevronAriaLabel={chargingPreviousImageChevronAriaLabel}
          nextImageChevronAriaLabel={chargingNextImageChevronAriaLabel}
          viewDetailsLabel={chargingCardViewDetailsLabel}
          buttonLabelAdd={chargingButtonLabelAdd}
          ariaLabelAdd={chargingAriaLabelAdd}
          bannerLabelAdded={chargingBannerLabelAdded}
          buttonLabelRemove={chargingButtonLabelRemove}
          ariaLabelRemove={chargingAriaLabelRemove}
          dealerSellingPriceLabel={chargingDealerSellingPriceLabel}
          titleLabel={chargingModalTitleLabel}
          noImageLabel={chargingImageNotAvailableText}
          confirmChangesLabel={dependencyModalTitleLabel}
          dependencyModalHeaderAdd={dependencyModalHeaderAdd}
          dependencyModalHeaderRemove={dependencyModalHeaderRemove}
          dependencyModalSubHeaderRemove={dependencyModalSubHeaderRemove}
          dependencyModalSubHeaderAdd={dependencyModalSubHeaderAdd}
          priceDifferenceLabel={dependencyModalPriceDifferenceLabel}
          willAddLabel={dependencyModalWillAddLabel}
          willRemoveLabel={dependencyModalWillRemoveLabel}
          addLabel={dependencyModalAddLabel}
          removeLabel={dependencyModalRemoveLabel}
          closeAriaDescription={dependencyModalCloseAriaDescription}
          confirmButtonLabel={dependencyModalConfirmButtonLabel}
          confirmButtonAriaLabel={dependencyModalConfirmButtonAriaLabel}
          cancelButtonLabel={dependencyModalCancelButtonLabel}
          cancelButtonAriaLabel={dependencyModalCancelButtonAriaLabel}
          partNumberLabel={partNumberLabel}
          accordionTabName={accordionTabName}
          accordionContentType={accordionContentType}
          bslState={card?.bslState}
          displaySavings={chargingDisplaySavings}
          saveLabel={chargingSaveLabel}
          removeFinanceCtaData={removeChargingFinanceCtaData}
          addFinanceCtaData={addChargingFinanceCtaData}
          chargingContentType={chargingAccordionQuoteContentType}
          chargingDetailOverlay={chargingDetailQuoteContentType}
          chargingById={chargingById}
          accessoriesById={accessoriesById}
          monthlyPaymentPriceLabel={termSuffix}
          pricePerMonth={card.monthlyPayment}
          acceptConflictCtaNameAnalytics={acceptConflictCtaNameAnalytics}
          declineConflictCtaNameAnalytics={declineConflictCtaNameAnalytics}
          conflictOverlayContentTypeAnalytics={
            conflictOverlayContentTypeAnalytics
          }
        />
      );
    });
  }

  const getTotalFormattedPrice = () => {
    if (chargingTotalPrice) {
      return CurrencyFormatter.formatPrice({
        price: chargingTotalPrice,
      });
    }
  };

  return (
    <div
      className={cartAccordionClasses}
      role="group"
      aria-labelledby={`${removeSpacesCharacters(title)}-accordionTitle`}
    >
      <button
        id={accordionType}
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
          subtitleClose={subtitleClose}
          total={getTotalFormattedPrice()}
        />
        <div className="toggle">
          <Arrow
            orientation={isOpen ? ArrowOrientation.UP : ArrowOrientation.DOWN}
          />
        </div>
      </button>
      <div ref={accordionRef} className={accordionPaddingClasses}>
        <div className="status-messages__container">
          {shouldDisplayChargingFinanceChangeNotice && (
            <p className="status-messages__message">
              {chargingFinanceChangeNotice}
            </p>
          )}
        </div>
        <div
          className={interContentClasses}
          id={`${removeSpacesCharacters(title)}-accordionContent`}
        >
          {!isComplete && (
            <>
              <AccordionSlider
                prevOptionAlt={prevOptionAlt}
                nextOptionAlt={nextOptionAlt}
              >
                {chargingChildren.slice(0, 3)}
              </AccordionSlider>
            </>
          )}
          {isComplete && (
            <>
              {chargingCard.map((card, index) => (
                <ListAccessoriesAndChargingCardContainer
                  key={index}
                  code={card?.code}
                  cardImageList={featureImageURLs[card?.code]}
                  cardName={card?.chargingCardName}
                  cardDescription={card?.chargingCardModalDescription}
                  chargingCardDescription={
                    card?.chargingCardIncludedDescription
                  }
                  partId={card?.chargingCardPartId}
                  productType={ACCESSORY_PRODUCT_TYPE.CHARGING}
                  isChargerIncluded={true}
                  chargerIncludedLabel={chargingCardChargerIncludedLabel}
                  previousImageChevronAriaLabel={
                    chargingPreviousImageChevronAriaLabel
                  }
                  nextImageChevronAriaLabel={chargingNextImageChevronAriaLabel}
                  imageAlt={chargingImageAlt}
                  modalTitleLabel={chargingModalTitleLabel}
                  partNumberLabel={partNumberLabel}
                  accordionTabName={accordionTabName}
                  accordionContentType={accordionContentType}
                  addedProducts={addedChargingRedux}
                />
              ))}
              {includedChargingRedux.map((card, index) => (
                <ListAccessoriesAndChargingCardContainer
                  key={index}
                  code={card?.code}
                  cardImageList={featureImageURLs[card?.code]}
                  cardName={card?.shortDescription}
                  partId={card?.mappedPartId}
                  cardDescription={card?.longDescription}
                  chargingCardDescription={card?.longDescription}
                  productType={ACCESSORY_PRODUCT_TYPE.CHARGING}
                  isChargerIncluded={true}
                  chargerIncludedLabel={chargingCardChargerIncludedLabel}
                  previousImageChevronAriaLabel={
                    chargingPreviousImageChevronAriaLabel
                  }
                  nextImageChevronAriaLabel={chargingNextImageChevronAriaLabel}
                  imageAlt={chargingImageAlt}
                  modalTitleLabel={chargingModalTitleLabel}
                  partNumberLabel={partNumberLabel}
                  accordionTabName={accordionTabName}
                  accordionContentType={accordionContentType}
                  addedProducts={addedChargingRedux}
                />
              ))}
              {isRequestedQuote && (
                <ListAccessoriesAndChargingCardContainer
                  cardImageList={[RequestQuoteCardRequestQuoteCardImageUrl]}
                  cardName={RequestQuoteCardRequestQuoteCardName}
                  cardDescription={RequestQuoteCardDescription}
                  isRequestQuote={true}
                  chargingQuoteRequestText={chargingQuoteRequestText}
                  dealerSellingPriceLabel={RequestQuoteStartingPriceLabel}
                  dealerSellingPriceValue={RequestQuoteStartingPrice}
                  chargingQuoteRequestPricingDisclaimer={
                    chargingQuoteRequestPricingDisclaimer
                  }
                  productType={ACCESSORY_PRODUCT_TYPE.CHARGING}
                  removeButtonText={chargingButtonLabelRemove}
                  removeButtonAriaLabel={chargingAriaLabelRemove}
                  previousImageChevronAriaLabel={
                    chargingPreviousImageChevronAriaLabel
                  }
                  nextImageChevronAriaLabel={chargingNextImageChevronAriaLabel}
                  imageAlt={chargingImageAlt}
                  modalTitleLabel={chargingModalTitleLabel}
                  partNumberLabel={partNumberLabel}
                  accordionTabName={accordionTabName}
                  accordionContentType={accordionContentType}
                  addedProducts={addedChargingRedux}
                />
              )}
              {addedChargingRedux.map((card, index) => (
                <ListAccessoriesAndChargingCardContainer
                  key={index}
                  accessory={card}
                  cardImageList={featureImageURLs[card?.code]}
                  cardName={card?.shortDescription}
                  partId={card?.mappedPartId}
                  cardDescription={card?.longDescription}
                  chargingCardDescription={card?.longDescription}
                  productType={ACCESSORY_PRODUCT_TYPE.CHARGING}
                  dealerSellingPriceLabel={
                    card.dealerSellingPrice
                      ? chargingDealerSellingPriceLabel
                      : chargingMsrpLabel
                  }
                  dealerSellingPriceValue={
                    card.dealerSellingPrice
                      ? card.dealerSellingPrice
                      : card.msrp
                  }
                  removeButtonText={chargingButtonLabelRemove}
                  removeButtonAriaLabel={chargingAriaLabelRemove}
                  previousImageChevronAriaLabel={
                    chargingPreviousImageChevronAriaLabel
                  }
                  nextImageChevronAriaLabel={chargingNextImageChevronAriaLabel}
                  imageAlt={chargingImageAlt}
                  modalTitleLabel={chargingModalTitleLabel}
                  isFinancingAvailable={!!chargingFinanceCheckboxText}
                  payWithFinanceLabel={chargingFinanceCheckboxText}
                  payWithFinanceAriaLabel={chargingFinanceCheckboxAriaLabel}
                  financeType={card?.financeData?.financeType}
                  code={card.code}
                  isCardAdded={true}
                  confirmChangesLabel={dependencyModalTitleLabel}
                  dependencyModalHeaderAdd={dependencyModalHeaderAdd}
                  dependencyModalHeaderRemove={dependencyModalHeaderRemove}
                  dependencyModalSubHeaderRemove={
                    dependencyModalSubHeaderRemove
                  }
                  dependencyModalSubHeaderAdd={dependencyModalSubHeaderAdd}
                  priceDifferenceLabel={dependencyModalPriceDifferenceLabel}
                  willAddLabel={dependencyModalWillAddLabel}
                  willRemoveLabel={dependencyModalWillRemoveLabel}
                  addLabel={dependencyModalAddLabel}
                  removeLabel={dependencyModalRemoveLabel}
                  closeAriaDescription={dependencyModalCloseAriaDescription}
                  confirmButtonLabel={dependencyModalConfirmButtonLabel}
                  confirmButtonAriaLabel={dependencyModalConfirmButtonAriaLabel}
                  cancelButtonLabel={dependencyModalCancelButtonLabel}
                  cancelButtonAriaLabel={dependencyModalCancelButtonAriaLabel}
                  partNumberLabel={partNumberLabel}
                  bslState={card?.bslState}
                  accordionTabName={accordionTabName}
                  accordionContentType={accordionContentType}
                  addedProducts={addedChargingRedux}
                  pricePerMonth={card.monthlyPayment}
                  showMonthlyPrice={false}
                />
              ))}
            </>
          )}
        </div>

        <div className={chargingAccessoriesPageCtaClasses}>
          <PrimaryButton
            text={chargingPageButtonText}
            ariaLabel={chargingPageButtonAriaLabel}
            theme="light"
            chevron="no"
            position="center"
            url={chargingPageButtonUrl}
            openUrlIn={chargingPageButtonOpenUrlIn}
            handleClick={storeAnalyticsData}
          />
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

export default ChargingAccordion;
