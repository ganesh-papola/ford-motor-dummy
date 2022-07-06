import React, { useEffect, useRef, useCallback, useState } from 'react';
import cssClasses from 'classnames';
import AccordionSlider from '@Common/accordionSlider/AccordionSlider';
import PaymentCardContainer from '../../cart/paymentCard/PaymentCardContainer';
import Arrow, { ArrowOrientation } from '@Common/arrow/Arrow';
import { getIsRetailCustomer, removeSpacesCharacters } from '@Utils/Utils';
import AccordionStatusContainer from './AccordionStatus/AccordionStatusContainer';
import './CartAccordion.scoped.scss';
import './CartAccordion.scss';
import SecondaryButton from '@Common/buttons/button/secondaryButton/SecondaryButton';
import {
  CUSTOMER_TYPE,
  PAYMENT_METHOD_CATEGORIES,
  PLAN_CODES,
  ANALYTICS_PLAN_NAMES,
} from '@Constants/calculator';
import useRegisterCartAccordion from './useRegisterCartAccordion';
import AnalyticsService from '@Services/analyticsService/AnalyticsService';
import useUpdateAccordionLabel from './useUpdateAccordionLabel';
import AemMultiFieldHelper from '@Utils/aemMultiFieldHelper/AemMultiFieldHelper';
import { ACCORDION_TYPES } from '@Constants/main';
import { useHistory } from 'react-router';
import { bevHistoryPush } from '@Utils/RouteHelper';
import CategoryCardContainer from '../../cart/categoryCard/CategoryCardContainer';
import useBatchAndPersist from '@Hooks/useBatchAndPersist';

