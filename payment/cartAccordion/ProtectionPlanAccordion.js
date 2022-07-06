import React, { useEffect } from 'react';
import cssClasses from 'classnames';
import Arrow, { ArrowOrientation } from '@Common/arrow/Arrow';
import { removeSpacesCharacters } from '@Utils/Utils';
import AccordionStatusContainer from './AccordionStatus/AccordionStatusContainer';
import ProtectionPlanContainer from '../../protectionPlan/protectionPlanContainer/ProtectionPlanContainer';
import useUpdateAccordionLabel from './useUpdateAccordionLabel';
import useRegisterCartAccordion from './useRegisterCartAccordion';
import { ROUTEONE_PAYMENT_TYPE } from '@Constants/protectionPlan';
import './CartAccordion.scoped.scss';
import './CartAccordion.scss';
import AemMultiFieldHelper from '@Utils/aemMultiFieldHelper/AemMultiFieldHelper';
import { ACCORDION_TYPES } from '@Constants/main';
import { getProtectionPlansCartData } from '@Services/protectionPlanService/ProtectionPlanService';
import CurrencyFormatter from '@Utils/currencyFormatter/CurrencyFormatter';
import { PLAN_CODES } from '@Constants/calculator';
import useBatchAndPersist from '@Hooks/useBatchAndPersist';

