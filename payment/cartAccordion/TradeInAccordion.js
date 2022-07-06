import React, { useEffect, useRef, useCallback, useState } from 'react';
import cssClasses from 'classnames';
import { useSelector } from 'react-redux';
import AccordionSlider from '@Common/accordionSlider/AccordionSlider';
import Arrow, { ArrowOrientation } from '@Common/arrow/Arrow';
import useRegisterCartAccordion from './useRegisterCartAccordion';
import { removeSpacesCharacters } from '@Utils/Utils';
import AccordionStatusContainer from './AccordionStatus/AccordionStatusContainer';
import TradeInBaseballCardContainer from '../../cart/tradeInBaseballCard/TradeInBaseballCardContainer';
import useUpdateAccordionLabel from './useUpdateAccordionLabel';
import './CartAccordion.scoped.scss';
import './CartAccordion.scss';
import { ACCORDION_TYPES } from '@Constants/main';
import TradeInIntro from 'components/cart/tradeInIntro/TradeInIntro';
import AnalyticsService from '../../../services/analyticsService/AnalyticsService';
import CurrencyFormatter from '@Utils/currencyFormatter/CurrencyFormatter';
import FDSActivitySpinner from '@FDS/activitySpinner/FDSActivitySpinner';
import { getTradeInLoader, getAppraisalId } from '@Ducks/tradeInData/selectors';
import TradeInOverageModal from '../../cart/modals/tradeIn/TradeInOverageModal';
import { getOrderCode } from '@Ducks/pricingInformation/selectors';
import { PLAN_CODES } from '@Constants/calculator';
import TradeInDealerModal from '../../cart/modals/tradeIn/TradeInDealerModal';

