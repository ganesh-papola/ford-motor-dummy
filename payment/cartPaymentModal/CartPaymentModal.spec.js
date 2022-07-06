import React from 'react';
import { render } from '@testing-library/react';
import CartPaymentModal from './CartPaymentModal';
import '@testing-library/jest-dom/extend-expect';

const bottomContent = `The  is based on an Optional Final Payment and Finance APR for this pre-production vehicle. Please note the final confirmed pricing will be available in 2020 once the vehicle enters production phase.

Deposit allowance where applicable only available when financed with Ford Credit.

[†] The Price Adjustment has been applied to the Online Cash Price to ensure you have equal s for the duration of your agreement.

[‡] £10 Finance Facility Fee payable with the first instalment. £10 Purchase Fee payable with the Optional Final Payment if you wish to own the vehicle at the end of the agreement.

Further charges may be made subject to the condition of the vehicle, if the vehicle is returned at the end of the finance agreement.

Finance subject to status. Freepost Ford Credit.`;

const props = {
  headerText: 'ESTIMATED PRICING SUMMARY',
  title: 'PRICING',
  subTitle: 'Your estimated vehicle price.',
  bottomContent,
  zebraListData: [
    {
      label: 'Monthly Payment',
      value: '£699.00',
    },
    {
      label: 'Number of Monthly Payments',
      value: '36',
    },
    {
      label: 'Dealer OTR Promotional Price',
      value: '£44,000.00',
    },
  ],
  isModalOpen: true,
  showOneOffPayments: true,
  oneOffPaymentsHeader: 'One-Off Payments',
  oneOffPaymentsTooltip: 'Tooltip content for one-off payments goes here.',
  oneOffPaymentsTooltipAltText: 'Learn more about One-Off Payments',
  oneOffBottomContent: 'Bottom content for the one-off payments box.',
  pricingCategorySummaryOneOff: [
    {
      label: 'Charging',
      value: '£1,250.00',
      items: [
        { label: 'Item 1', value: '£200.00' },
        { label: 'Item 2', value: '£300.00' },
      ],
    },
    {
      label: 'Protection Plans',
      value: '£1,100.00',
      items: [{ label: 'Item 1', value: '£1,100.00' }],
    },
    { label: 'Delivery', value: '£200.00' },
  ],
};

describe('PaymentDealerIconModal', () => {
  it('should render', () => {
    const { container } = render(<CartPaymentModal {...props} />);

    expect(container).toMatchSnapshot();
  });
  it('should render empty divs when closed', () => {
    const { container } = render(
      <CartPaymentModal {...props} isModalOpen={false} />
    );
    expect(container).toMatchSnapshot();
  });
});
