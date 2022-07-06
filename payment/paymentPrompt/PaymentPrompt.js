import React, { Component } from 'react';
import CheckBox from '@Common/inputs/checkBox/CheckBox';
import HorizontalRule from '@Common/horizontalRule/HorizontalRule';
import Disclaimer from '@Common/disclaimer/Disclaimer';
import AnalyticsService from '@Services/analyticsService/AnalyticsService';
import PropertiesService from '@Services/propertiesService/PropertiesService';
import CurrencyFormatter from '@Utils/currencyFormatter/CurrencyFormatter';
import LanguageCodeHelper from '@Utils/LanguageCodeHelper';
import PaymentMethod from '../../readyToOrder/paymentMethod/PaymentMethod';
import AemMultiFieldHelper from '@Utils/aemMultiFieldHelper/AemMultiFieldHelper';
import { getIsNewOrder } from '@Utils/Utils';
import SapCommerceService from '@Services/sapCommerceService/SapCommerceService';
import { ErrorType } from '../../preferredDealer/errorMessage/ErrorMessage';
import './PaymentPrompt.scss';
import AcceleratorDisclosureToolTipContainer from '@Common/tooltip/acceleratorDisclosureToolTip/AcceleratorDisclosureToolTipContainer';

export class PaymentPrompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptedTermsAndConditions: false,
      financeType: '',
      isDisclaimerModalOpen: false,
      toolTipOpen: false,
    };
  }

  componentDidMount() {
    const { prepareToken } = this.props;
    if (prepareToken) this.initializeFordPayEu();
  }

  componentDidUpdate(prevProps, prevState) {
    const { prepareToken } = this.props;
    const { toolTipOpen } = this.state;

    if (prepareToken && prevProps.prepareToken !== prepareToken) {
      this.initializeFordPayEu();
    }

    if (toolTipOpen && prevState.toolTipOpen !== toolTipOpen) {
      let toolTipCloseButton;
      const interval = setInterval(() => {
        toolTipCloseButton = document.getElementById('tooltip-close');
        if (toolTipCloseButton) {
          clearInterval(interval);
          toolTipCloseButton.focus();
        }
      });
    }
  }

  componentWillUnmount() {
    const euFordPayButton = document.querySelector('#fordPayDiv form');
    if (euFordPayButton)
      euFordPayButton.removeEventListener('click', this.invokeFordPay);
  }

  updateAttributesOfFordPayButton() {
    const { acceptedTermsAndConditions } = this.state;

    const fordPayForm = document.querySelector('#fordPayDiv');
    const fordPayButton = document.querySelector('#fordPayDiv button');
    if (!fordPayForm || !fordPayButton) {
      return;
    }

    if (!acceptedTermsAndConditions) {
      fordPayForm.style.pointerEvents = 'none';
      fordPayForm.classList.add('opacity-grayscale');
    } else {
      fordPayForm.style.pointerEvents = 'unset';
      fordPayForm.classList.remove('opacity-grayscale');
    }
    if (!acceptedTermsAndConditions) {
      fordPayButton.setAttribute(
        'disabled',
        (!acceptedTermsAndConditions).toString()
      );
    } else {
      fordPayButton.removeAttribute('disabled');
    }
  }

  initializeFordPayEu = () => {
    const {
      fordPayEuIsLoaded,
      prepareToken,
      paymentRedirectUrl,
      spaFlowInfo,
      reservationMakePaymentActionText,
    } = this.props;

    if (!prepareToken) return;

    const IPGData = {
      jwtToken: prepareToken,
      timezone: 'Etc/UTC',
      responseSuccessURL:
        paymentRedirectUrl || window.location.origin + spaFlowInfo?.[3].url,
      responseFailURL: window.location.href,
      notificationURL: null,
      language: LanguageCodeHelper.mapLanguageCode(
        PropertiesService.getPageProperties().fmaLangCode
      ),
    };

    const timeout = setInterval(() => {
      if (window.showFordPayIPG) {
        window.showFordPayIPG.default(
          IPGData,
          document.getElementById('fordPayDiv'),
          reservationMakePaymentActionText
        );
        if (document.querySelector('#fordPayDiv button')) {
          this.updateAttributesOfFordPayButton();
          document
            .querySelector('#fordPayDiv button')
            .addEventListener('click', this.invokeFordPay);
          fordPayEuIsLoaded();
          clearInterval(timeout);
        }
      }
    }, 200);
  };

  invokeFordPay = (paymentConditionalCheckboxes) => {
    const {
      affiliation,
      changePaymentErrorState,
      countryCode,
      orderCode,
      fmaLangCode,
      pricingInformation,
    } = this.props;
    const { financeType } = this.state;

    AnalyticsService.makePayment(fmaLangCode, pricingInformation);

    const body = {
      financeData: {
        financeType: financeType,
      },
      fordAffiliation: affiliation,
      orderCode: orderCode,
      isFordTandCAccepted:
        paymentConditionalCheckboxes?.termsAndConditions?.value,
    };
    SapCommerceService.orderUpdate(
      body,
      window?.fma?.CATBundle?.access_token,
      countryCode
    ).then((response) => {
      // Status of 200 does not return any response body
      if (response.status !== 200) {
        changePaymentErrorState(ErrorType.EU_FORDPAY_PAYMENT);
      }
    });
  };

  renderFordPayContainer = () => {
    const {
      promptPrivacyPolicyURL,
      promptTermsAndConditionsAfterText,
      promptTermsAndConditionsButtonText,
      promptTermsAndConditionsButtonTextSecond,
      promptTermsAndConditionsMiddleText,
      promptTermsAndConditionsPretext,
      promptTermsAndConditionsURL,
    } = this.props;

    return (
      <div>
        <CheckBox
          className="checkbox"
          onClick={this.handleCheckBoxClick}
          id="terms-and-conditions-checkbox"
          tabIndex="0"
          aria-label={
            promptTermsAndConditionsPretext +
            promptTermsAndConditionsButtonText +
            promptTermsAndConditionsMiddleText +
            promptTermsAndConditionsButtonTextSecond +
            promptTermsAndConditionsAfterText
          }
        >
          {promptTermsAndConditionsPretext}
          {promptTermsAndConditionsButtonText && (
            <a
              href={promptTermsAndConditionsURL || '#'}
              target="_blank"
              tabIndex="0"
              aria-label={promptTermsAndConditionsButtonText}
              rel="noopener noreferrer"
            >
              <button className="prompt-button" id="prompt-first-button">
                {promptTermsAndConditionsButtonText}
              </button>
            </a>
          )}
          {promptTermsAndConditionsMiddleText}
          {promptTermsAndConditionsButtonTextSecond && (
            <a
              href={promptPrivacyPolicyURL || '#'}
              target="_blank"
              tabIndex="0"
              aria-label={promptTermsAndConditionsButtonTextSecond}
              rel="noopener noreferrer"
            >
              <button className="prompt-button" id="prompt-second-button">
                {promptTermsAndConditionsButtonTextSecond}
              </button>
            </a>
          )}
          {promptTermsAndConditionsAfterText}
        </CheckBox>
        <div id="fordPayDiv" />
      </div>
    );
  };

  handleCheckBoxClick = () => {
    const { acceptedTermsAndConditions } = this.state;
    this.setState(
      {
        acceptedTermsAndConditions: !acceptedTermsAndConditions,
      },
      () => {
        this.updateAttributesOfFordPayButton();
      }
    );
  };

  toolTipHandler = () => {
    const { toolTipOpen } = this.state;
    this.setState(
      {
        toolTipOpen: !toolTipOpen,
      },
      () => {
        if (!toolTipOpen) document.getElementById('disclaimer-button').focus();
      }
    );
  };

  closeToolTip = () => {
    this.setState({
      toolTipOpen: false,
    });
  };

  handlePromptDisclaimer = (status) => {
    this.setState({
      isDisclaimerModalOpen: status,
    });
  };

  updateFinanceType = (financeType) => {
    this.setState({
      financeType,
    });
  };

  render() {
    const {
      cardChargeText,
      className,
      confirmationText,
      cqPath,
      disclaimerAltText,
      indicateText,
      errorMessage,
      methodsOfPaymentText,
      paymentMethodTitle,
      paymentTitleText,
      reservationToPayText,
      reservationTopText,
      orderType,
      depositPrice,
      totalToPayDisclaimerDisc,
      totalToPayEUDis,
    } = this.props;

    const totalPayTodayDisclaimerDetails = {
      vdmDisclaimerKey: totalToPayDisclaimerDisc,
      euDisclaimerName: totalToPayEUDis,
    };

    const paymentMethodProps = {
      paymentMethodTitle,
      indicateText,
      paymentOptions: AemMultiFieldHelper.getMultiFieldProps(
        cqPath + '/paymentMethod'
      ),
      updateFinanceType: this.updateFinanceType,
    };

    const isNewOrder = getIsNewOrder(orderType);

    const priceValue = CurrencyFormatter.formatPrice({
      price: depositPrice,
    });
    return (
      <div className={`ford-payment-prompt ${className}`}>
        <h1 className="payment-title">{paymentTitleText}</h1>
        <div className="reservation-deposit-text-div">
          <p className="reservation-deposit-text">{reservationTopText}</p>
        </div>
        <div className="reservation-price">
          {priceValue}
          {totalPayTodayDisclaimerDetails?.vdmDisclaimerKey && (
            <Disclaimer
              disclaimerDetailsProps={totalPayTodayDisclaimerDetails}
              altText={disclaimerAltText}
            />
          )}
          {totalPayTodayDisclaimerDetails?.euDisclaimerName && (
            <AcceleratorDisclosureToolTipContainer
              className="eu-disclosure reservation-price-eu-disclosure"
              disclosureName={totalPayTodayDisclaimerDetails?.euDisclaimerName}
              altText={totalPayTodayDisclaimerDetails?.euDisclaimerName}
            />
          )}
        </div>
        <p className="reservation-to-pay-text">{reservationToPayText}</p>
        <p className="card-charge-text">{cardChargeText}</p>
        <>
          <div className="methods-of-payment">{methodsOfPaymentText}</div>
          {isNewOrder && <PaymentMethod {...paymentMethodProps} />}
        </>
        <>
          <HorizontalRule className="horizontal-rule" />
          <p className="confirmation-text" aria-label={confirmationText}>
            {confirmationText}
          </p>
          {errorMessage && (
            <p className="ford-pay-error-message">{errorMessage}</p>
          )}
          <div className="button-container">
            {this.renderFordPayContainer()}
          </div>
        </>
      </div>
    );
  }
}

export default PaymentPrompt;
