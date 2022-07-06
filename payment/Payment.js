import React, { Component } from 'react';
import { MapTo } from '@adobe/cq-react-editable-components';
import { connect } from 'react-redux';
import YourOrderController from './yourorder/controller/YourOrderController';
import PaymentPrompt from './paymentPrompt/PaymentPrompt';
import SapCommerceService from '@Services/sapCommerceService/SapCommerceService';
import { ErrorType } from '../preferredDealer/errorMessage/ErrorMessage';
import AnalyticsService from '@Services/analyticsService/AnalyticsService';
import BrowserWindowHelper from '@Utils/BrowserWindowHelper';
import { Redirect } from 'react-router';
import { getIsNewOrder, isEditorMode } from '@Utils/Utils';
import PageLevelErrorComponent from '@Common/pageLevelErrorComponent/PageLevelErrorComponent';
import JwtDecoder from '@Utils/JwtDecoder';
import ReservationLimitModal from '../yourDetails/reservationLimitModal/ReservationLimitModal';
import FmaAuthenticationService from '@Services/fmaAuthenticationService/FmaAuthenticationService';
import PropertiesService from '@Services/propertiesService/PropertiesService';
import CountryInformationService from '@Services/countryInformationService/CountryInformationService';
import { getFmaIsAuthenticated } from '@Slices/fma/selectors';
import './Payment.scss';
import {
  getOrderId,
  getOrderType,
  getOrderData,
} from '@Ducks/orderData/selectors';
import { getSpaFlowInfo } from '@Ducks/spaState/selectors';
import { getDealerData } from '@Ducks/dealerData/selectors';
import { getDealerDeposit } from '@Ducks/calculator/selectors';
import {
  getJwtToken,
  getOrderCode,
  getOrderDepositPrice,
  getPricingInformation,
} from '@Ducks/pricingInformation/selectors';
import { getAffiliation } from '@Ducks/ui/selectors';
import { disclosuresAuthorSelected } from '@Ducks/ui/actions';
import { getProductCatalogId } from '@Ducks/productConfigurationData/selectors';
import FDSActivitySpinner from '@FDS/activitySpinner/FDSActivitySpinner';

export class Payment extends Component {
  constructor(props) {
    super(props);
    this.fmaLangCode = PropertiesService.getPageProperties().fmaLangCode;
    this.countryCode = CountryInformationService.getCountryCode(
      this.fmaLangCode
    );
    this.paymentLibraryType = PropertiesService.getPageProperties().paymentLibraryType;
    this.state = {
      errorState: '',
      redirect: false,
      showLoader: true,
      showErrorMessage: false,
      reservationLimitReached: false,
    };
  }

  componentDidMount() {
    const {
      disclosuresAuthorSelected,
      basePriceEUDis,
      configuredOptionLabelEUDis,
      dealerSellingPriceEUDis,
      baseMsrpEUDis,
      totalOptionsEUDis,
      totalMsrpEUDis,
      differenceFromTotalEUDis,
      dealerSellingPriceSubLabelEUDis,
      estimatedAmountFinancedEUDis,
      downPaymentEUDis,
      dealerDepositEUDis,
      currentIncentivesEUDis,
      tradeInAmountEUDis,
      estimatedAmountFinancedSubEUDis,
      fordDealerDepositEUDis,
      totalToPayEUDis,
      totalFeesEUDis,
      accTaxEUDis,
      estimatedNetPriceEUDis,
      pricingInformation,
    } = this.props;

    const selectedDisclosures = [
      basePriceEUDis,
      configuredOptionLabelEUDis,
      dealerSellingPriceEUDis,
      baseMsrpEUDis,
      totalOptionsEUDis,
      totalFeesEUDis,
      accTaxEUDis,
      estimatedNetPriceEUDis,
      totalMsrpEUDis,
      differenceFromTotalEUDis,
      dealerSellingPriceSubLabelEUDis,
      estimatedAmountFinancedEUDis,
      downPaymentEUDis,
      dealerDepositEUDis,
      currentIncentivesEUDis,
      tradeInAmountEUDis,
      estimatedAmountFinancedSubEUDis,
      fordDealerDepositEUDis,
      totalToPayEUDis,
    ];
    disclosuresAuthorSelected(selectedDisclosures);
    this.handleFordPayEUError();

    const { dealerData, spaFlowInfo } = this.props;

    if (!window.fma.accessToken) {
      FmaAuthenticationService.setRedirectUrl(
        spaFlowInfo?.[2]?.url,
        spaFlowInfo?.[2]?.title || document.title
      );
    }

    this.setState({ showLoader: false });

    const dealerCode = dealerData?.commonId || '';
    AnalyticsService.paymentPageLoad(
      dealerCode,
      this.fmaLangCode,
      pricingInformation
    );
  }

  componentWillUnmount() {
    disclosuresAuthorSelected([]);
  }

