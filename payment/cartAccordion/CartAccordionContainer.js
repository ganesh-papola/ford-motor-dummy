// React
import React from 'react';

// External
import useActions from '@Hooks/useActions';
import { useSelector } from 'react-redux';
import { MapTo } from '@adobe/cq-react-editable-components';

// Selectors
import * as accessorySelectors from '@Ducks/accessories/selectors';
import { getAddOnList } from '@Ducks/addOn/selectors';
import * as calculatorSelectors from '@Ducks/calculator/selectors';
import * as cartSelectors from '@Ducks/cart/selectors';
import * as chargingSelectors from '@Ducks/charging/selectors';
import * as dealerDataSelectors from '@Ducks/dealerData/selectors';
import {
  getAutoAllocateDealerHasFailed,
  getDealerSelectDealerDistanceFormatted,
  getSuggestedDealers,
  getUserLocationHasFailed,
  getDealerSearchQueryParams,
} from '@Slices/dealerSearch/selectors';
import * as deliveryDataSelectors from '@Ducks/deliveryData/selectors';
import {
  getAccessToken,
  getFMAorGuestGUIDAuth,
  getUserHasGuestGUID,
} from '@Slices/fma/selectors';
import * as ngcSelectors from '@Ducks/ngc/selectors';
import * as orderDataSelectors from '@Ducks/orderData/selectors';
import { getOrderCode } from '@Ducks/pricingInformation/selectors';
import * as protectionPlanDataSelectors from '@Ducks/protectionPlanData/selectors';
import * as sapSelectors from '@Ducks/sap/selectors';
import {
  getKeepLicensePlates,
  getRegistrationMonth,
  getTaxesFeesComplete,
  getTotalTaxesAndFees,
} from '@Ducks/taxesFees/selectors';
import * as tradeInSelector from '@Ducks/tradeInData/selectors';
import * as userDataSelectors from '@Ducks/userData/selectors';
import * as vehicleUiConfigSelectors from '@Ducks/vehicleUiConfig/selectors';

// Actions
import { updateAccessoryChargingFinanceType } from '@Ducks/accessories/actions';
import {
  calculatorSharedDataChange,
  updateCategoryCustomerType,
  updateCategoryPlanId,
  updateDefaultPlanId,
  updatePaymentCalculatorPlanCode,
} from '@Ducks/calculator/actions';
import {
  completeCartAccordion,
  incompleteCartAccordion,
  nextStepCartAccordion,
  removeCartNotificationMessages,
  openCartAccordion,
  setOverrideCustomerType,
  skipCartAccordion,
  updatePaymentCategories,
  updateSelectedPaymentCategory,
  updateShowCartNotification,
  updateTemporarySelectedPaymentCategory,
} from '@Ducks/cart/actions';
import {
  updateAuthoredNodes,
  updateSelectedProtectionPlan,
  updateSelectedUserInputs,
} from '@Ducks/protectionPlanData/actions';
import {
  removeTradeInReset,
  updateTradeInFinanceReset,
} from '@Ducks/sap/actions';
import {
  updateTotalTradeInAmount,
  updateTradeInApplyFinance,
} from '@Ducks/tradeInData/actions';
import { updateUserCustomerType } from '@Ducks/userData/actions';

// Thunks
import { toggleCartAccordion } from '@Ducks/cart/thunks';
import { autoAllocateDealerFromBrowserLocation } from '@Slices/dealerSearch/thunks';
import {
  getDeliveryOptions,
  updateDeliveryOptions,
} from '@Ducks/deliveryData/thunks';
import { fetchMonthlyAccessoriesPrice } from '@Ducks/ial/thunks';
import { fetchFinancialPlan } from '@Ducks/ngc/thunks';
import {
  fetchBasePlan,
  fetchProtectionPlan,
  removeProtectionPlans,
} from '@Ducks/protectionPlanData/thunks';
import dealerSearchSlice from '@Slices/dealerSearch';
import { fetchFinanceUpdate, getAccessories } from '@Ducks/sap/thunks';
import { navigateTradeinCall, removeTradeIn } from '@Ducks/tradeInData/thunks';

