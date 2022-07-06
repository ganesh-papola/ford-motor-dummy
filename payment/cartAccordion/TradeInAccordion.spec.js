import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import TradeInAccordion from './TradeInAccordion';
import { PLAN_CODES } from '@Constants/calculator';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store/Store';

describe('TradeInAccordion', () => {
  describe('TradeInOverageModal', () => {
    it('renders when modal has been enabled and trade-in overage is greater than 0', () => {
      render(
        <Provider store={store}>
          <TradeInAccordion
            {...getOverageModalEnabledTradeInAccordionProps()}
          />
        </Provider>
      );

      const tradeInOverageModalButton = screen.getByRole('button', {
        name: 'tradeinOverageModalCtaLabel',
      });

      expect(tradeInOverageModalButton).toBeInTheDocument();
    });

    it('does not render when modal has not been enabled', () => {
      const tradeInAccordionProps = {
        ...getOverageModalEnabledTradeInAccordionProps(),
        checkOverageTradeInMarkets: false,
      };

      render(
        <Provider store={store}>
          <TradeInAccordion {...tradeInAccordionProps} />
        </Provider>
      );

      const tradeInOverageModalButton = screen.queryByRole('button', {
        name: 'tradeinOverageModalCtaLabel',
      });

      expect(tradeInOverageModalButton).not.toBeInTheDocument();
    });

    it('does not render when no trade-in not greater than 0', () => {
      const tradeInAccordionProps = {
        ...getOverageModalEnabledTradeInAccordionProps(),
        tradeInOverageValue: 0,
      };

      render(
        <Provider store={store}>
          <TradeInAccordion {...tradeInAccordionProps} />
        </Provider>
      );

      const tradeInOverageModalButton = screen.queryByRole('button', {
        name: 'tradeinOverageModalCtaLabel',
      });

      expect(tradeInOverageModalButton).not.toBeInTheDocument();
    });

    it('does render when tradin overage in trade-in is greater than 0', () => {
      const tradeInAccordionProps = {
        ...getOverageModalEnabledTradeInAccordionProps(),
        tradeInOverageValue: 1,
        totalTradeInAmount: 100,
      };

      render(
        <Provider store={store}>
          <TradeInAccordion {...tradeInAccordionProps} />
        </Provider>
      );

      const tradeInOverageModalButton = screen.queryByRole('button', {
        name: 'tradeinOverageModalCtaLabel',
      });

      expect(tradeInOverageModalButton).toBeInTheDocument();
    });
  });

  describe('TradeinDealerModal', () => {
    it('sets setShowTradeinDealerModal when it is not dealerized (dealerId)', () => {
      const props = {
        selectedCustomerAppraisals: [],
        tradeinModalTitle: 'tradeinModalTitle',
        tradeinModalBodyText: 'tradeinModalBodyText',
      };

      render(
        <Provider store={store}>
          <TradeInAccordion {...props} />
        </Provider>
      );

      const tradeInAccordionButton = screen.getByTestId(
        'tradeInAccordionButton'
      );

      const getTradeInModal = () => screen.queryByText(props.tradeinModalTitle);

      expect(tradeInAccordionButton).toBeInTheDocument();

      expect(getTradeInModal()).not.toBeInTheDocument();

      fireEvent.click(tradeInAccordionButton);

      expect(getTradeInModal()).toBeInTheDocument();
    });
  });

  it('does not setShowTradeinDealerModal when it is dealerized (dealerId)', () => {
    const props = {
      dealerId: '12345',
      selectedCustomerAppraisals: [],
      tradeinModalTitle: 'tradeinModalTitle',
      tradeinModalBodyText: 'tradeinModalBodyText',
    };

    render(
      <Provider store={store}>
        <TradeInAccordion {...props} />
      </Provider>
    );

    const tradeInAccordionButton = screen.getByTestId('tradeInAccordionButton');

    const getTradeInModal = () => screen.queryByText(props.tradeinModalTitle);

    expect(tradeInAccordionButton).toBeInTheDocument();

    expect(getTradeInModal()).not.toBeInTheDocument();

    fireEvent.click(tradeInAccordionButton);

    expect(getTradeInModal()).not.toBeInTheDocument();
  });

  it('it completes trade in accordion when there is more than one appraisal and trade in is not yet completed', () => {
    const tradeInAccordionProps = {
      selectedCustomerAppraisals: ['appraisal'],
      isComplete: false,
      completeCartAccordion: jest.fn(),
      updateTotalTradeInAmount: jest.fn(),
      updateTradeInApplyFinance: jest.fn(),
    };

    render(
      <Provider store={store}>
        <TradeInAccordion {...tradeInAccordionProps} />
      </Provider>
    );

    expect(tradeInAccordionProps.completeCartAccordion).toHaveBeenCalledTimes(
      1
    );
    expect(
      tradeInAccordionProps.updateTotalTradeInAmount
    ).toHaveBeenCalledTimes(1);
    expect(
      tradeInAccordionProps.updateTradeInApplyFinance
    ).toHaveBeenCalledTimes(1);
  });

  it('it incompletes trade in accordion when there are no appraisals and trade is completed', () => {
    const tradeInAccordionProps = {
      selectedCustomerAppraisals: [],
      isComplete: true,
      incompleteCartAccordion: jest.fn(),
    };

    render(
      <Provider store={store}>
        <TradeInAccordion {...tradeInAccordionProps} />
      </Provider>
    );

    expect(tradeInAccordionProps.incompleteCartAccordion).toHaveBeenCalledTimes(
      1
    );
  });
});

function getOverageModalEnabledTradeInAccordionProps() {
  return {
    financeUpdateHasSucceeded: true,
    fordPaymentMethod: PLAN_CODES.FINANCE,
    selectedCustomerAppraisals: [],
    checkOverageTradeInMarkets: true,
    tradeInOverageValue: 98765.43,
    totalTradeInAmount: 100,
    tradeinOverageModalTitle: 'tradeinOverageModalTitle',
    tradeinOverageModelBodyText: 'tradeinOverageModelBodyText',
    tradeinOverageModalCtaLabel: 'tradeinOverageModalCtaLabel',
    tradeinOverageModalCtaAriaLabel: 'tradeinOverageModalCtaLabel',
  };
}