  handleFordPayEUError() {
    // FordPay EU may have returned the user to the Payment page. This can be determined by the presence of a 'paymentResponse' URL parameter
    const fordPayToken = BrowserWindowHelper.getUrlParam('paymentResponse');
    if (fordPayToken && fordPayToken !== '') {
      // If a token was in a URL parameter, then handle the error from FordPay EU
      this.handleEuFordPayError(fordPayToken);
    }
    this.setState({
      showLoader: false,
    });
  }
  async checkNumberOfReservations() {
    const { catalogId } = this.props;
    return SapCommerceService.reservationCount(
      window.fma.CATBundle.access_token,
      this.countryCode,
      catalogId
    ).then((response) => {
      if (Number.isInteger(response)) {
        return {
          limitReached: response >= 2,
          error: null,
        };
      } else {
        return {
          limitReached: null,
          error: response,
        };
      }
    });
  }

  handleEuFordPayError = (fordPayToken) => {
    // Check if the reservation was actually made despite IPG returning to the Payment page
    const tokenPayload = JwtDecoder.base64UrlDecode(fordPayToken);
    SapCommerceService.reservationDetails(
      tokenPayload.customFields.orderId,
      window.fma.CATBundle.access_token,
      this.countryCode
    ).then(
      (response) => {
        if (response.status === 200) {
          // The reservation was made, so redirect to the Confirmation page
          this.setState({
            redirect: true,
          });
        } else {
          // The reservation was not made, so display the error message
          this.changePaymentErrorState(ErrorType.EU_FORDPAY_PAYMENT);
        }

        return response.status;
      },
      () => {
        // Could not call reservationDetails to verify if a reservation was made, so indicate that there is an error with the payment
        this.changePaymentErrorState(ErrorType.EU_FORDPAY_PAYMENT);
      }
    );
  };

  getErrorMessage = (type) => {
    const { euFordPayPaymentErrorMessage } = this.props;

    switch (type) {
      case ErrorType.EU_FORDPAY_PAYMENT:
        return euFordPayPaymentErrorMessage;
      default:
        return null;
    }
  };

  changePaymentErrorState = (type) => {
    this.setState({
      errorState: type,
    });
  };

  displayLoader = (value) => {
    this.setState({
      showLoader: value,
    });
  };

  render() {
    const {
      modalHeader,
      modalParagraph1,
      modalParagraph2,
      paymentInformationRetrievalErrorMessageHeader,
      paymentInformationRetrievalErrorMessage,
      paymentInformationRetrievalErrorActionCtaName,
      jwtToken,
      reservationsUrl,
      orderData,
      depositPrice,
      orderType,
      paymentRedirectUrl,
      catalogId,
    } = this.props;

    const {
      showLoader,
      reservationLimitReached,
      showErrorMessage,
      errorState,
      redirect,
    } = this.state;

    if (reservationLimitReached) {
      return (
        <ReservationLimitModal
          modalHeader={modalHeader}
          modalParagraph1={modalParagraph1}
          modalParagraph2={modalParagraph2}
          redirectUrl={reservationsUrl}
        />
      );
    }

    const isNewOrder = getIsNewOrder(orderType);

    if (showErrorMessage && !isEditorMode()) {
      return (
        <PageLevelErrorComponent
          errorHeader={paymentInformationRetrievalErrorMessageHeader}
          message={paymentInformationRetrievalErrorMessage}
          actionText={paymentInformationRetrievalErrorActionCtaName}
          onClick={() => window.location.reload()}
        />
      );
    }
    return (
      <div className="payment-components-container">
        {!isEditorMode() && showLoader && (
          <FDSActivitySpinner isFullscreen={true} isVisible={showLoader} />
        )}
        <div className="payment-left">
          <PaymentPrompt
            id="payment-prompt"
            countryCode={this.countryCode}
            fmaLangCode={this.fmaLangCode}
            orderType={orderData?.order?.orderType}
            fordPayEuIsLoaded={() => {
              this.setState({ showLoader: false });
            }}
            prepareToken={jwtToken}
            errorMessage={this.getErrorMessage(errorState)}
            changePaymentErrorState={this.changePaymentErrorState}
            paymentRedirectUrl={paymentRedirectUrl}
            depositPrice={depositPrice}
            catalogId={catalogId}
            {...this.props}
          />
        </div>
        <div className="payment-right">
          <YourOrderController
            countryCode={this.countryCode}
            {...this.props}
            isNewOrder={isNewOrder}
            displayNextButton={false}
          />
        </div>

        {redirect && <Redirect to={paymentRedirectUrl} />}
      </div>
    );
  }
}

const mapStateToProp = (state) => {
  return {
    affiliation: getAffiliation(state),
    isAuthenticated: getFmaIsAuthenticated(state),
    spaFlowInfo: getSpaFlowInfo(state),
    orderCode: getOrderCode(state),
    jwtToken: getJwtToken(state),
    depositPrice: getOrderDepositPrice(state),
    dealerData: getDealerData(state),
    orderData: getOrderData(state),
    orderId: getOrderId(state),
    orderType: getOrderType(state),
    orderDeposit: getDealerDeposit(state),
    catalogId: getProductCatalogId(state),
    pricingInformation: getPricingInformation(state),
  };
};

const mapDispatchToProps = {
  disclosuresAuthorSelected,
};

export default MapTo('bev-cart_checkout/sites/components/content/payment')(
  connect(mapStateToProp, mapDispatchToProps, null)(Payment)
);