// Constants
import { CUSTOMER_TYPE, PLAN_CODES } from '@Constants/calculator';
import { DELIVERY_CARDS_TYPES } from '@Constants/main';

// Services / Utils
import AnalyticsService from '@Services/analyticsService/AnalyticsService';
import PropertiesService from '@Services/propertiesService/PropertiesService';
import { getPriceFromEndpointWithObject } from '@Utils/Utils';

// Components
import CartAccordion from './CartAccordion';
import * as orderDataSelector from '@Ducks/orderData/selectors';

const CartAccordionContainer = (props) => {
  const {
    isRequired,
    accordionType,
    cleanTotalEndpoint,
    cleanMonthlyEndpoint,
    alwaysExpandDuringAccordionProgression,
  } = props;

  const {
    isVehicleMicroserviceEnabled,
    isCategoryCardsEnabled,
  } = PropertiesService.getCapabilityFlags();

  const customerType = useSelector(userDataSelectors.getUserCustomerType);
  const selectedFinancePlan = useSelector(calculatorSelectors.getFinancePlan);
  const financePlans = useSelector((state) =>
    isVehicleMicroserviceEnabled
      ? ngcSelectors.getFinancialPlansIncludedForVehicle(state)
      : ngcSelectors.getFinancialPlans(state)
  );
  const overrideCustomerType = useSelector(
    cartSelectors.getOverrideCustomerType
  );

  // If plan was selected in RTO, is plan retail or business?
  const selectedPlanType =
    selectedFinancePlan &&
    financePlans.find((plan) => plan.planId === selectedFinancePlan)
      ?.isBusinessFinancePlan;

  // Show retail / business cards depending on selected plan from RTO, otherwise use customerType
  let customerTypeToShow = customerType;
  if (!overrideCustomerType) {
    if (selectedPlanType === true) customerTypeToShow = CUSTOMER_TYPE.BUSINESS;
    else customerTypeToShow = CUSTOMER_TYPE.RETAIL;
  }

  return (
    <CartAccordion
      {...PropertiesService.getCapabilityFlags()}
      {...props}
      {...useActions({
        fetchFinancialPlan,
        toggleCartAccordion,
        skipCartAccordion,
        nextStepCartAccordion,
        completeCartAccordion,
        incompleteCartAccordion,
        openCartAccordion,
        updateUserCustomerType,
        getAccessories,
        setOverrideCustomerType,
        fetchProtectionPlan,
        fetchBasePlan,
        updatePaymentCategories,
        fetchMonthlyAccessoriesPrice,
        updateSelectedPaymentCategory,
        updateShowCartNotification,
        updateTemporarySelectedPaymentCategory,
        calculatorSharedDataChange,
        fetchFinanceUpdate,
        updatePaymentCalculatorPlanCode,
        updateDeliveryOptions,
        getDeliveryOptions,
        updateTotalTradeInAmount,
        updateTradeInApplyFinance,
        updateAuthoredNodes,
        updateSelectedProtectionPlan,
        removeProtectionPlans,
        removeCartNotificationMessages,
        updateSelectedUserInputs,
        updateAccessoryChargingFinanceType,
        updateCategoryPlanId,
        updateCategoryCustomerType,
        updateDefaultPlanId,
        navigateTradeinCall,
        removeTradeIn,
        updateTradeInFinanceReset,
        removeTradeInReset,
        autoAllocateDealerFromBrowserLocation,
        clearLocationErrorMessage:
          dealerSearchSlice.actions.clearLocationErrorMessage,
      })}
      alwaysExpandDuringAccordionProgression={Boolean(
        alwaysExpandDuringAccordionProgression
      )} // comes back as undefined when falsy
      customerType={customerTypeToShow}
      togglePaymentMethodAnalytics={
        AnalyticsService.togglePaymentMethodAnalytics
      }
      firstThreeAccessories={useSelector(
        accessorySelectors.getFirstThreeAccessories
      )}
      featureImageURLs={useSelector(accessorySelectors.getFeatureImageURLs)}
      addedAccessories={useSelector(accessorySelectors.getAddedAccessories)}
      addedAccessoriesCount={useSelector(
        accessorySelectors.getAddedAccessoriesCount
      )}
      addedChargingRedux={useSelector(chargingSelectors.getAddedCharging)}
      addedChargingCount={useSelector(chargingSelectors.getAddedChargingCount)}
      availableAndAddedChargingRedux={useSelector(
        chargingSelectors.getAvailableAndAddedCharging
      )}
      isRequestedQuote={useSelector(chargingSelectors.getRequestQuoteFlag)}
      isFinanceCodeALD={useSelector(calculatorSelectors.getIsFinanceCodeALD)}
      includedChargingRedux={useSelector(chargingSelectors.getIncludedCharging)}
      shouldDisplayChargingFinanceChangeNotice={useSelector(
        chargingSelectors.getShouldDisplayChargingFinanceChangeNotice
      )}
      financePlans={useSelector((state) => {
        const isInternational = deliveryDataSelectors.getIsInternational(state);
        const selectorData = {
          customerType: customerTypeToShow,
          isInternational,
        };

        if (!isCategoryCardsEnabled) {
          // get by customer type if payment categories not enabled
          // since there is a toggle for customer types
          return isVehicleMicroserviceEnabled
            ? ngcSelectors.getFinancialPlansByCustomerTypeForIntAndVehicle(
                state,
                selectorData
              )
            : ngcSelectors.getFinancialPlansByCustomerTypeForInt(
                state,
                selectorData
              );
        }

        // payment categories enabled, no toggle for customer type, get
        // all finance plans regardless of customer type
        return isVehicleMicroserviceEnabled
          ? ngcSelectors.getFinancialPlansIncludedForVehicle(state)
          : ngcSelectors.getFinancialPlans(state);
      })}
      isAnyBusinessPlans={useSelector(ngcSelectors.getIsAnyBusinessPlans)}
      selectedFinancePlan={selectedFinancePlan}
      isRequired={Boolean(isRequired)} // comes from AEM as string
      isDealerized={useSelector((state) =>
        cartSelectors.getIsDealerized(state)
      )}
      isOpen={useSelector((state) =>
        cartSelectors.getIsCartAccordionOpen(state, accordionType)
      )}
      isNextStepsClicked={useSelector((state) =>
        cartSelectors.getIsCartAccordionNextStepsClicked(state, accordionType)
      )}
      isComplete={useSelector((state) =>
        cartSelectors.getIsCartAccordionComplete(state, accordionType)
      )}
      showNextSteps={useSelector((state) =>
        cartSelectors.getShouldShowNextSteps(state, accordionType)
      )}
      dealerName={useSelector(dealerDataSelectors.getDealerName)}
      dealerAddress={useSelector(dealerDataSelectors.getDealerFullAddress)}
      firstMinLeadTime={useSelector(deliveryDataSelectors.getFirstMinLeadTime)}
      firstMaxLeadTime={useSelector(deliveryDataSelectors.getFirstMaxLeadTime)}
      customerName={useSelector(userDataSelectors.getUserFullName)}
      customerAddress={useSelector(
        userDataSelectors.getUserAddressCityStateZipCode
      )}
      customerZipCode={useSelector(userDataSelectors.getUserZipCode)}
      dealerZipCode={useSelector(
        deliveryDataSelectors.getDeliveryMethodPostCode
      )}
      calculated={useSelector(calculatorSelectors.getCalculated)}
      financeType={useSelector(calculatorSelectors.getFinanceType)}
      selectedDeliveryMethod={useSelector(
        deliveryDataSelectors.getDeliveryMethodSelected
      )}
      isDeliveryUnavailable={useSelector((state) =>
        deliveryDataSelectors.isDeliveryUnavailable(
          state,
          DELIVERY_CARDS_TYPES.DELIVERY
        )
      )}
      getCartHasSucceeded={useSelector(sapSelectors.getGetCartHasSucceeded)}
      getCartHasSucceededWithValidData={useSelector(
        sapSelectors.getGetCartHasSucceededWithValidData
      )}
      accessToken={useSelector(getAccessToken)}
      hasFMAOrGuestGUIDAuth={useSelector(getFMAorGuestGUIDAuth)}
      cartId={useSelector(getOrderCode)}
      brand={useSelector(orderDataSelector.getIdentityBrand)}
      nameplate={useSelector(orderDataSelector.getNameplate)}
      dealerId={useSelector((state) =>
        dealerDataSelectors.getDealerCommonId(state)
      )}
      protectionPlanDealerId={useSelector(
        protectionPlanDataSelectors.getProtectionPlanDealerId
      )}
      protectionPlanApr={useSelector(
        protectionPlanDataSelectors.getProtectionPlanApr
      )}
      protectionPlanTerm={useSelector(
        protectionPlanDataSelectors.getProtectionPlanTerm
      )}
      protectionPlanFordPayment={useSelector(
        protectionPlanDataSelectors.getProtectionPlanFordPaymentMethod
      )}
      dealerCountry={useSelector(dealerDataSelectors.getDealerCountryCode)}
      dealerState={useSelector(dealerDataSelectors.getDealerState)}
      monthlyPayment={useSelector((state) =>
        calculatorSelectors.getPriceFromEndpoint(state, {
          endpoint: cleanMonthlyEndpoint,
        })
      )}
      totalPayment={useSelector((state) =>
        calculatorSelectors.getPriceFromEndpoint(state, {
          endpoint: cleanTotalEndpoint,
        })
      )}
      msrp={useSelector(calculatorSelectors.getMsrp)}
      apr={useSelector(calculatorSelectors.getApr)}
      vin={useSelector(orderDataSelectors.getVin)}
      routeOneDealerId={useSelector(dealerDataSelectors.getRouteOneId)}
      financedAmount={useSelector(
        calculatorSelectors.getTotalAmountFinancedStandard
      )}
      totalPrice={useSelector(
        (state) =>
          getPriceFromEndpointWithObject(
            calculatorSelectors.getPricingSummary(state),
            ngcSelectors.getSellingPriceNgc(state)
          ) ?? calculatorSelectors.getSellingPrice(state)
      )}
      userCountry={useSelector(userDataSelectors.getUserCountry)}
      fordPaymentMethod={
        selectedFinancePlan ? selectedFinancePlan : PLAN_CODES.CASH
      }
      paymentCategoriesList={useSelector(
        cartSelectors.getPaymentCategoriesList
      )}
      taxesAndFeesAddressId={useSelector(
        cartSelectors.getTaxesAndFeesAddressId
      )}
      taxesFeesCompleted={useSelector(getTaxesFeesComplete)}
      selectedCustomerAppraisals={useSelector(
        tradeInSelector.getSelectedCustomerAppraisals
      )}
      totalTradeInAmount={useSelector(tradeInSelector.getTotalTradeInAmount)}
      tradeInOverageValue={useSelector(tradeInSelector.tradeInOverage)}
      orderCode={useSelector(orderDataSelectors.getOrderId)}
      selectedPaymentCategory={useSelector(
        cartSelectors.getSelectedPaymentCategory
      )}
      orderToCartHasSucceeded={useSelector(
        sapSelectors.getOrderToCartHasSucceeded
      )}
      updateDeliveryOptionsHasSucceeded={useSelector(
        sapSelectors.getUpdateDeliveryOptionsHasSucceeded
      )}
      createCartHasSucceeded={useSelector(
        sapSelectors.getCreateCartHasSucceeded
      )}
      optionItems={useSelector(getAddOnList)}
      term={useSelector(calculatorSelectors.getTerm)}
      milesOrKmPerAnnum={useSelector(calculatorSelectors.getAnnualMileage)}
      deposit={useSelector(calculatorSelectors.getDeposit)}
      userData={useSelector(userDataSelectors.getUserSlice)}
      keepLicensePlateFlag={useSelector(getKeepLicensePlates)}
      registrationMonth={useSelector(getRegistrationMonth)}
      totalTaxesAndFees={useSelector(getTotalTaxesAndFees)}
      protectionPlanTotalPrice={useSelector(
        protectionPlanDataSelectors.getAddedPlansTotalPrice
      )}
      addedProtectionPlanCount={useSelector(
        protectionPlanDataSelectors.getAddedPlansCount
      )}
      addedProtectionPlans={useSelector(
        protectionPlanDataSelectors.getProtectionPlanCartData
      )}
      financedTerm={useSelector(calculatorSelectors.getTerm)}
      protectionPlanMonthlyPrice={useSelector(
        protectionPlanDataSelectors.getAddedPlansTotalMonthlyPrice
      )}
      accessoriesMonthlyPrice={useSelector(
        accessorySelectors.getTotalMonthlyPrice
      )}
      chargingById={useSelector(chargingSelectors.getChargingById)}
      accessoriesById={useSelector(accessorySelectors.getAccessoriesById)}
      chargingTotalMonthlyPrice={useSelector(
        chargingSelectors.getChargingTotalMonthlyPrice
      )}
      chargingTotalPrice={useSelector(chargingSelectors.getChargingTotalPrice)}
      // vehicle UI config
      showAccessories={useSelector(
        vehicleUiConfigSelectors.getShouldShowAccessoriesForSelectedPaymentPlan
      )}
      showCharging={useSelector(
        vehicleUiConfigSelectors.getShouldShowChargingForSelectedPaymentPlan
      )}
      showDeliveryMethod={useSelector(
        vehicleUiConfigSelectors.getShouldShowDeliveryMethodForSelectedPaymentPlan
      )}
      showIncentives={useSelector(
        vehicleUiConfigSelectors.getShouldShowIncentivesForSelectedPaymentPlan
      )}
      showProtectionPlans={useSelector(
        vehicleUiConfigSelectors.getShouldShowProtectionPlansForSelectedPaymentPlan
      )}
      showTradeIn={useSelector(
        vehicleUiConfigSelectors.getShouldShowTradeInForSelectedPaymentPlan
      )}
      showTaxesAndFees={useSelector(
        vehicleUiConfigSelectors.getShouldShowTaxesAndFeesForSelectedPaymentPlan
      )}
      linkGuestAccountSuccess={useSelector(
        sapSelectors.getLinkGuestAccountHasSucceeded
      )}
      userHasGuestGUID={useSelector(getUserHasGuestGUID)}
      isProfileSuccess={useSelector(userDataSelectors.getProfileHasSucceeded)}
      suggestedDealers={useSelector((state) => getSuggestedDealers(state))}
      financeUpdateHasSucceeded={useSelector(
        sapSelectors.getFinanceUpdateHasSucceeded
      )}
      hasUserLocationFailed={useSelector(getUserLocationHasFailed)}
      showDealerSelect={useSelector(deliveryDataSelectors.getShowDealerSelect)}
      dealerSelectDealerDistance={useSelector(
        getDealerSelectDealerDistanceFormatted
      )}
      dealerSearchParams={useSelector(getDealerSearchQueryParams)}
      deliveryDataDealerDistance={useSelector(
        deliveryDataSelectors.getDistance
      )}
      removeTradeInHasSucceeded={useSelector(
        sapSelectors.getRemoveTradeInsHasSucceeded
      )}
      autoAllocateDealerHasFailed={useSelector(getAutoAllocateDealerHasFailed)}
    />
  );
};

export default MapTo(
  'bev-cart_checkout/sites/components/content/cartAccordion'
)(CartAccordionContainer);