export const TradeInAccordion = ({
  accordionType,
  calculated,
  checkmarkAltText,
  completeCartAccordion = () => {},
  hideTopBorder,
  incompleteCartAccordion = () => {},
  isComplete,
  isOpen = true,
  isNextStepsClicked = false,
  isRequired,
  isShowPaymentStatusDetails,
  nextOptionAlt,
  nextStepsText,
  onClickFunc = () => {},
  ppViewCartAddedLabel,
  prevOptionAlt,
  requiredText,
  selectedDeliveryMethod,
  showNextSteps = false,
  skipCartAccordion = () => {},
  nextStepCartAccordion = () => {},
  subtitle,
  subtitleClose,
  termPrefix,
  termSuffix,
  title,
  toggleCartAccordion = () => {},
  tradeInBaseballCardApplyToFinanceLabel,
  tradeInBaseballCardAppraisalValueLabel,
  tradeInBaseballCardBalanceOwedLabel,
  tradeInBaseballCardUpdateCtaAriaLabel,
  tradeInBaseballCardUpdateCtaLabel,
  tradeInBaseballCardDeselectButtonAriaLabel,
  tradeInBaseballCardDeselectButtonLabel,
  tradeInBaseballCardEditCtaLabel,
  tradeInBaseballCardEditCtaUrl,
  tradeInBaseballCardImageUrl,
  tradeInBaseballCardImageUrlAriaLabel,
  tradeInBaseballCardNetValueLabel,
  tradeInBaseballCardNetValueNegativeCopy,
  tradeInBaseballCardSelectButtonAriaLabel,
  tradeInBaseballCardSelectButtonLabel,
  tradeInBaseballCardValueAtDealerCopy,
  tradeInBaseballCardValueAtDealerLabel,
  tradeInIntroBodyCopy,
  tradeInIntroBottomCopy,
  tradeInIntroTitle,
  tradeInIntroValueTradeInCtaAriaLabel,
  tradeInIntroValueTradeInCtaLabel,
  tradeInIntroValueTradeInCtaCtaUrl,
  warningAltText,
  selectedCustomerAppraisals,
  tradeInTitleAccDisc,
  tradeInTitleVdmDisc,
  updateTradeInApplyFinance,
  updateTotalTradeInAmount,
  accordionContentType,
  accordionExpandCtaName,
  tradeInFinancePaymentMethods,
  totalTradeInAmount,
  alwaysExpandDuringAccordionProgression,
  accordionTabName,
  deselectCtaNameAnalytics,
  deselectContentTypeAnalytics,
  editCtaNameAnalytics,
  editContentTypeAnalytics,
  checkOfflineTradeInMarkets,
  navigateTradeinCall,
  tradeInBaseballCardCompleteCtaAriaLabel,
  tradeInBaseballCardCompleteCtaLabel,
  tradeInBaseballCardContinueCtaAriaLabel,
  tradeInBaseballCardContinueCtaLabel,
  tradeInBaseballCardEditCtaAltLabel,
  tradeInBaseballCardExpireLabel,
  financeType,
  tradeInBaseballCardIncompleteCopy,
  tradeInBaseballCardIncompleteLabel,
  tradeInBaseballCardOfferExpiredCopy,
  tradeInBaseballCardOfferExpiredLabel,
  tradeinOverageModalTitle,
  tradeinOverageModelBodyText,
  tradeinOverageModalCtaLabel,
  tradeinOverageModalCtaAriaLabel,
  checkOverageTradeInMarkets,
  financeUpdateHasSucceeded,
  tradeInOverageValue,
  removeTradeIn,
  updateTradeInFinanceReset,
  removeTradeInReset,
  fordPaymentMethod,
  tradeinDealerModalCtaAriaLabel,
  tradeinDealerModalCtaLabel,
  tradeinModalBodyText,
  tradeinModalTitle,
  dealerId,
  openCartAccordion,
  removeTradeInHasSucceeded,
}) => {
  const accordionRef = useRef(null);
  const showTradeinLoader = useSelector(getTradeInLoader);
  const [
    isAccordionCloseTransitionCompleted,
    setIsAccordionCloseTransitionCompleted,
  ] = useState(!isOpen);

  const [showTradeinOverageModal, setShowTradeinOverageModal] = useState(false);
  const orderCode = useSelector(getOrderCode);
  const appraisalId = useSelector(getAppraisalId);

  useEffect(() => {
    if (
      financeUpdateHasSucceeded &&
      tradeInOverageValue > 0 &&
      totalTradeInAmount &&
      fordPaymentMethod !== PLAN_CODES.CASH
    ) {
      setShowTradeinOverageModal(true);
    } else {
      setShowTradeinOverageModal(false);
    }
  }, [financeUpdateHasSucceeded, tradeInOverageValue, totalTradeInAmount]);

  const [showTradeinDealerModal, setShowTradeinDealerModal] = useState(false);
  const setShowTradeInDealerModalInAccordion = (value) => {
    setShowTradeinDealerModal(value);
  };
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

  const interContentClasses = cssClasses('inner-content');

  useEffect(() => {
    if (selectedCustomerAppraisals?.length > 0) {
      if (!isComplete) {
        // only trigger the complete action if it is not complete
        completeCartAccordion({
          accordionType: ACCORDION_TYPES.TRADE_IN,
        });
      }
      updateTotalTradeInAmount({
        totalTradeInAmount: selectedCustomerAppraisals[0]?.netValue,
      });
      updateTradeInApplyFinance({
        applyFinanceForTradeIn:
          selectedCustomerAppraisals[0]?.applyFinanceForTradeIn,
      });
    } else if (isComplete) {
      incompleteCartAccordion({
        accordionType: ACCORDION_TYPES.TRADE_IN,
      });
    }
  }, [selectedCustomerAppraisals]);

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
  const handleAccordionToggle = () => {
    if (!dealerId) {
      return setShowTradeinDealerModal(true);
    } else {
      onClickFunc();
      toggleCartAccordion({ accordionType, isOpen });
      onAccordionClick();
    }
  };

  const handlePrimaryButtonOnClick = () => {
    setShowTradeinDealerModal(false);
    openCartAccordion({ accordionType: 'dealerDelivery' });
  };

  const handleButtonOnClick = () => {
    setShowTradeinOverageModal(false);
    removeTradeIn({ orderCode, appraisalId, mock: false });
    updateTradeInFinanceReset();
  };

  return (
    <div
      className={cartAccordionClasses}
      role="group"
      aria-labelledby={`${removeSpacesCharacters(title)}-accordionTitle`}
    >
      <button
        id={accordionType}
        data-testid="tradeInAccordionButton"
        className={openClasses}
        onClick={handleAccordionToggle}
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
          subtitleClose={subtitleClose}
          termPrefix={termPrefix}
          termSuffix={termSuffix}
          selectedDeliveryMethod={selectedDeliveryMethod}
          planAdded={ppViewCartAddedLabel}
          accordionExpandCtaName={accordionExpandCtaName}
          accordionContentType={accordionContentType}
          total={
            selectedCustomerAppraisals?.length > 0 &&
            !checkOfflineTradeInMarkets &&
            totalTradeInAmount
              ? CurrencyFormatter.formatPrice({ price: totalTradeInAmount })
              : undefined
          }
        />
        <div className="toggle">
          <Arrow
            orientation={isOpen ? ArrowOrientation.UP : ArrowOrientation.DOWN}
          />
        </div>
      </button>
      <div ref={accordionRef} className={accordionPaddingClasses}>
        <div
          className={interContentClasses}
          id={`${removeSpacesCharacters(title)}-accordionContent`}
        >
          {selectedCustomerAppraisals?.length <= 0 && (
            <TradeInIntro
              bodyCopy={tradeInIntroBodyCopy}
              bottomCopy={tradeInIntroBottomCopy}
              title={tradeInIntroTitle}
              valueTradeInCtaAriaLabel={tradeInIntroValueTradeInCtaAriaLabel}
              valueTradeInCtaLabel={tradeInIntroValueTradeInCtaLabel}
              valueTradeInCtaUrl={tradeInIntroValueTradeInCtaCtaUrl}
              tradeInTitleAccDisc={tradeInTitleAccDisc}
              tradeInTitleVdmDisc={tradeInTitleVdmDisc}
              navigateTradeinCall={navigateTradeinCall}
              removeTradeInReset={removeTradeInReset}
              removeTradeInHasSucceeded={removeTradeInHasSucceeded}
              dealerId={dealerId}
              setShowTradeInDealerModalInAccordion={
                setShowTradeInDealerModalInAccordion
              }
            />
          )}
          {selectedCustomerAppraisals?.length > 0 && (
            <AccordionSlider
              prevOptionAlt={prevOptionAlt}
              nextOptionAlt={nextOptionAlt}
            >
              {selectedCustomerAppraisals?.map((customerAppraisal, index) => (
                <TradeInBaseballCardContainer
                  key={index}
                  applyToFinanceLabel={tradeInBaseballCardApplyToFinanceLabel}
                  appraisalId={customerAppraisal.appraisalId}
                  appraisalValueLabel={tradeInBaseballCardAppraisalValueLabel}
                  balanceOwedLabel={tradeInBaseballCardBalanceOwedLabel}
                  calculated={calculated}
                  completeCtaAriaLabel={tradeInBaseballCardCompleteCtaAriaLabel}
                  completeCtaLabel={tradeInBaseballCardCompleteCtaLabel}
                  continueCtaAriaLabel={tradeInBaseballCardContinueCtaAriaLabel}
                  continueCtaLabel={tradeInBaseballCardContinueCtaLabel}
                  deSelectButtonAriaLabel={
                    tradeInBaseballCardDeselectButtonAriaLabel
                  }
                  deSelectButtonLabel={tradeInBaseballCardDeselectButtonLabel}
                  editCtaAltText={tradeInBaseballCardEditCtaAltLabel}
                  editCtaLabel={tradeInBaseballCardEditCtaLabel}
                  editCtaUrl={tradeInBaseballCardEditCtaUrl}
                  expireLabel={tradeInBaseballCardExpireLabel}
                  financePaymentMethods={tradeInFinancePaymentMethods}
                  financeType={financeType}
                  defaultImageUrl={tradeInBaseballCardImageUrl}
                  imageUrlAriaLabel={tradeInBaseballCardImageUrlAriaLabel}
                  incompleteCopy={tradeInBaseballCardIncompleteCopy}
                  incompleteLabel={tradeInBaseballCardIncompleteLabel}
                  selectButtonAriaLabel={
                    tradeInBaseballCardSelectButtonAriaLabel
                  }
                  selectButtonLabel={tradeInBaseballCardSelectButtonLabel}
                  netValueLabel={tradeInBaseballCardNetValueLabel}
                  netValueNegativeCopy={tradeInBaseballCardNetValueNegativeCopy}
                  offerExpiredCopy={tradeInBaseballCardOfferExpiredCopy}
                  offerExpiredLabel={tradeInBaseballCardOfferExpiredLabel}
                  updateCtaAriaLabel={tradeInBaseballCardUpdateCtaAriaLabel}
                  updateCtaLabel={tradeInBaseballCardUpdateCtaLabel}
                  valueAtDealerCopy={tradeInBaseballCardValueAtDealerCopy}
                  valueAtDealerLabel={tradeInBaseballCardValueAtDealerLabel}
                  accordionTabName={accordionTabName}
                  deselectCtaNameAnalytics={deselectCtaNameAnalytics}
                  deselectContentTypeAnalytics={deselectContentTypeAnalytics}
                  editCtaNameAnalytics={editCtaNameAnalytics}
                  editContentTypeAnalytics={editContentTypeAnalytics}
                />
              ))}
            </AccordionSlider>
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
        {showTradeinLoader && (
          <FDSActivitySpinner
            isFullscreen={true}
            isVisible={showTradeinLoader}
          />
        )}
        {showTradeinOverageModal && checkOverageTradeInMarkets && (
          <TradeInOverageModal
            showTradeinOverageModal={showTradeinOverageModal}
            tradeinOverageModalTitle={tradeinOverageModalTitle}
            tradeinOverageModelBodyText={tradeinOverageModelBodyText}
            tradeinOverageModalCtaLabel={tradeinOverageModalCtaLabel}
            tradeinOverageModalCtaAriaLabel={tradeinOverageModalCtaAriaLabel}
            checkOverageTradeInMarkets={checkOverageTradeInMarkets}
            handleButtonOnClick={handleButtonOnClick}
          />
        )}
        {showTradeinDealerModal && (
          <TradeInDealerModal
            showTradeinDealerModal={showTradeinDealerModal}
            tradeinModalTitle={tradeinModalTitle}
            tradeinModalBodyText={tradeinModalBodyText}
            tradeinDealerModalCtaLabel={tradeinDealerModalCtaLabel}
            tradeinDealerModalCtaAriaLabel={tradeinDealerModalCtaAriaLabel}
            handlePrimaryButtonOnClick={handlePrimaryButtonOnClick}
          />
        )}
      </div>
    </div>
  );
};

export default TradeInAccordion;
