import React, { Component } from 'react';
import HorizontalRule from '@Common/horizontalRule/HorizontalRule';
import Disclaimer from '@Common/disclaimer/Disclaimer';
import AcceleratorDisclosureToolTipContainer from '@Common/tooltip/acceleratorDisclosureToolTip/AcceleratorDisclosureToolTipContainer';
import Arrow from '@Common/arrow/Arrow';
import { getIsCountryNorway, isEventAriaTrigger } from '@Utils/Utils';
import { connect } from 'react-redux';
import { MapTo } from '@adobe/cq-react-editable-components';
import PriceItem from './PriceItem/PriceItem';
import './YourOrder.scss';
import { getDealerName } from '@Ducks/dealerData/selectors';
import {
  getAnnualMileage,
  getApr,
  getBalloonPayment,
  getFinancePlan,
  getMonthlyPayment,
  getSharedData,
  getFinanceType,
  getTerm,
} from '@Ducks/calculator/selectors';
import {
  getAccTax,
  getBaseMSRP,
  getConfiguredOptions,
  getDifferenceFromMSRP,
  getJwtToken,
  getOrderCode,
  getOrderDepositPrice,
  getPaymentTransactionId,
  getTotalDealerPrice,
  getTotalFees,
  getTotalMSRP,
  getTotalMsrpIncludingDestination,
} from '@Ducks/pricingInformation/selectors';
import {
  getPowerTrainDescriptions,
  getSeriesDescriptions,
  getVehicleImageURL,
} from '@Ducks/productConfigurationData/selectors';
import { getEstimatedNetPrice } from '@Ducks/vehiclePricing/selectors';
import { PLAN_CODES } from '@Constants/calculator';
import Image from '@Common/image/Image';

