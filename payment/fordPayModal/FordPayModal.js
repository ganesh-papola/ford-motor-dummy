import MessageModal from '@Common/modal/messageModal/MessageModal';
import React from 'react';
import { connect } from 'react-redux';
import { ErrorType } from '../../preferredDealer/errorMessage/ErrorMessage';
import UserProfileService from '@Services/userProfileService/UserProfileService';
import { getFmaIsAuthenticated } from '@Slices/fma/selectors';
import { getDealerData } from '@Ducks/dealerData/selectors';
import { getOrderCode } from '@Ducks/pricingInformation/selectors';
import { FORDPAY_LIBRARY_TYPES } from '@Constants/main';
import PropertiesService from '@Services/propertiesService/PropertiesService';
import CountryInformationService from '@Services/countryInformationService/CountryInformationService';
import LanguageCodeHelper from '@Utils/LanguageCodeHelper';

class FordPayModal extends React.Component {
  constructor(props) {
    super(props);
    this.fmaLangCode = PropertiesService.getPageProperties().fmaLangCode;
    this.countryCode = CountryInformationService.getCountryCode(
      this.fmaLangCode
    );
    this.fordPayLangCode = CountryInformationService.getFordPayLanguageCode(
      LanguageCodeHelper.mapLanguageCode(this.fmaLangCode)
    );
    this.state = {
      libraryIsLoading: false,
    };
  }
  componentDidMount() {
    this.openFordPayBasedOnLibraryType();
  }

  componentDidUpdate(prevProps) {
    const { isAuthenticated } = this.props;
    if (isAuthenticated !== prevProps.isAuthenticated) {
      this.openFordPayBasedOnLibraryType();
    }
  }

  openFordPayBasedOnLibraryType = () => {
    const { isAuthenticated, paymentLibraryType } = this.props;
    if (isAuthenticated) {
      switch (paymentLibraryType) {
        case FORDPAY_LIBRARY_TYPES.EU_BLUESNAP:
        case FORDPAY_LIBRARY_TYPES.NA_MIT:
          this.openFordPay();
          break;
        case FORDPAY_LIBRARY_TYPES.EU_IPG:
          this.openFordPayEU();
          break;
        default:
          this.openFordPayEU();
          break;
      }
    }
  };

  openFordPay = () => {
    const {
      prepareToken,
      paymentToken,
      dealerData,
      paymentLibraryType,
    } = this.props;

    const { libraryIsLoading } = this.state;

    if (!dealerData?.commonId || libraryIsLoading) {
      return;
    }

    const newPaymentObject = {
      ssoToken: window.fma.accessToken,
      jwtToken: prepareToken || paymentToken || '',
      language: this.fordPayLangCode,
    };

    const observer = new MutationObserver(() => {
      const fordPayDiv = document.getElementById('fordPayDiv');

      if (fordPayDiv && window.showFordPayApp) {
        this.setState({
          libraryIsLoading: true,
        });
        if (paymentLibraryType === FORDPAY_LIBRARY_TYPES.NA_MIT) {
          window.showFordPayApp.default.payment(
            this.paymentCallback,
            newPaymentObject,
            fordPayDiv
          );
        } else {
          window.showFordPayApp.default.euPayment(
            this.paymentCallback,
            newPaymentObject,
            fordPayDiv
          );
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  openFordPayEU = () => {
    const {
      buttonText,
      paymentToken,
      responseFailURL,
      responseSuccessURL,
    } = this.props;

    const { libraryIsLoading } = this.state;

    if (!paymentToken || libraryIsLoading) return;

    const IPGData = {
      jwtToken: paymentToken,
      timezone: 'Etc/UTC',
      responseSuccessURL,
      responseFailURL,
      notificationURL: null,
      language: this.fordPayLangCode,
      useFordPayCustomForms: 'true',
    };

    // eslint-disable-next-line no-console
    console.log('IPGData:\n', IPGData);

    const observer = new MutationObserver(() => {
      const fordPayDiv = document.getElementById('fordPayDiv');

      if (window.showFordPayIPG && fordPayDiv) {
        this.setState({
          libraryIsLoading: true,
        });
        window.showFordPayIPG.default(IPGData, fordPayDiv, buttonText);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  paymentCallback = async (response) => {
    const {
      displayLoader,
      onClose,
      orderCode,
      changePaymentErrorState,
      paymentLibraryType,
      blueSnapCallback,
    } = this.props;

    if (displayLoader) displayLoader(true);
    let paymentStatus;
    const jwtToken = response?.jwtToken;
    if (jwtToken) {
      //Splits the JWT token into an array with the [0] containing the algorithm, [1] containing the claims, [3] containing the signature
      const jwtArray = jwtToken.split('.');

      //Grabs the claims-JSON in String format from the jwt token, which will include the status
      const paymentResponse = atob(jwtArray?.[1]);

      const paymentResponseJSON = JSON.parse(paymentResponse);
      paymentStatus = paymentResponseJSON.status;
    }

    if (
      blueSnapCallback &&
      paymentLibraryType === FORDPAY_LIBRARY_TYPES.EU_BLUESNAP
    ) {
      blueSnapCallback(paymentStatus === 'success');
      onClose();
      return;
    }

    if (window.fma && window.fma.CATBundle) {
      if (paymentStatus === 'success') {
        try {
          for (let i = 0; i < 3; i++) {
            const response = await UserProfileService.updateUserAffiliations(
              orderCode,
              window.fma.CATBundle.access_token,
              false
            );
            if (response.status === 200 && onClose) {
              onClose(true);
              break;
            }
          }
        } catch (error) {
          if (onClose) onClose(false, ErrorType.US_CREATE_RESERVATION);
        }
      } else {
        if (onClose) onClose(false);
        if (changePaymentErrorState)
          changePaymentErrorState(ErrorType.US_FORDPAY_PAYMENT);
        // Reservation was not made, so there really was an error
        if (displayLoader) displayLoader(false);
      }
    } else {
      window.cartError = {
        error: 'Cart - Not signed in - No token bundle',
      };
    }

    if (displayLoader) displayLoader(false);
  };

  render() {
    const { onClose } = this.props;
    this.ele = React.createElement('div', { id: 'fordPayDiv', tabIndex: '0' });
    return (
      <MessageModal
        onClose={onClose}
        isOpen={true}
        redirectBool={false}
        className="ford-pay-modal"
      >
        {this.ele}
      </MessageModal>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: getFmaIsAuthenticated(state),
  orderCode: getOrderCode(state),
  dealerData: getDealerData(state),
});

export const UnwrappedFordPayModal = FordPayModal;
export default connect(mapStateToProps)(FordPayModal);
