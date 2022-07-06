import React, { useCallback, useEffect, useRef, useState } from 'react';
import cssClasses from 'classnames';
import AccordionSlider from '@Common/accordionSlider/AccordionSlider';
import Arrow, { ArrowOrientation } from '@Common/arrow/Arrow';
import { ACCESSORY_PRODUCT_TYPE } from '@Constants/main';
import { getAccessoryImageList } from '@Utils/Utils';
import { removeSpacesCharacters } from '@Utils/Utils';
import AccordionStatusContainer from './AccordionStatus/AccordionStatusContainer';
import './CartAccordion.scoped.scss';
import './CartAccordion.scss';
import PrimaryButton from '@Common/buttons/button/primaryButton/PrimaryButton';
import { ACCESSORY_CHARGING_STATES } from '@Constants/main';
import AccessoriesCard from '@Common/accessoryAndChargingCard/AccessoryAndChargingCardContainer';
import ListAccessoriesAndChargingCardContainer from '@Common/listAccessoriesAndChargingCard/ListAccessoriesAndChargingCardContainer';
import useUpdateAccordionLabel from './useUpdateAccordionLabel';
import useRegisterCartAccordion from './useRegisterCartAccordion';
import ConsolidatedIncludedCardContainer from '../../charging/consolidatedincludedCard/ConsolidatedIncludedCardContainer';
import { useSelector } from 'react-redux';
import { getAccessoriesTotalPrice } from '@Ducks/accessories/selectors';
import CurrencyFormatter from '@Utils/currencyFormatter/CurrencyFormatter';
import AnalyticsService from '../../../services/analyticsService/AnalyticsService';

