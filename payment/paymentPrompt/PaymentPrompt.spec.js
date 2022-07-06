import { PaymentPrompt } from './PaymentPrompt';
import React from 'react';
import { mount } from 'enzyme';
import PropertiesService from '@Services/propertiesService/PropertiesService';
import { PaymentMethod } from '../../readyToOrder/paymentMethod/PaymentMethod';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SapCommerceService from '@Services/sapCommerceService/SapCommerceService';
import { getDisclosureById } from '@Ducks/disclosure/selectors';
import { fetchDisclosures } from '@Ducks/disclosure/thunks';
import { getDisclaimerOrdinal } from '@Ducks/spaState/selectors';

jest.mock('@Services/analyticsService/AnalyticsService');
jest.mock('@Services/sapCommerceService/SapCommerceService');
jest.mock('@Ducks/disclosure/selectors');
jest.mock('@Ducks/disclosure/thunks');
jest.mock('@Ducks/spaState/selectors');

describe('PaymentPrompt Component', () => {
  let wrapper;

  const initialState = {
    calculator: {
      selectedPaymentPlan: {},
      confirmedPaymentPlan: {},
      sharedData: {},
    },
  };
  const mockStore = configureStore();
  const setupWrapper = (props = {}) => {
    wrapper = mount(
      <Provider store={mockStore(initialState)}>
        <PaymentPrompt
          countryCode={props.countryCode || 'DE'}
          reservationDetails={{ jwtToken: 'someToken' }}
          spaFlowInfo={['', '', '', { url: '' }]}
          {...props}
        />
      </Provider>
    );
  };

  beforeEach(() => {
    window.showFordPayIPG = {
      default: jest.fn(),
    };
    window.initializeFordPayForUS = jest.fn();
    PropertiesService.getRunModeProperties = jest
      .fn()
      .mockImplementation(() => {
        return {
          confirmationPageUrl:
            'content/bev-cart_checkout/react/home/confirmationPage.html',
        };
      });
    PropertiesService.getPageProperties = jest.fn().mockImplementation(() => {
      return {
        pricingDecimalDelimiter: '.',
        pricingThousandsDelimiter: ',',
        pricingSuffix: '',
        pricingPrefix: '€',
      };
    });
    Object.defineProperty(window, 'FD', {
      writable: true,
      value: {
        Brand: {
          Context: {
            disclosures: [
              {
                key: 'total-to-pay',
                id: 11,
              },
            ],
            disclosureSetId: 11,
          },
        },
      },
    });
    getDisclosureById.mockImplementation(() => {
      return {
        ['total to pay eu']: {
          name: 'some name',
          content: 'some content',
        },
      };
    });
    fetchDisclosures.mockImplementation(() => {
      return {
        type: 'some type',
        payload: 'some payload',
      };
    });
    getDisclaimerOrdinal.mockImplementation(() => 1);
  });

  it('when component is mounted then will render', () => {
    setupWrapper();
    expect(wrapper.find(PaymentPrompt).length).toEqual(1);
  });

  it('When total to pay vdm and accelerator disclaimer is authored, should display vdm and accelerator disclaimer', () => {
    setupWrapper({
      totalToPayDisclaimerDisc: 'total-to-pay',
      totalToPayEUDis: 'total to pay eu',
    });
    expect(wrapper.find('.disclaimer').text()).toEqual('1');
    expect(
      wrapper.find('.reservation-price-eu-disclosure').exists()
    ).toBeTruthy();
  });

  it('When total to pay vdm and accelerator disclaimer is not authored, should not display vdm and accelerator disclaimer', () => {
    setupWrapper();
    expect(wrapper.find('.disclaimer').exists()).toBeFalsy();
    expect(
      wrapper.find('.reservation-price-eu-disclosure').exists()
    ).toBeFalsy();
  });

  it('when given selectedDealer then component will show the reservation price and currency', () => {
    const props = {
      regionIsUS: false,
      countryCode: 'DEU',
      depositPrice: '100',
    };
    setupWrapper(props);
    expect(wrapper.find('.reservation-price').text()).toEqual(
      '€' + props.depositPrice
    );
  });

  it('when given reservation text, then will render in expected areas', () => {
    const props = {
      reservationTopText: 'text 1',
      reservationBottomText: 'text 2',
      reservationToPayText: 'to pay today',
    };
    setupWrapper(props);
    expect(wrapper.find('.reservation-deposit-text').text()).toEqual(
      props.reservationTopText
    );
    expect(wrapper.find('.reservation-to-pay-text').text()).toEqual(
      props.reservationToPayText
    );
  });

  it('When region is EU and orderType is not ORDER, do not show the payment method selection', () => {
    const props = {
      orderType: 'reservation',
    };
    setupWrapper(props);
    expect(wrapper.find('.methods-of-payment').exists()).toBeTruthy();
    expect(wrapper.find(PaymentMethod).exists()).toBeFalsy();
  });

  it('When region is EU and orderType is ORDER, show the payment method selection', () => {
    const props = {
      orderType: 'order',
    };
    setupWrapper(props);
    expect(wrapper.find('.methods-of-payment').exists()).toBeTruthy();
    expect(wrapper.find(PaymentMethod).exists()).toBeTruthy();
  });

  it('Calls SAP orderUpdate when FordPay is invoked in the EU workflow', async () => {
    Object.defineProperty(window, 'fma', {
      writable: false,
      value: {
        CATBundle: {
          access_token: 'eyJ0',
        },
      },
    });
    SapCommerceService.orderUpdate = jest.fn(() =>
      Promise.resolve({ status: 200 })
    );
    setupWrapper({
      affiliation: 'FORD_EMPLOYEE',
      countryCode: 'GBR',
      orderCode: 'sit-10001234',
    });
    const paymentPrompt = wrapper.find('PaymentPrompt').instance();
    paymentPrompt.updateFinanceType('LEASE');
    await paymentPrompt.invokeFordPay();

    expect(SapCommerceService.orderUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        financeData: {
          financeType: 'LEASE',
        },
        fordAffiliation: 'FORD_EMPLOYEE',
        orderCode: 'sit-10001234',
      }),
      'eyJ0',
      'GBR'
    );
  });
});