export class YourOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ialVehicleDepositAmount: '',
      showCurrentAvailableIncentivesSection: false,
      showConfiguredOptionsSection: false,
      showDealerSellingPriceSection: false,
      showEstimatedAmountFinancedSection: false,
    };

    this.ARROW_CODES = {
      CURRENT_AVAILABLE_INCENTIVES: 'currentAvailableIncentives',
      CONFIGURED_OPTIONS: 'configuredOptions',
      DEALER_SELLING_PRICE: 'dealerSellingPrice',
      ESTIMATED_AMOUNT_FINANCED: 'estimatedAmountFinanced',
    };
  }

  componentDidMount() {
    const { dealerData } = this.props;

    if (dealerData) {
      this.setState({
        ialVehicleDepositAmount: dealerData?.reservationDeposit?.value,
      });
    }
  }

  handleClick = (event, id) => {
    const {
      showCurrentAvailableIncentivesSection,
      showConfiguredOptionsSection,
      showEstimatedAmountFinancedSection,
    } = this.state;

    const {
      CURRENT_AVAILABLE_INCENTIVES,
      CONFIGURED_OPTIONS,
      ESTIMATED_AMOUNT_FINANCED,
    } = this.ARROW_CODES;

    switch (id) {
      case CURRENT_AVAILABLE_INCENTIVES:
        this.setState({
          showCurrentAvailableIncentivesSection: !showCurrentAvailableIncentivesSection,
        });
        break;
      case CONFIGURED_OPTIONS:
        this.setState({
          showConfiguredOptionsSection: !showConfiguredOptionsSection,
        });
        break;
      case ESTIMATED_AMOUNT_FINANCED:
        this.setState({
          showEstimatedAmountFinancedSection: !showEstimatedAmountFinancedSection,
        });
        break;
      default:
        return;
    }
  };

  renderDisclaimer = (disclaimerDetails) => {
    if (disclaimerDetails) {
      return (
        <>
          {disclaimerDetails?.vdmDisclaimerKey && (
            <Disclaimer
              disclaimerDetailsProps={disclaimerDetails}
              altText={disclaimerDetails.vdmDisclaimerKey}
            />
          )}
          {disclaimerDetails?.euDisclaimerName && (
            <AcceleratorDisclosureToolTipContainer
              className="eu-disclosure"
              disclosureName={disclaimerDetails.euDisclaimerName}
              altText={disclaimerDetails.euDisclaimerName}
            />
          )}
        </>
      );
    }
  };

  renderDescriptionWithArrow = (
    description,
    disclaimerDetails,
    id,
    arrowOrientation,
    price
  ) => {
    return (
      <div className="description-with-arrow" key={description}>
        <div className="description-and-disclaimer">
          {description}
          {this.renderDisclaimer(disclaimerDetails)}
        </div>
        <div
          id={id}
          role="button"
          aria-label="Your Order Description"
          tabIndex="0"
          onClick={(event) => this.handleClick(event, id)}
          onKeyDown={(event) =>
            isEventAriaTrigger(event) && this.handleClick(event, id)
          }
        >
          {price && <span>{price}</span>}
          <Arrow
            orientation={arrowOrientation}
            imgScaleClassName="new-order-arrow"
          />
        </div>
      </div>
    );
  };

  render() {
    const {
      backgroundImageFile,
      totalMsrpText,
      configOptions,
      className,
      handleYourOrderClose,
      isNewOrder,
      paymentGuarantee,
      paymentTotalText,
      preOrderDisclaimerText,
      preOrderText,
      yourDealerLabel,
      yourOrder,
      yourOrderCloseText,
      vehicleImageURL,
      dealerName,
      seriesDescriptions,
      powerTrainDescriptions,
      baseMSRP,
      configuredOptions,
      totalMSRP,
      orderDepositPrice,
      paymentPlanData,
      estimatedNetPriceText,
      estimatedNetPrice,
      basePriceDisclaimerDisc,
      basePriceEUDis,
      configOptionsDisclaimerDisc,
      configuredOptionLabelEUDis,
      totalMsrpDisclaimerDisc,
      totalMsrpEUDis,
      fordDealerDepositDisclaimerDisc,
      fordDealerDepositEUDis,
      totalToPayDisclaimerDisc,
      totalToPayEUDis,
      countryCode,
      estimatedNetPriceDisclaimerDisc,
      estimatedNetPriceEUDis,
      finalBalloonPaymentDisc,
    } = this.props;

    const vehicleName = `${seriesDescriptions} ${powerTrainDescriptions}`;

    const basePriceDisclaimer = {
      vdmDisclaimerKey: basePriceDisclaimerDisc,
      euDisclaimerName: basePriceEUDis,
    };

    const configuredOptionsDisclaimer = {
      vdmDisclaimerKey: configOptionsDisclaimerDisc,
      euDisclaimerName: configuredOptionLabelEUDis,
    };

    const totalToPayTodayDisclaimer = {
      vdmDisclaimerKey: totalToPayDisclaimerDisc,
      euDisclaimerName: totalToPayEUDis,
    };

    const fordDealerDepositDisclaimer = {
      vdmDisclaimerKey: fordDealerDepositDisclaimerDisc,
      euDisclaimerName: fordDealerDepositEUDis,
    };

    const estimatedNetPriceDisclaimers = {
      vdmDisclaimerKey: estimatedNetPriceDisclaimerDisc,
      euDisclaimerName: estimatedNetPriceEUDis,
    };

    const totalMSRPDisclaimer = {
      vdmDisclaimerKey: totalMsrpDisclaimerDisc,
      euDisclaimerName: totalMsrpEUDis,
    };

    return (
      <div className={`ford-your-order-container ${className}`}>
        <div className="header-wrapper">
          <div className="title-and-close">
            <h2 className="title" aria-label={yourOrder}>
              {yourOrder}
            </h2>
            <button
              className="close-action"
              onClick={handleYourOrderClose}
              aria-label={yourOrderCloseText}
            >
              <div className="close-icon" />
              <div className="close-icon flip" />
            </button>
          </div>
        </div>

        <div className="car-and-background">
          <img
            className="basket-background-image"
            src={backgroundImageFile}
            alt=""
          />
          <Image
            accessToken={window?.fma?.CATBundle?.access_token}
            imgClassName="basket-vehicle-image"
            src={vehicleImageURL}
          />
        </div>

        <div className="your-order-content">
          <div className="model-price-container">
            <h3 className="vehicle-model-text" aria-label={vehicleName}>
              {vehicleName}
            </h3>

            <div
              className="pre-order-disclaimer"
              aria-label={preOrderDisclaimerText}
            >
              {preOrderDisclaimerText}
            </div>
            {/* Pricing Stack for Mach-e (full configurator) */}
            <div className="full-config-pricing-stack">
              <div className="vehicle-configuration">
                {/* Vehicle Name (series and powerTrain with baseMSRP*/}
                <PriceItem
                  description={vehicleName}
                  priceValue={
                    getIsCountryNorway(countryCode) ? totalMSRP : baseMSRP
                  }
                  disclaimerDetails={basePriceDisclaimer}
                  formattingRequired={true}
                  isIalPrice={true}
                  disclaimerOnLabel={false}
                  renderDisclaimer={this.renderDisclaimer}
                />

                {/* Configured Options headline along with configured Options total price */}
                <PriceItem
                  description={configOptions}
                  priceValue={configuredOptions?.configuredOptionsTotalPrice}
                  disclaimerDetails={configuredOptionsDisclaimer}
                  formattingRequired={true}
                  isIalPrice={true}
                  renderDisclaimer={this.renderDisclaimer}
                />

                {/* Configured options items */}
                <div className="trim-options-container">
                  {configuredOptions?.optionsList.map((option) => {
                    return (
                      <PriceItem
                        description={option?.description}
                        priceValue={option?.msrp}
                        formattingRequired={true}
                        isIalPrice={true}
                        key={option?.description}
                        suppressZeroValue={true}
                      />
                    );
                  })}
                </div>

                <HorizontalRule className="horizontal-rule" />
              </div>

              {/* Estimated MSRP (total MSRP) for reservations flow */}
              {!isNewOrder && totalMsrpText && (
                <>
                  <PriceItem
                    description={totalMsrpText}
                    priceValue={totalMSRP}
                    disclaimerDetails={totalMSRPDisclaimer}
                    formattingRequired={true}
                    isIalPrice={true}
                    disclaimerOnLabel={false}
                    renderDisclaimer={this.renderDisclaimer}
                  />
                  <HorizontalRule className="horizontal-rule" />
                </>
              )}

              {!isNewOrder && estimatedNetPriceText && (
                <>
                  <PriceItem
                    description={estimatedNetPriceText}
                    priceValue={estimatedNetPrice}
                    disclaimerDetails={estimatedNetPriceDisclaimers}
                    renderDisclaimer={this.renderDisclaimer}
                    formattingRequired={true}
                    isIalPrice={true}
                  />
                  <HorizontalRule className="horizontal-rule" />
                </>
              )}
            </div>

            {/* Ford Deposit Amount - Reservations flow or on EU */}
            {!isNewOrder && (
              <>
                <PriceItem
                  description={preOrderText}
                  priceValue={orderDepositPrice}
                  formattingRequired={true}
                  isIalPrice={true}
                  disclaimerDetails={fordDealerDepositDisclaimer}
                  disclaimerOnLabel={false}
                  renderDisclaimer={this.renderDisclaimer}
                />
                {paymentGuarantee && (
                  <div className="payment-guarantee">{paymentGuarantee}</div>
                )}
                <HorizontalRule className="horizontal-rule" />
              </>
            )}

            {/* Total to pay deposit */}
            <PriceItem
              description={paymentTotalText}
              priceValue={orderDepositPrice}
              disclaimerDetails={totalToPayTodayDisclaimer}
              classNames={{ description: '', price: 'larger' }}
              formattingRequired={true}
              isIalPrice={true}
              disclaimerOnLabel={false}
              renderDisclaimer={this.renderDisclaimer}
            />
          </div>
          {/* Dealer Details */}
          <div className="your-dealer-info">
            <h3 className="prompt" aria-label={yourDealerLabel}>
              {yourDealerLabel}
            </h3>
            <div className="dealer" aria-label={dealerName}>
              {dealerName}
            </div>
          </div>
          {finalBalloonPaymentDisc &&
            paymentPlanData?.financePlan === PLAN_CODES.FORD_OPTIONS && (
              <div
                className="final-balloon-payment-disclaimer"
                dangerouslySetInnerHTML={{
                  __html: finalBalloonPaymentDisc,
                }}
              />
            )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  orderCode: getOrderCode(state),
  jwtToken: getJwtToken(state),
  paymentTransactionId: getPaymentTransactionId(state),
  orderDepositPrice: getOrderDepositPrice(state),
  baseMSRP: getBaseMSRP(state),
  totalMSRP: getTotalMSRP(state),
  totalMSRPIncludingDestinationCharges: getTotalMsrpIncludingDestination(state),
  totalDealerPrice: getTotalDealerPrice(state),
  differenceFromMSRP: getDifferenceFromMSRP(state),
  configuredOptions: getConfiguredOptions(state),
  totalFees: getTotalFees(state),
  accTax: getAccTax(state),
  dealerName: getDealerName(state),
  paymentPlanData: getSharedData(state),
  vehicleImageURL: getVehicleImageURL(state),
  seriesDescriptions: getSeriesDescriptions(state),
  powerTrainDescriptions: getPowerTrainDescriptions(state),
  estimatedNetPrice: getEstimatedNetPrice(state),
  term: getTerm(state),
  apr: getApr(state),
  annualMileage: getAnnualMileage(state),
  balloonPayment: getBalloonPayment(state),
  estimatedMonthlyPayment: getMonthlyPayment(state),
  financeType: getFinanceType(state),
  financePlan: getFinancePlan(state),
});

export default MapTo('bev-cart_checkout/sites/components/content/yourDetails')(
  connect(mapStateToProps)(YourOrder)
);