export const AccessoriesAccordion = (props) => {
  const {
    accordionType,
    accordionContentType,
    accordionExpandCtaName,
    accessoriesPageButtonText,
    accessoriesPageButtonAriaLabel,
    accessoriesPageButtonUrl,
    accessoriesPageButtonOpenUrlIn,
    accessoriesDealerSellingPriceLabel,
    accessoriesButtonLabelRemove,
    accessoriesAriaLabelRemove,
    accessoriesPreviousImageChevronAriaLabel,
    accessoriesNextImageChevronAriaLabel,
    accessoriesImageAlt,
    accessoriesImageNotAvailableText,
    accessoriesModalTitleLabel,
    accessoriesFinanceCheckboxText,
    accessoriesFinanceCheckboxAriaLabel,
    accessoriesButtonAdded,
    accessoriesAriaLabelAdded,
    accessoriesBannerLabelAdded,
    accessoriesViewDetailsLabel,
    accessoriesRrpLabel,
    accessoriesMsrpLabel,
    addedAccessories,
    addedAccessoriesCount,
    isRequired,
    isShowPaymentStatusDetails,
    incompleteCartAccordion,
    featureImageURLs = [],
    requiredText,
    firstThreeAccessories,
    title,
    subtitle,
    isOpen = true,
    isNextStepsClicked,
    isComplete,
    checkmarkAltText,
    hideTopBorder,
    warningAltText,
    termPrefix = 'For',
    termSuffix,
    toggleCartAccordion = () => {},
    showNextSteps = false,
    onClickFunc = () => {},
    nextStepsText = 'Next Steps',
    skipCartAccordion = () => {},
    nextStepCartAccordion = () => {},
    getAccessories,
    ppViewCartAddedLabel,
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
    partNumberLabel,
    dealerInstalledOptionsHeader,
    dealerInstalledOptionsDescription,
    dealerInstalledOptionsButtonText,
    dealerInstalledOptionsButtonAriaLabel,
    dealerInstalledOptionsButtonUrl,
    dealerInstalledOptionsButtonOpenUrlIn,
    dealerInstalledOptionsAltImageText,
    optionItems,
    dealerInstalledOptionsVdmDis,
    dealerInstalledOptionsAccDis,
    dealerInstalledOptionsSecondPartDescription,
    subtitleClose,
    accessoryDisplaySavings,
    accessorySaveLabel,
    removeAccessoryFinanceCtaData,
    addAccessoryFinanceCtaData,
    accessoryAccordionContentType,
    accessoryDetailOverlayContentType,
    chargingById,
    accessoriesById,
    alwaysExpandDuringAccordionProgression,
    acceptConflictCtaNameAnalytics,
    declineConflictCtaNameAnalytics,
    conflictOverlayContentTypeAnalytics,
    accordionTabName,
    accessToken,
    userHasGuestGUID,
    isProfileSuccess,
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

  const setTotalPriceFormat = (total) => {
    if (total) {
      return CurrencyFormatter.formatPrice({ price: total });
    }
  };

  useEffect(() => {
    const unath = Boolean(
      cartId && !isProfileSuccess && userHasGuestGUID && !accessToken
    );
    const auth = Boolean(
      cartId && isProfileSuccess && !userHasGuestGUID && accessToken
    );

    if (unath || auth) {
      getAccessories({
        productType: ACCESSORY_PRODUCT_TYPE.ACCESSORY,
        orderCode: cartId,
      });
    }
  }, [cartId, isProfileSuccess, userHasGuestGUID, accessToken]);

  useEffect(() => {
    if (addedAccessoriesCount && !isComplete && !isOpen) {
      completeCartAccordion({ accordionType });
    }
    if (!addedAccessoriesCount && isComplete) {
      incompleteCartAccordion({ accordionType });
    }
  }, [addedAccessoriesCount, isOpen]);

  useEffect(() => {
    if (isOpen && isNextStepsClicked) {
      AnalyticsService.onExpandAccordion(
        accordionContentType,
        accordionExpandCtaName
      );
      nextStepCartAccordion({ accordionType });
      document.getElementById(accordionType).focus();
    }
  }, [isOpen]);

  const onAccordionClick = () => {
    if (!isOpen) {
      setIsAccordionCloseTransitionCompleted(false);
      AnalyticsService.onExpandAccordion(
        accordionContentType,
        accordionExpandCtaName
      );
    }
  };

  const accessoriesChildren = [];
  if (optionItems.length > 0) {
    accessoriesChildren.push(
      <ConsolidatedIncludedCardContainer
        consolidatedHeader={dealerInstalledOptionsHeader}
        dealerInstalledOptionsDescription={dealerInstalledOptionsDescription}
        dealerInstalledOptionsIncludedCardsLength={optionItems.length}
        consolidatedButtonText={dealerInstalledOptionsButtonText}
        consolidatedButtonAriaLabel={dealerInstalledOptionsButtonAriaLabel}
        consolidatedButtonUrl={dealerInstalledOptionsButtonUrl}
        consolidatedButtonOpenUrlIn={dealerInstalledOptionsButtonOpenUrlIn}
        consolidatedAltImageText={dealerInstalledOptionsAltImageText}
        dealerInstalledOptionsVdmDis={dealerInstalledOptionsVdmDis}
        dealerInstalledOptionsAccDis={dealerInstalledOptionsAccDis}
        dealerInstalledOptionsSecondPartDescription={
          dealerInstalledOptionsSecondPartDescription
        }
      />
    );
  }
  firstThreeAccessories.forEach((accessory) => {
    accessoriesChildren.push(
      <AccessoriesCard
        cardInfo={accessory}
        cardImageList={featureImageURLs[accessory.code]}
        dataAccessoryCode={accessory.code}
        rrpPrice={accessory.msrp}
        financeType={accessory?.financeData?.financeType}
        key={accessory.code}
        code={accessory.code}
        productType={ACCESSORY_PRODUCT_TYPE.ACCESSORY}
        accessoriesPrice={
          accessory.dealerSellingPrice
            ? accessory.dealerSellingPrice
            : accessory.msrp
        }
        cardName={accessory?.shortDescription}
        cardDescription={accessory?.longDescription}
        partId={accessory?.mappedPartId}
        pricePerMonth={accessory.monthlyPayment}
        isCardAdded={accessory?.state === ACCESSORY_CHARGING_STATES.ADDED}
        rrpLabel={accessoriesRrpLabel}
        msrpLabel={accessoriesMsrpLabel}
        monthlyPaymentPriceLabel={termSuffix}
        isFinancingAvailable={!!accessoriesFinanceCheckboxText}
        payWithFinanceLabel={accessoriesFinanceCheckboxText}
        payWithFinanceAriaLabel={accessoriesFinanceCheckboxAriaLabel}
        previousImageChevronAriaLabel={accessoriesPreviousImageChevronAriaLabel}
        nextImageChevronAriaLabel={accessoriesNextImageChevronAriaLabel}
        viewDetailsLabel={accessoriesViewDetailsLabel}
        buttonLabelAdd={accessoriesButtonAdded}
        ariaLabelAdd={accessoriesAriaLabelAdded}
        bannerLabelAdded={accessoriesBannerLabelAdded}
        buttonLabelRemove={accessoriesButtonLabelRemove}
        ariaLabelRemove={accessoriesAriaLabelRemove}
        dealerSellingPriceLabel={accessoriesDealerSellingPriceLabel}
        titleLabel={accessoriesModalTitleLabel}
        noImageLabel={accessoriesImageNotAvailableText}
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
        bslState={accessory?.bslState}
        displaySavings={accessoryDisplaySavings}
        saveLabel={accessorySaveLabel}
        removeFinanceCtaData={removeAccessoryFinanceCtaData}
        addFinanceCtaData={addAccessoryFinanceCtaData}
        accessoryCardContentType={accessoryAccordionContentType}
        detailsOverlayContentType={accessoryDetailOverlayContentType}
        chargingById={chargingById}
        accessoriesById={accessoriesById}
        acceptConflictCtaNameAnalytics={acceptConflictCtaNameAnalytics}
        declineConflictCtaNameAnalytics={declineConflictCtaNameAnalytics}
        conflictOverlayContentTypeAnalytics={
          conflictOverlayContentTypeAnalytics
        }
        accordionTabName={accordionTabName}
      />
    );
  });

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

  const accordionCloseClasses = cssClasses({
    'accordion-hidden': isAccordionCloseTransitionCompleted,
  });

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
          className={accordionCloseClasses}
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
          total={setTotalPriceFormat(useSelector(getAccessoriesTotalPrice))}
        />
        <div className="toggle">
          <Arrow
            orientation={isOpen ? ArrowOrientation.UP : ArrowOrientation.DOWN}
          />
        </div>
      </button>
      <div
        ref={accordionRef}
        className={accordionPaddingClasses}
        aria-hidden={!isOpen}
      >
        <div
          className={interContentClasses}
          id={`${removeSpacesCharacters(title)}-accordionContent`}
        >
          {isComplete && (
            <>
              {addedAccessories.map((accessory) => (
                <ListAccessoriesAndChargingCardContainer
                  cardImageList={getAccessoryImageList(accessory)}
                  key={accessory.code}
                  accessory={accessory}
                  cardName={accessory?.shortDescription}
                  partId={accessory?.mappedPartId}
                  cardDescription={accessory?.longDescription}
                  dealerSellingPriceValue={
                    accessory.dealerSellingPrice
                      ? accessory.dealerSellingPrice
                      : accessory.msrp
                  }
                  productType={ACCESSORY_PRODUCT_TYPE.ACCESSORY}
                  dealerSellingPriceLabel={
                    accessory.dealerSellingPrice
                      ? accessoriesDealerSellingPriceLabel
                      : accessoriesMsrpLabel
                  }
                  removeButtonText={accessoriesButtonLabelRemove}
                  removeButtonAriaLabel={accessoriesAriaLabelRemove}
                  monthlyPaymentPriceLabel={termSuffix}
                  pricePerMonth={accessory.monthlyPayment}
                  showMonthlyPrice={false}
                  previousImageChevronAriaLabel={
                    accessoriesPreviousImageChevronAriaLabel
                  }
                  nextImageChevronAriaLabel={
                    accessoriesNextImageChevronAriaLabel
                  }
                  imageAlt={accessoriesImageAlt}
                  modalTitleLabel={accessoriesModalTitleLabel}
                  financeCheckboxText={accessoriesFinanceCheckboxText}
                  isFinancingAvailable={!!accessoriesFinanceCheckboxText}
                  payWithFinanceLabel={accessoriesFinanceCheckboxText}
                  payWithFinanceAriaLabel={accessoriesFinanceCheckboxAriaLabel}
                  financeType={accessory?.financeData?.financeType}
                  code={accessory.code}
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
                  bslState={accessory?.bslState}
                  addedProducts={addedAccessories}
                />
              ))}
            </>
          )}
          {!isComplete && (
            <>
              <AccordionSlider
                prevOptionAlt={prevOptionAlt}
                nextOptionAlt={nextOptionAlt}
              >
                {accessoriesChildren.slice(0, 3)}
              </AccordionSlider>
            </>
          )}
        </div>

        <div className={chargingAccessoriesPageCtaClasses}>
          <PrimaryButton
            text={accessoriesPageButtonText}
            ariaLabel={accessoriesPageButtonAriaLabel}
            theme="light"
            chevron="no"
            position="center"
            url={accessoriesPageButtonUrl}
            openUrlIn={accessoriesPageButtonOpenUrlIn}
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

export default AccessoriesAccordion;
