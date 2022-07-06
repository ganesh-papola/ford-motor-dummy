import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { CartAccordion } from './CartAccordion';
import { PaymentCard } from '../../cart/paymentCard/PaymentCard';
import { ACCORDION_TYPES } from '@Constants/main';
import { store } from '../../../redux/store/Store';

export default {
  component: CartAccordion,
  title: 'Cart/Accordion',
};

const moreFinancePlans = [
  {
    planName: 'Finance',
    planId: '1',
    description: 'See our competitive rates and select payments.',
    image:
      'https://cdn.zeplin.io/5e9470a042f8df78ab5ebd53/assets/C4C38D5E-1D33-4735-9EE5-FB78FBCD9B5D.png',
  },
  {
    planName: 'Ford Options Plan',
    planId: '5',
    description: 'See our competitive rates and select payments.',
    image:
      'https://cdn.zeplin.io/5e9470a042f8df78ab5ebd53/assets/C4C38D5E-1D33-4735-9EE5-FB78FBCD9B5D.png',
  },
  {
    planName: 'Cash',
    planId: 'c',
    description: 'See our competitive rates and select payments.',
    image:
      'https://cdn.zeplin.io/5e9470a042f8df78ab5ebd53/assets/C4C38D5E-1D33-4735-9EE5-FB78FBCD9B5D.png',
  },
  {
    planName: 'Card',
    planId: 'q',
    description: 'See our competitive rates and select payments.',
    image:
      'https://cdn.zeplin.io/5e9470a042f8df78ab5ebd53/assets/C4C38D5E-1D33-4735-9EE5-FB78FBCD9B5D.png',
  },
];

const props = {
  accordionType: ACCORDION_TYPES.PAYMENT_METHOD,
  isRequired: false,
  title: 'PAYMENT METHOD',
  subtitle: 'Select a payment method.',
  requiredText: '(Required)',
  checkmarkAltText: 'check',
  isChecked: false,
  updatePaymentCategories: () => {},
  fetchFinancialPlan: () => {},
  financePlans: [
    {
      planName: 'Finance',
      planId: '1',
      description: 'See our competitive rates and select payments.',
      image:
        'https://cdn.zeplin.io/5e9470a042f8df78ab5ebd53/assets/C4C38D5E-1D33-4735-9EE5-FB78FBCD9B5D.png',
    },
    {
      planName: 'Ford Options Plan',
      planId: '5',
      description: 'See our competitive rates and select payments.',
      image:
        'https://cdn.zeplin.io/5e9470a042f8df78ab5ebd53/assets/C4C38D5E-1D33-4735-9EE5-FB78FBCD9B5D.png',
    },
    {
      planName: 'Cash',
      planId: 'c',
      description: 'See our competitive rates and select payments.',
      image:
        'https://cdn.zeplin.io/5e9470a042f8df78ab5ebd53/assets/C4C38D5E-1D33-4735-9EE5-FB78FBCD9B5D.png',
    },
  ],
};

const cardProps = {
  title: 'CONTRACT PURCHASE',
  altText: 'Ford Logo',
  bodyText: 'See our competitive rates and select payments.',
  image:
    'https://cdn.zeplin.io/5e9470a042f8df78ab5ebd53/assets/C4C38D5E-1D33-4735-9EE5-FB78FBCD9B5D.png',
  selectedText: 'Selected',
  editText: 'Edit',
  buttonText: 'Select',
};

export const AccordionWithSlider = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Provider store={store}>
      <div>
        <CartAccordion
          {...props}
          financePlans={moreFinancePlans}
          isOpen={isOpen}
          onClickFunc={() => setIsOpen(!isOpen)}
        />
      </div>
    </Provider>
  );
};

export const AccordionWithNextSteps = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Provider store={store}>
      <div>
        <CartAccordion
          {...props}
          financePlans={moreFinancePlans}
          isOpen={isOpen}
          onClickFunc={() => setIsOpen(!isOpen)}
          showNextSteps={true}
        />
      </div>
    </Provider>
  );
};

export const AccordionWithSliderWidth = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Provider store={store}>
      <div style={{ maxWidth: '818px' }}>
        <CartAccordion
          {...props}
          financePlans={moreFinancePlans}
          isOpen={isOpen}
          onClickFunc={() => {
            setIsOpen(!isOpen);
          }}
        />
      </div>
    </Provider>
  );
};

export const AccordionWith3 = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Provider store={store}>
      <div>
        <CartAccordion
          {...props}
          isOpen={isOpen}
          onClickFunc={() => setIsOpen(!isOpen)}
        />
      </div>
    </Provider>
  );
};

export const Default = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Provider store={store}>
      <CartAccordion
        {...props}
        isOpen={isOpen}
        onClickFunc={() => setIsOpen(!isOpen)}
      >
        <PaymentCard {...cardProps} />
      </CartAccordion>
    </Provider>
  );
};

export const Required = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Provider store={store}>
      <CartAccordion
        {...props}
        isRequired={true}
        isOpen={isOpen}
        onClickFunc={() => setIsOpen(!isOpen)}
      >
        <PaymentCard {...cardProps} />
      </CartAccordion>
    </Provider>
  );
};

export const WithCheck = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Provider store={store}>
      <CartAccordion
        {...props}
        isChecked={true}
        isOpen={isOpen}
        onClickFunc={() => setIsOpen(!isOpen)}
      >
        <PaymentCard {...cardProps} />
      </CartAccordion>
    </Provider>
  );
};

export const RequiredWithCheck = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Provider store={store}>
      <CartAccordion
        {...props}
        isOpen={isOpen}
        isChecked={true}
        isRequired={true}
        onClickFunc={() => setIsOpen(!isOpen)}
      >
        <PaymentCard {...cardProps} />
      </CartAccordion>
    </Provider>
  );
};