export const ProtectionPlanAccordion = ({
  accordionType,
  isRequired,
  isShowPaymentStatusDetails,
  requiredText,
  title,
  subtitle,
  isOpen = true,
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
  ppViewWarrantyGuide,
  ppIncluded,
  ppViewCartAddButtonLabel,
  ppgetMoreCoverage,
  ppCartGetMoreCoverageTextEU,
  ppCartGetMoreCoverageTextUS,
  pplengthLabel,
  ppMileageLabel,
  ppTermLabel,
  ppSubmitButtonLabel,
  ppViewCartProtectionPlanLabel,
  ppViewCartAddedLabel,
  ppViewCartDealerSellingPrice,
  ppViewCartRemoveButtonLabel,
  ppViewCartViewAllPlansButtonLabel,
  ppViewCartViewAllPlansCTAName,
  ppViewCartViewAllPlansCTAContentSubType,
  ppViewCartDeductibleText,
  ppCartEditOptionsText,
  ppCartPlanDetailsText,
  ppCartPerMonthText,
  ppCartNewVehicleLimitedWarrantyFord,
  ppNewVehicleLimitedWarrantyLincoln,
  ppNewVehicleLimitedWarrantyTitle,
  planOptionTitle,
  planOptionsLabel,
  sellingPriceLabel,
  bestMatchText,
  deductableAmountText,
  showDeductableAmount,
  planTermSuffix,
  planDistanceSuffix,
  sellingPriceSuffix,
  downloadLabel,
  availablePlanTitle,
  leaseLabel,
  distanceUnit,
  selectedPlanTitle,
  selectedDeliveryMethod,
  prevOptionAlt,
  nextOptionAlt,
  ppDealerMessageNoProtectionPlan,
  ppDealerMessageNoProtectionPlanLease,
  ppMessageForUSLease,
  ppViewCartViewAllPlansButtonLink,
  ppSubmitButtonLink,
  pplengthUnit,
  fetchProtectionPlan,
  fetchBasePlan,
  fordPaymentMethod,
  brand,
  cartId,
  dealerId,
  accessToken,
  msrp,
  protectionPlanDealerId,
  apr,
  financedAmount,
  totalPrice,
  userCountry,
  dealerCountry,
  dealerState,
  vin,
  protectionPlanApr,
  protectionPlanTerm,
  protectionPlanFordPayment,
  brightCoveAccountID,
  brightCovePlayerID,
  cqPath,
  financeLabel,
  routeOneDealerId,
  manualtype,
  updateAuthoredNodes,
  category,
  incompleteCartAccordion,
  completeCartAccordion,
  addedProtectionPlanCount,
  isComplete,
  addedProtectionPlans,
  updateSelectedProtectionPlan,
  protectionPlanTotalPrice,
  protectionPlanMonthlyPrice,
  removeProtectionPlans,
  updateSelectedUserInputs,
  accordionContentType,
  accordionExpandCtaName,
  financedTerm,
  addPlanCtaAnalyticsData,
  removePlanCtaAnalyticsData,
  addRemovePlanContentTypeAnalyticsData,
  alwaysExpandDuringAccordionProgression,
}) => {
  const providerConfiguration = AemMultiFieldHelper.getMultiFieldProps(
    cqPath + '/providerConfiguration'
  );

  useRegisterCartAccordion({
    accordionType,
    isRequired,
    alwaysExpandDuringAccordionProgression,
  });
  useUpdateAccordionLabel(accordionType, title);

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
  });

  const transactionType = ROUTEONE_PAYMENT_TYPE[fordPaymentMethod];

  const clearInputsAndFetchProtectionPlans = useBatchAndPersist(
    [
      () => updateSelectedUserInputs({}),
      () =>
        fetchProtectionPlan({
          fordPaymentMethod,
          brand,
          cartId,
          dealerId,
          accessToken,
          msrp,
          protectionPlanDealerId,
          apr,
          financedAmount,
          financedTerm,
          totalPrice,
          userCountry,
          dealerCountry,
          dealerState,
          vin,
          transactionType,
          providerConfiguration,
          routeOneDealerId,
        }),
    ],
    [
      fordPaymentMethod,
      routeOneDealerId,
      cartId,
      accessToken,
      apr,
      financedTerm,
      dealerId,
      brand,
    ]
  );

  useEffect(() => {
    if (
      (apr === protectionPlanApr &&
        fordPaymentMethod === protectionPlanFordPayment &&
        financedTerm === protectionPlanTerm &&
        dealerId === protectionPlanDealerId) ||
      !brand ||
      !dealerId ||
      !routeOneDealerId
    ) {
      return;
    }
    clearInputsAndFetchProtectionPlans();
  }, [
    fordPaymentMethod,
    routeOneDealerId,
    cartId,
    accessToken,
    apr,
    financedTerm,
    dealerId,
    brand,
  ]);

  useEffect(() => {
    if (vin && accessToken) {
      fetchBasePlan({
        vin: vin,
        manualtype: manualtype?.toUpperCase(),
        category,
        accessToken,
      });
    }
  }, [vin, accessToken]);

  useEffect(() => {
    if (
      !protectionPlanApr &&
      !protectionPlanFordPayment &&
      !protectionPlanTerm &&
      !protectionPlanDealerId
    ) {
      return;
    } else if (
      (apr !== protectionPlanApr ||
        fordPaymentMethod !== protectionPlanFordPayment ||
        financedTerm !== protectionPlanTerm ||
        dealerId !== protectionPlanDealerId) &&
      addedProtectionPlanCount
    ) {
      removeProtectionPlans({ selectedData: [], cartId });
    }
  }, [
    fordPaymentMethod,
    routeOneDealerId,
    cartId,
    accessToken,
    apr,
    financedTerm,
    dealerId,
  ]);

  useEffect(() => {
    updateAuthoredNodes({
      includedText: ppIncluded,
      descriptionWarrantyFord: ppCartNewVehicleLimitedWarrantyFord,
      descriptionWarrantyLincoln: ppNewVehicleLimitedWarrantyLincoln,
      viewWarrantyGuideLabel: ppViewWarrantyGuide,
      ppNewVehicleLimitedWarrantyTitle,
      manualtype: manualtype?.toUpperCase(),
      category,
      addPlanCtaAnalyticsData,
      removePlanCtaAnalyticsData,
      addRemovePlanContentTypeAnalyticsData,
    });
  }, []);

  useEffect(() => {
    if (addedProtectionPlanCount && !isComplete) {
      completeCartAccordion({ accordionType: ACCORDION_TYPES.PROTECTION_PLAN });
    }
    if (!addedProtectionPlanCount && isComplete) {
      incompleteCartAccordion({
        accordionType: ACCORDION_TYPES.PROTECTION_PLAN,
      });
    }
  }, [addedProtectionPlanCount]);

  useEffect(() => {
    const getCartProtectionPlans = getProtectionPlansCartData(
      addedProtectionPlans,
      fordPaymentMethod
    );
    updateSelectedProtectionPlan(getCartProtectionPlans);
  }, [addedProtectionPlans]);

  const showMonthlyPrice = () => {
    return fordPaymentMethod !== PLAN_CODES.CASH;
  };

  useEffect(() => {
    if (isOpen) {
      document.getElementById(accordionType).focus();
    }
  }, [isOpen]);

  const setTotalPriceFormat = (total) => {
    if (total) {
      const totalValue = CurrencyFormatter.formatPrice({ price: total });
      const montlyPrice = showMonthlyPrice()
        ? `| ${CurrencyFormatter.formatPrice({
            price: protectionPlanMonthlyPrice,
          })} ${sellingPriceSuffix}`
        : '';
      return `${totalValue} ${montlyPrice}`;
    }
  };

  const protectionPlansAnalyticsContent = {
    ppViewCartViewAllPlansCTAName,
    ppViewCartViewAllPlansCTAContentSubType,
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
          accordionExpandCtaName={accordionExpandCtaName}
          accordionContentType={accordionContentType}
          planAdded={ppViewCartAddedLabel?.toUpperCase()}
          total={setTotalPriceFormat(protectionPlanTotalPrice)}
          protectionPlanTermSuffix={planTermSuffix}
        />
        <div className="toggle">
          <Arrow
            orientation={isOpen ? ArrowOrientation.UP : ArrowOrientation.DOWN}
          />
        </div>
      </button>
      <div className={accordionPaddingClasses}>
        <div
          className="inner-content"
          id={`${removeSpacesCharacters(title)}-accordionContent`}
        >
          <ProtectionPlanContainer
            getMoreCoverageText={ppgetMoreCoverage}
            getMoreCoverageDescriptionEU={ppCartGetMoreCoverageTextEU}
            getMoreCoverageDescriptionUS={ppCartGetMoreCoverageTextUS}
            lengthLabel={pplengthLabel}
            mileageLabel={ppMileageLabel}
            termLabel={ppTermLabel}
            submitButtonLabel={ppSubmitButtonLabel}
            viewProtectionPlanLabel={ppViewCartProtectionPlanLabel}
            addedLabel={ppViewCartAddedLabel}
            dealerSellinngPriceLable={ppViewCartDealerSellingPrice}
            removeButtonLabel={ppViewCartRemoveButtonLabel}
            viewAllPlansButtonLabel={ppViewCartViewAllPlansButtonLabel}
            deductibleLabel={ppViewCartDeductibleText}
            editOptionText={ppCartEditOptionsText}
            addButtonLabel={ppViewCartAddButtonLabel}
            planDetailsText={ppCartPlanDetailsText}
            perMonthText={ppCartPerMonthText}
            planOptionTitle={planOptionTitle}
            planOptionsLabel={planOptionsLabel}
            sellingPriceLabel={sellingPriceLabel}
            bestMatchText={bestMatchText}
            deductableAmountText={deductableAmountText}
            showDeductableAmount={showDeductableAmount}
            planTermSuffix={planTermSuffix}
            planDistanceSuffix={planDistanceSuffix}
            sellingPriceSuffix={sellingPriceSuffix}
            downloadLabel={downloadLabel}
            availablePlanTitle={availablePlanTitle}
            selectedPlanTitle={selectedPlanTitle}
            prevOptionAlt={prevOptionAlt}
            nextOptionAlt={nextOptionAlt}
            ppDealerMessageNoProtectionPlan={ppDealerMessageNoProtectionPlan}
            ppDealerMessageNoProtectionPlanLease={
              ppDealerMessageNoProtectionPlanLease
            }
            ppViewCartViewAllPlansButtonLink={ppViewCartViewAllPlansButtonLink}
            submitButtonLink={ppSubmitButtonLink}
            pplengthUnit={pplengthUnit}
            leaseLabel={leaseLabel}
            distanceUnit={distanceUnit}
            ppMessageForUSLease={ppMessageForUSLease}
            brightCoveAccountID={brightCoveAccountID}
            brightCovePlayerID={brightCovePlayerID}
            providerConfiguration={providerConfiguration}
            financeLabel={financeLabel}
            routeOneDealerId={routeOneDealerId}
            protectionPlansAnalyticsContent={protectionPlansAnalyticsContent}
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

export default ProtectionPlanAccordion;
