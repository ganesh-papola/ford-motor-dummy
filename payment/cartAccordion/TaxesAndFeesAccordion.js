import React, { useEffect, useRef, useCallback, useState } from 'react';
import cssClasses from 'classnames';
import Arrow, { ArrowOrientation } from '@Common/arrow/Arrow';
import GenericCardContainer from '../../cart/genericCard/GenericCardContainer';
import { removeSpacesCharacters } from '@Utils/Utils';
import AccordionStatusContainer from './AccordionStatus/AccordionStatusContainer';
import useUpdateAccordionLabel from './useUpdateAccordionLabel';
import useRegisterCartAccordion from './useRegisterCartAccordion';
import './CartAccordion.scoped.scss';
import './CartAccordion.scss';
import { ACCORDION_TYPES } from '@Constants/main';
import AnalyticsService from '@Services/analyticsService/AnalyticsService';
import getKey from '@Utils/i18n/getKey';
import CurrencyFormatter from '@Utils/currencyFormatter/CurrencyFormatter';
import PrimaryButton from '@Common/buttons/button/primaryButton/PrimaryButton';
import { MONTH_NAMES as months } from '@Constants/monthNames';

export const TaxesAndFeesAccordion = (props) => {
  const {
    accordionType,
    completeCartAccordion,
    checkmarkAltText,
    hideTopBorder,
    isRequired,
    incompleteCartAccordion,
    isOpen = true,
    isNextStepsClicked,
    isShowPaymentStatusDetails,
    nextStepsText,
    onClickFunc = () => {},
    ppViewCartAddedLabel,
    requiredText,
    selectedDeliveryMethod,
    showNextSteps = false,
    skipCartAccordion = () => {},
    nextStepCartAccordion = () => {},
    subtitle,
    subtitleClose,
    cardTitle,
    cardDescription,
    cardImage,
    cardImageAlt,
    cardImageIsIcon,
    cardCtaLabel,
    cardCtaLabelCompletedState,
    cardCtaAriaLabel,
    cardCtaTarget,
    cardCtaUrl,
    taxesFeesCompleted,
    totalTaxesAndFees = 0,
    title,
    toggleCartAccordion = () => {},
    warningAltText,
    accordionContentType,
    accordionExpandCtaName,
    userData,
    keepLicensePlateFlag,
    registrationMonth,
    alwaysExpandDuringAccordionProgression,
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

  const labelName = getKey('taxesFees:details:label:name');
  const labelAddress = getKey('taxesFees:details:label:address');
  const labelRegistration = getKey('taxesFees:details:label:registration');
  const labelLicensePlate = getKey('taxesFees:details:label:licensePlate');
  const labelLicensePlateOptionKeep = getKey(
    'taxesFees:details:label:licensePlate:option:keep'
  );
  const labelLicensePlateOptionGet = getKey(
    'taxesFees:details:label:licensePlate:option:get'
  );
  const { firstName, lastName, address1, city, state, zipCode } = userData;

  const accordionBannerTotal =
    totalTaxesAndFees > 0 &&
    CurrencyFormatter.formatPrice({ price: totalTaxesAndFees });

  const openClasses = cssClasses('header', {
    open: isOpen,
    closed: !isOpen,
  });

  const cartAccordionClasses = cssClasses('cart-accordion', [accordionType], {
    'no-top-border': hideTopBorder,
    ['show-next-steps']: showNextSteps,
  });

  const innerContentClasses = cssClasses('inner-content', {
    'inner-content--list': taxesFeesCompleted,
  });

  const accordionPaddingClasses = cssClasses('padding-wrapper', {
    'accordion-expand-height': isOpen,
    'accordion-hidden': isAccordionCloseTransitionCompleted,
  });

  useEffect(() => {
    if (taxesFeesCompleted) {
      completeCartAccordion({ accordionType: ACCORDION_TYPES.TAXES_AND_FEES });
    } else {
      incompleteCartAccordion({
        accordionType: ACCORDION_TYPES.TAXES_AND_FEES,
      });
    }
  }, [taxesFeesCompleted]);

  useEffect(() => {
    if (isOpen && isNextStepsClicked) {
      AnalyticsService.onExpandAccordion(
        accordionContentType,
        accordionExpandCtaName
      );
      nextStepCartAccordion({ accordionType });
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

  return (
    <div
      className={cartAccordionClasses}
      role="group"
      aria-labelledby={`${removeSpacesCharacters(title)}-accordionTitle`}
    >
      <button
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
          selectedDeliveryMethod={selectedDeliveryMethod}
          planAdded={ppViewCartAddedLabel}
          subtitleClose={subtitleClose}
          accordionExpandCtaName={accordionExpandCtaName}
          accordionContentType={accordionContentType}
          total={accordionBannerTotal}
        />

        <div className="toggle">
          <Arrow
            orientation={isOpen ? ArrowOrientation.UP : ArrowOrientation.DOWN}
          />
        </div>
      </button>
      <div ref={accordionRef} className={accordionPaddingClasses}>
        <div
          className={innerContentClasses}
          id={`${removeSpacesCharacters(title)}-accordionContent`}
        >
          {!taxesFeesCompleted && (
            <GenericCardContainer
              title={cardTitle}
              description={cardDescription}
              image={cardImage}
              imageAlt={cardImageAlt}
              imageIsIcon={cardImageIsIcon}
              ctaLabel={cardCtaLabel}
              ctaAriaLabel={cardCtaAriaLabel}
              ctaUrl={cardCtaUrl}
              ctaTarget={cardCtaTarget}
            />
          )}

          {taxesFeesCompleted && (
            <dl className="summaryview summaryview--between">
              <div className="summaryview__row">
                <dt>{labelName}</dt>
                <dd>
                  {firstName} {lastName}
                </dd>
              </div>
              <div className="summaryview__row">
                <dt>{labelAddress}</dt>
                <dd>{`${address1}, ${city}, ${state}, ${zipCode}`}</dd>
              </div>
              <div className="summaryview__row summaryview__row--divider">
                <dt>{labelRegistration}</dt>
                <dd>{getKey(months[registrationMonth - 1])}</dd>
              </div>
              <div className="summaryview__row">
                <dt>{labelLicensePlate}</dt>
                <dd>
                  {keepLicensePlateFlag
                    ? labelLicensePlateOptionKeep
                    : labelLicensePlateOptionGet}
                </dd>
              </div>
            </dl>
          )}
        </div>

        {taxesFeesCompleted && cardCtaLabelCompletedState && cardCtaUrl && (
          <div className="back-to-edit">
            <PrimaryButton
              text={cardCtaLabelCompletedState}
              ariaLabel={cardCtaAriaLabel}
              theme="light"
              chevron="no"
              url={cardCtaUrl}
              position="center"
              openUrlIn={cardCtaTarget}
            />
          </div>
        )}

        {showNextSteps && (
          <div className="flex jc-center pointer bottom-spacing">
            <button
              className="unbutton"
              onClick={() => skipCartAccordion({ accordionType })}
              onKeyDown={() => skipCartAccordion({ accordionType })}
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

export default TaxesAndFeesAccordion;
