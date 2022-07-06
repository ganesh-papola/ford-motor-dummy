import React, { useState } from 'react';
import CartPaymentModal from './CartPaymentModal';
import ZebraList from '@Common/zebraList/ZebraList';
import PricingSummaryListItem from '../../cart/pricingSummaryListItem/PricingSummaryListItem';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store/Store';

export default {
  component: CartPaymentModal,
  title: 'Cart/PaymentModal',
};

const bottomContent = `The  is based on an Optional Final Payment and Finance APR for this pre-production vehicle. Please note the final confirmed pricing will be available in 2020 once the vehicle enters production phase.

Deposit allowance where applicable only available when financed with Ford Credit.

[†] The Price Adjustment has been applied to the Online Cash Price to ensure you have equal s for the duration of your agreement.

[‡] £10 Finance Facility Fee payable with the first instalment. £10 Purchase Fee payable with the Optional Final Payment if you wish to own the vehicle at the end of the agreement.

Further charges may be made subject to the condition of the vehicle, if the vehicle is returned at the end of the finance agreement.

Finance subject to status. Freepost Ford Credit.`;

const zebraListItems = [
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
  {
    label: 'Price Adjustments',
    value: '£0.00',
    valueSuffixSuperScript: '†',
  },
  {
    label: 'Online Price',
    value: '£44,000.00',
  },
  {
    label: 'Customer Deposit',
    value: '£0.00',
  },
  {
    label: 'Deposit Allowance',
    value: '£50.00',
  },
  {
    label: 'Amount of Credit',
    value: '£20,000.00',
  },
  {
    label: 'Interest Chargest and Fees',
    value: '£3,500.00',
    valueSuffixSuperScript: '‡',
  },
  {
    label: 'Fees',
    value: '£800.00',
  },
  {
    label: 'Optional Final Payment',
    value: '£25,000.00',
  },
  {
    label: 'Total Amount Payable',
    value: '£56,000.00',
  },
  {
    label: 'Fixed Borrowing Rate',
    value: '2.5%',
  },
  {
    label: 'APR Representative',
    value: '1.3%',
  },
  {
    label: 'Annual Mileage',
    value: '9,000',
  },
  {
    label: 'Excess Mileage Charge',
    value: '£1,000.00',
  },
];

const props = {
  headerText: 'ESTIMATED PRICING SUMMARY',
  title: 'PRICING',
  subTitle: 'Your estimated vehicle price.',
  bottomContent,
};

const zebraList = (
  <ZebraList>
    {zebraListItems?.map((item, index) => (
      <PricingSummaryListItem key={index} index={index} {...item} />
    ))}
  </ZebraList>
);

export const Default = () => {
  const [isModalOpen, setModalOpenness] = useState(false);

  return (
    <Provider store={store}>
      <div className="no-storybook-margin">
        <button onClick={() => setModalOpenness(!isModalOpen)}>
          Click me to toggle some stuff
        </button>
        <CartPaymentModal
          {...props}
          zebraList={zebraList}
          isModalOpen={isModalOpen}
          closeModal={() => setModalOpenness(false)}
        />
      </div>
    </Provider>
  );
};