export const PaymentMethodAccordion = ({
  accordionType,
  isRequired,
  isAnyBusinessPlans,
  isShowPaymentStatusDetails,
  requiredText,
  financePlans,
  title,
  subtitle,
  isOpen = true,
  isNextStepsClicked,
  checkmarkAltText,
  cqPath,
  customerType,
  fetchFinancialPlan,
  hideTopBorder,
  selectedFinancePlan,
  warningAltText,
  termPrefix,
  termSuffix,
  toggleCartAccordion = () => {},
  showNextSteps = false,
  onClickFunc = () => {},
  nextStepsText,
  skipCartAccordion = () => {},
  nextStepCartAccordion = () => {},
  paymentCardSelectLabel,
  paymentCardSelectAriaLabel,
  paymentCardSelectedText,
  paymentCardEditLabel,
  paymentCardEditAriaLabel,
  paymentCategoriesList = [],
  paymentMethodRetailCustomerDescription,
  paymentMethodRetailCustomerButtonText,
  paymentMethodRetailCustomerButtonAriaLabel,
  paymentMethodBusinessCustomerDescription,
  paymentMethodBusinessCustomerButtonText,
  paymentMethodBusinessCustomerButtonAriaLabel,
  updateUserCustomerType,
  ppViewCartAddedLabel,
  selectedDeliveryMethod,
  prevOptionAlt,
  nextOptionAlt,
  selectPaymentMethodCtaAnalyticsData,
  editPaymentMethodCtaAnalyticsData,
  paymentMethodContentTypeAnalyticsData,
  paymentMethodCarouselContentType,
  setOverrideCustomerType,
  leasePaymentMethodCtaAnalytics,
  optionsPaymentMethodCtaAnalytics,
  financePaymentMethodCtaAnalytics,
  cashPaymentMethodCtaAnalytics,
  preArrangedFinancePaymentMethodCtaAnalytics,
  updatePaymentCategories,
  paymentCalculatorUrl,
  updateSelectedPaymentCategory = () => {},
  updateTemporarySelectedPaymentCategory,
  calculatorSharedDataChange,
  completeCartAccordion = () => {},
  selectedPaymentCategory,
  updatePaymentCalculatorPlanCode,
  onHoverCheck,
  monthlyPayment,
  totalPayment,
  paymentText,
  accordionContentType,
  accordionExpandCtaName,
  calculated,
  confirmButtonText,
  confirmButtonAriaLabel,
  paymentToggleContentAnalytics,
  paymentToggleCtaAnalytics,
  togglePaymentMethodAnalytics,
  alwaysExpandDuringAccordionProgression,
  categoryCardCheckmarkAltText,
  updateCategoryPlanId,
  updateDefaultPlanId,
  updateCategoryCustomerType,
  titleTooltipTakeover,
  updateTradeInApplyFinance,
  fetchFinanceUpdate,
  getCartHasSucceeded,
  isCategoryCardsEnabled,
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

  const onCategoryCardConfirmed = useBatchAndPersist([
    () =>
      calculatorSharedDataChange({
        calculated: true,
      }),
    () =>
      completeCartAccordion({
        accordionType: ACCORDION_TYPES.PAYMENT_METHOD,
      }),
  ]);
  useUpdateAccordionLabel(accordionType, title);
  useRegisterCartAccordion({
    accordionType,
    isRequired,
    alwaysExpandDuringAccordionProgression,
  });

  const history = useHistory();

  const paymentCategoryCards = AemMultiFieldHelper.getMultiFieldProps(
    cqPath + '/paymentCategoryCards'
  );

  useEffect(() => {
    if (isCategoryCardsEnabled) {
      if (paymentCategoryCards.length) {
        updatePaymentCategories(paymentCategoryCards);
      }
    }
    fetchFinancialPlan({});
  }, []);

  /**
   * Updates analytics when Accordion is open
   */
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

  const orientation = isOpen ? ArrowOrientation.UP : ArrowOrientation.DOWN;

  const toggleFinancePlans = () => {
    const userType = getIsRetailCustomer(customerType)
      ? CUSTOMER_TYPE.BUSINESS
      : CUSTOMER_TYPE.RETAIL;
    updateUserCustomerType(
      getIsRetailCustomer(customerType)
        ? CUSTOMER_TYPE.BUSINESS
        : CUSTOMER_TYPE.RETAIL
    );
    setOverrideCustomerType(true);
    togglePaymentMethodAnalytics(
      paymentToggleContentAnalytics ?? '',
      paymentToggleCtaAnalytics ?? '',
      userType
    );
  };

  const openClasses = cssClasses('header', {
    open: isOpen,
    closed: !isOpen,
  });

  const cartAccordionClasses = cssClasses('cart-accordion', [accordionType], {
    'no-top-border': hideTopBorder,
    ['show-next-steps']: showNextSteps,
  });

  const interContentClasses = cssClasses('inner-content');

  const accordionPaddingClasses = cssClasses('padding-wrapper', {
    'accordion-expand-height': isOpen,
    'accordion-hidden': isAccordionCloseTransitionCompleted,
  });

  let paymentCarouselLeftClicked = false;
  let paymentCarouselRightClicked = false;
  const paymentCarouselClickAnalytics = (scroll) => {
    if (!paymentCarouselRightClicked && scroll === 'scroll right') {
      AnalyticsService.onPaymentMethodCarouselClick(
        scroll,
        paymentMethodCarouselContentType
      );
      paymentCarouselRightClicked = true;
      paymentCarouselLeftClicked = false;
    } else if (!paymentCarouselLeftClicked) {
      AnalyticsService.onPaymentMethodCarouselClick(
        scroll,
        paymentMethodCarouselContentType
      );
      paymentCarouselLeftClicked = true;
      paymentCarouselRightClicked = false;
    }
  };

  const handleUpdateToRedux = (categoryType) => {
    if (categoryType === PAYMENT_METHOD_CATEGORIES.CASH) {
      updateSelectedPaymentCategory(categoryType);
    } else {
      updateTemporarySelectedPaymentCategory(categoryType);
    }
    if (selectedPaymentCategory === categoryType) {
      updatePaymentCalculatorPlanCode(selectedFinancePlan);
    } else {
      if (categoryType === PAYMENT_METHOD_CATEGORIES.FORD_CREDIT_FINANCING) {
        updatePaymentCalculatorPlanCode(PLAN_CODES.FINANCE);
      } else if (
        categoryType === PAYMENT_METHOD_CATEGORIES.PRE_ARRANGED_FINANCING
      ) {
        updatePaymentCalculatorPlanCode(PLAN_CODES.THIRD_PARTY_US);
      }
    }
  };

  /**
   * After clicking the confirm button, this function handles updating redux with the desired state
   */
  const handleCategoryCardConfirm = () => {
    onCategoryCardConfirmed();
  };

  /**
   * Formats the monthly payment for display using some of the authored values
   * @param categoryType {string} The user selected finance category
   * @returns {string} Formatted Monthly Payment
   */
  const formatPayment = (categoryType) => {
    if (!categoryType) {
      return '';
    } else if (categoryType === PAYMENT_METHOD_CATEGORIES.CASH) {
      return totalPayment;
    }
    return `${monthlyPayment}/${termSuffix}`;
  };

  const handleCategoryCardEdit = (categoryType) => {
    handleUpdateToRedux(categoryType);
    bevHistoryPush(history, paymentCalculatorUrl);
    sendPaymentMethodAnalytics(
      {
        paymentMethodCtaAnalyticsData: editPaymentMethodCtaAnalyticsData,
      },
      categoryType
    );
  };

  const getAnalyticsData = (categoryType) => {
    switch (categoryType) {
      case PAYMENT_METHOD_CATEGORIES.CASH:
        return [
          ANALYTICS_PLAN_NAMES.CASH,
          paymentMethodContentTypeAnalyticsData,
          cashPaymentMethodCtaAnalytics,
        ];
      case PLAN_CODES.FORD_OPTIONS:
        return [
          ANALYTICS_PLAN_NAMES.FORD_OPTIONS,
          paymentMethodContentTypeAnalyticsData,
          optionsPaymentMethodCtaAnalytics,
        ];
      case PAYMENT_METHOD_CATEGORIES.FORD_CREDIT_FINANCING:
        return [
          ANALYTICS_PLAN_NAMES.FINANCE,
          paymentMethodContentTypeAnalyticsData,
          financePaymentMethodCtaAnalytics,
        ];
      case PAYMENT_METHOD_CATEGORIES.PRE_ARRANGED_FINANCING:
        return [
          ANALYTICS_PLAN_NAMES.PRE_ARRANGED_FINANCE,
          paymentMethodContentTypeAnalyticsData,
          preArrangedFinancePaymentMethodCtaAnalytics,
        ];
      default:
        return;
    }
  };

  const sendPaymentMethodAnalytics = (
    { paymentMethodCtaAnalyticsData },
    categoryType
  ) => {
    const analyticsData = getAnalyticsData(categoryType);
    AnalyticsService.onCartSelectPaymentMethod(
      analyticsData?.[0],
      paymentMethodCtaAnalyticsData,
      analyticsData?.[1]
    );
  };

  const updatePlanIds = (planIds) => {
    updateCategoryPlanId(planIds);
  };
  const updateDefaultPlanIdForCategoryCard = (planIds) => {
    updateDefaultPlanId(planIds);
  };

  const updateShowPaymentCategoryCards = (planIds) => {
    updateCategoryCustomerType(planIds);
  };

  const renderPaymentCard = (financePlan, isSelected) => (
    <PaymentCardContainer
      title={financePlan?.planName}
      planId={financePlan?.planId}
      altText={financePlan?.planName}
      bodyText={financePlan?.planDescription}
      titleTooltipTakeover={titleTooltipTakeover}
      disclosureName={financePlan?.planDisclaimer} // TODO: not coming through???
      image={financePlan?.planImage}
      key={financePlan?.planId}
      isSelected={isSelected}
      selectedText={paymentCardSelectedText}
      editText={paymentCardEditLabel}
      editAriaLabel={paymentCardEditAriaLabel?.replace(
        '{planName}',
        financePlan?.planName
      )}
      buttonText={paymentCardSelectLabel}
      ariaLabel={paymentCardSelectAriaLabel?.replace(
        '{planName}',
        financePlan?.planName
      )}
      selectPaymentMethodCtaAnalyticsData={selectPaymentMethodCtaAnalyticsData}
      editPaymentMethodCtaAnalyticsData={editPaymentMethodCtaAnalyticsData}
      cashPaymentMethodContentTypeAnalyticsData={
        paymentMethodContentTypeAnalyticsData
      }
      financePaymentMethodContentTypeAnalyticsData={
        paymentMethodContentTypeAnalyticsData
      }
      optionsPaymentMethodContentTypeAnalyticsData={
        paymentMethodContentTypeAnalyticsData
      }
      leasePaymentMethodContentTypeAnalyticsData={
        paymentMethodContentTypeAnalyticsData
      }
      leasePaymentMethodCtaAnalytics={leasePaymentMethodCtaAnalytics}
      optionsPaymentMethodCtaAnalytics={optionsPaymentMethodCtaAnalytics}
      financePaymentMethodCtaAnalytics={financePaymentMethodCtaAnalytics}
      cashPaymentMethodCtaAnalytics={cashPaymentMethodCtaAnalytics}
      onHoverCheck={onHoverCheck}
      selectedFinancePlan={selectedFinancePlan}
    />
  );

  const renderCategoryCard = (paymentCategory) => (
    <CategoryCardContainer
      key={paymentCategory?.planId}
      title={paymentCategory?.name}
      planId={paymentCategory?.planId}
      selectedText={paymentCardSelectedText}
      isSelected={paymentCategory?.planNameForCategoryCards
        .split(',')
        .map((planId) => planId.trim())
        .includes(selectedFinancePlan)}
      selectedFinancePlan={selectedFinancePlan}
      handleConfirmClick={handleCategoryCardConfirm}
      confirmButtonText={confirmButtonText}
      confirmButtonAriaLabel={confirmButtonAriaLabel}
      titleTooltipTakeover={titleTooltipTakeover}
      cardTitle={paymentCategory?.name}
      categoryCardTooltip={paymentCategory?.paymentCategoryTooltip}
      cardDescriptionOne={paymentCategory?.descriptionOne}
      cardDescriptionTwo={paymentCategory?.descriptionTwo}
      onClickFunc={() => {
        updatePlanIds(paymentCategory?.planNameForCategoryCards);
        updateDefaultPlanIdForCategoryCard(paymentCategory?.planId);
        updateShowPaymentCategoryCards(isCategoryCardsEnabled);
      }}
      categoryCardImage={paymentCategory?.planImage}
      handleClickSecondaryButton={() => {
        handleCategoryCardEdit(paymentCategory?.planId);
      }}
      onHoverCheck={onHoverCheck}
      categoryCardCheckmarkAltText={categoryCardCheckmarkAltText}
      categoryCardEditButtonAriaLabel={
        paymentCategory?.categoryCardEditButtonAriaLabel
      }
      categoryCardEditButtonText={paymentCategory?.categoryCardEditButtonText}
      categoryCardButtonText={paymentCategory?.categoryCardButtonText}
      categoryCardButtonAriaLabel={paymentCategory?.categoryCardButtonAriaLabel}
    />
  );

  const financePlanIds = financePlans.map((plan) => plan.planId);
  const filteredPaymentCategoriesList = paymentCategoriesList
    // make new property for the object that contains parsed planIds
    .map((cat) => ({
      ...cat,
      planNameForCategoryCardsArray: cat.planNameForCategoryCards
        .split(',')
        .map((planId) => planId.trim()),
    }))
    // filter the cards that appear if no planIds match the available plans
    .filter((cat) =>
      cat.planNameForCategoryCardsArray.some((planId) =>
        financePlanIds.includes(planId)
      )
    )
    // update category card plans to only be available plans
    .map((cat) => ({
      ...cat,
      planNameForCategoryCards: cat.planNameForCategoryCardsArray
        .filter((planId) => financePlanIds.includes(planId))
        .join(','),
    }));

  // if there's only one finance plan, make it the selected finance plan after getCart is called
  useEffect(() => {
    if (
      financePlans.length === 1 &&
      financePlans[0].planId.trim() !== selectedFinancePlan &&
      getCartHasSucceeded
    ) {
      calculatorSharedDataChange({
        financePlan: financePlans[0].planId.trim(),
        financeType: financePlans[0].planName,
      });
      updateTradeInApplyFinance({
        applyFinanceForTradeIn: false,
      });
      completeCartAccordion({
        accordionType: ACCORDION_TYPES.PAYMENT_METHOD,
      });
      fetchFinanceUpdate();
    }
  }, [financePlans, getCartHasSucceeded]);

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
          payment={formatPayment(selectedPaymentCategory)}
          paymentText={paymentText}
          accordionExpandCtaName={accordionExpandCtaName}
          accordionContentType={accordionContentType}
          isShowGreenCheck={calculated}
          selectedPaymentCategory={selectedPaymentCategory}
        />
        <div className="toggle">
          <Arrow orientation={orientation} />
        </div>
      </button>
      <div ref={accordionRef} className={accordionPaddingClasses}>
        {isAnyBusinessPlans &&
          !isCategoryCardsEnabled && ( //TODO: add logic for category cards not being there, don't show if there aren't any
            <div className="payment-method-customer-type">
              {getIsRetailCustomer(customerType)
                ? paymentMethodRetailCustomerDescription
                : paymentMethodBusinessCustomerDescription}{' '}
              <SecondaryButton
                isTextLarge={true}
                text={
                  getIsRetailCustomer(customerType)
                    ? paymentMethodRetailCustomerButtonText
                    : paymentMethodBusinessCustomerButtonText
                }
                ariaLabel={
                  getIsRetailCustomer(customerType)
                    ? paymentMethodRetailCustomerButtonAriaLabel
                    : paymentMethodBusinessCustomerButtonAriaLabel
                }
                theme="light"
                chevron="no"
                type="button"
                handleClick={toggleFinancePlans}
              />
            </div>
          )}

        <div
          className={interContentClasses}
          id={`${removeSpacesCharacters(title)}-accordionContent`}
        >
          <AccordionSlider
            customerType={customerType}
            prevOptionAlt={prevOptionAlt}
            nextOptionAlt={nextOptionAlt}
            scrollClickAnalytics={paymentCarouselClickAnalytics}
          >
            {isCategoryCardsEnabled
              ? filteredPaymentCategoriesList?.map(renderCategoryCard)
              : financePlans.map((financePlan) =>
                  renderPaymentCard(
                    financePlan,
                    financePlan.planId === selectedFinancePlan
                  )
                )}
          </AccordionSlider>
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

export default PaymentMethodAccordion;
