import { YourOrder } from './YourOrder';
import React from 'react';
import { shallow } from 'enzyme';

describe('Your Order', () => {
  let wrapper;

  const setupWrapper = (props = {}) => {
    wrapper = shallow(
      <YourOrder
        countryCode={props.countryCode || 'UK'}
        dealerSellingPriceSummary={{
          listPrice: 0,
          priceAdjustment: 0,
          msrp: 0,
        }}
        estimatedAmountFinancedSummary={{
          downPayment: 0,
          dealerDeposit: 0,
          currentAvailableIncentives: 0,
          estimatedTradeInAmount: 0,
          estimatedAmountFinanced: 0,
        }}
        {...props}
      />
    );
  };

  it('render the configured options when passed configuredOptions', () => {
    const props = {
      configuredOptions: {
        optionsList: [
          {
            id: '1',
            msrp: 200,
            description: 'abc',
          },
          {
            id: '2',
            msrp: 300,
            description: 'def',
          },
        ],
      },
    };
    setupWrapper(props);
    expect(wrapper.find('.trim-options-container').children().length).toEqual(
      2
    );
  });

  it('when component renders and is given a preferred dealer, then will render that preferred dealer', () => {
    const expectedDealer = 'Damerow Ford';
    setupWrapper({
      dealerName: 'Damerow Ford',
    });
    expect(wrapper.find('.your-dealer-info').find('.dealer').text()).toEqual(
      expectedDealer
    );
  });

  it('(Tactical) When the country is Norway, it displays total price as the first price item', () => {
    const props = {
      baseMSRP: 50000,
      countryCode: 'NOR',
      totalMSRP: 75000,
    };
    setupWrapper(props);
    const priceItem = wrapper
      .find('.vehicle-configuration')
      .find('PriceItem')
      .at(0);
    expect(priceItem.props().priceValue).toBe(props.totalMSRP);
  });

  it('When the country is not Norway, displays the base MSRP as the first price item', () => {
    const props = {
      baseMSRP: 50000,
      countryCode: 'DEU',
      totalMSRP: 75000,
    };
    setupWrapper(props);
    const priceItem = wrapper
      .find('.vehicle-configuration')
      .find('PriceItem')
      .at(0);
    expect(priceItem.props().priceValue).toBe(props.baseMSRP);
  });

  describe('New Order Version', () => {
    it('if not authored, current incentives and estimated amount financed are not shown', () => {
      const props = {
        isNewOrder: true,
        downPaymentPrice: 5000,
        downPaymentDisclaimer: {},
        dealerDepositText: '',
        dealerDepositPrice: 500,
        dealerDepositDisclaimer: {},
      };
      setupWrapper(props);
      expect(wrapper.find('.price').exists()).toBeFalsy();
    });

    it('if balloon payment, then should display the Final Balloon Payment Disclaimer if disclaimer and balloon payment fields are authored for Ford Options order', () => {
      const props = {
        balloonPayment: '2400',
        finalBalloonPaymentDisc: 'Final Balloon Payment Disclaimer',
        balloonPaymentText: 'BALLOON PAYMENT',
        annualMileage: 3000,
        isNewOrder: true,
        paymentPlanData: {
          financePlan: '5',
          calculated: true,
        },
      };
      setupWrapper(props);

      expect(
        wrapper.find('.final-balloon-payment-disclaimer').exists()
      ).toBeTruthy();
    });

    it('if balloon payment, then should not display the Final Balloon Payment Disclaimer if disclaimer or balloon payment fields are not authored', () => {
      const props = {
        balloonPayment: '2400',
        finalBalloonPaymentDisc: 'Final Balloon Payment Disclaimer',
        isNewOrder: true,
      };
      setupWrapper(props);

      expect(
        wrapper.find('.final-balloon-payment-disclaimer').exists()
      ).toBeFalsy();
    });
  });
});
