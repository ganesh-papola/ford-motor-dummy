import React from 'react';
import { DeliveryCard } from './DeliveryCard';
import { text, boolean } from '@storybook/addon-knobs';
import { DELIVERY_CARDS_TYPES, FINANCE_TYPES_Displayed } from '@Constants/main';

export default {
  title: 'Cart/DeliveryCard',
  component: DeliveryCard,
};

const props = {
  title: 'DELIVERY',
  address: '2343 Woodward Ave, Ferndale, MI 48220',
  selectButtonText: 'Select',
  selectButtonAriaLabel: 'Select the delivery option.',
  selectedText: 'Selected',
  isDeliveryUnavailable: false,
  checkmarkAltText: 'check mark',
  isSelected: false,
  titleToolTipAltText: 'Pac-Man alt text',
  titleToolTipTitle: 'Pac-Man',
  titleToolTipText: 'Here is some text. Do you want delivery or pick-up?',
  titleToolTipOnHover: false,
  deliveryUnavailableText: 'Unavailable with your dealer',
  deliveryUnavailableToolTipText:
    'You must pick your vehicle up at the dealership.',
  deliveryUnavailableToolTipTitle: '',
  deliveryUnavailableToolTipAltText: 'no delivery info',
  deliveryUnavailableToolTipOnHover: false,
  orderType: '',
  changeDealerButtonText: 'Change Dealer',
  changeDealerButtonAriaLabel: 'Select a different dealer',
  deliveryMethodFee: '$500',
};

export const Default = () => {
  const {
    title,
    address,
    selectButtonText,
    selectedText,
    isDeliveryUnavailable,
    isSelected,
    titleToolTipTitle,
    titleToolTipText,
    deliveryUnavailableText,
    deliveryUnavailableToolTipText,
    deliveryUnavailableToolTipTitle,
    orderType,
    changeDealerButtonText,
    deliveryMethodFee,
  } = props;

  return (
    <DeliveryCard
      {...props}
      title={text('title', title)}
      address={text('address', address)}
      selectButtonText={text('selectButtonText', selectButtonText)}
      titleToolTipText={text('titleToolTipText', titleToolTipText)}
      titleToolTipTitle={text('titleToolTipTitle', titleToolTipTitle)}
      selectedText={text('selectedText', selectedText)}
      isDeliveryUnavailable={boolean(
        'isDeliveryUnavailable',
        isDeliveryUnavailable
      )}
      isSelected={boolean('isSelected', isSelected)}
      deliveryUnavailableText={text(
        'deliveryUnavailableText',
        deliveryUnavailableText
      )}
      deliveryUnavailableToolTipText={text(
        'deliveryUnavailableToolTipText',
        deliveryUnavailableToolTipText
      )}
      deliveryUnavailableToolTipTitle={text(
        'deliveryUnavailableToolTipTitle',
        deliveryUnavailableToolTipTitle
      )}
      orderType={text('orderType', orderType)}
      changeDealerButtonText={text(
        'changeDealerButtonText',
        changeDealerButtonText
      )}
      deliveryMethodFee={text('deliveryMethodFee', deliveryMethodFee)}
    />
  );
};

export const Collection = () => {
  const props = {
    cardType: DELIVERY_CARDS_TYPES.COLLECTION,
    title: 'COLLECTION',
    address: 'Dees of Wimbledon 67 Plough Ln London SW17 0BW',
    selectButtonText: 'Select',
    selectButtonAriaLabel: 'Select the delivery option.',
    selectedText: 'Selected',
    checkmarkAltText: 'check mark',
    isSelected: false,
    titleToolTipAltText: 'Pac-Man alt text',
    titleToolTipTitle: 'Pac-Man',
    titleToolTipText: 'Here is some text. Do you want delivery or pick-up?',
    deliveryMethodFee: '$500',
  };

  return <DeliveryCard {...props} />;
};

export const CollectionSelected = () => {
  const props = {
    cardType: DELIVERY_CARDS_TYPES.COLLECTION,
    title: 'COLLECTION',
    address: 'Dees of Wimbledon 67 Plough Ln London SW17 0BW',
    selectButtonText: 'Select',
    selectButtonAriaLabel: 'Select the delivery option.',
    selectedText: 'Selected',
    checkmarkAltText: 'check mark',
    isSelected: true,
    titleToolTipAltText: 'Pac-Man alt text',
    titleToolTipTitle: 'Pac-Man',
    titleToolTipText: 'Here is some text. Do you want delivery or pick-up?',
    deliveryMethodFee: '$500',
  };

  return <DeliveryCard {...props} />;
};

export const Delivery = () => {
  const props = {
    cardType: DELIVERY_CARDS_TYPES.DELIVERY,
    title: 'DELIVERY',
    address: 'Dees of Wimbledon 67 Plough Ln London SW17 0BW',
    selectButtonText: 'Select',
    selectButtonAriaLabel: 'Select the delivery option.',
    selectedText: 'Selected',
    isDeliveryUnavailable: false,
    checkmarkAltText: 'check mark',
    isSelected: false,
    titleToolTipAltText: 'Pac-Man alt text',
    titleToolTipTitle: 'Pac-Man',
    titleToolTipText: 'Here is some text. Do you want delivery or pick-up?',
    titleToolTipOnHover: false,
    deliveryUnavailableText: 'Unavailable with your dealer',
    deliveryUnavailableToolTipText:
      'You must pick your vehicle up at the dealership.',
    deliveryUnavailableToolTipTitle: '',
    deliveryUnavailableToolTipAltText: 'no delivery info',
    deliveryUnavailableToolTipOnHover: false,
    orderType: '',
    changeDealerButtonText: 'Change Dealer',
    changeDealerButtonAriaLabel: 'Select a different dealer',
    deliveryMethodFee: '$500',
  };

  return <DeliveryCard {...props} />;
};

export const DeliveryAddToFinance = () => {
  const props = {
    cardType: DELIVERY_CARDS_TYPES.DELIVERY,
    title: 'DELIVERY',
    address: 'Dees of Wimbledon 67 Plough Ln London SW17 0BW',
    selectButtonText: 'Select',
    selectButtonAriaLabel: 'Select the delivery option.',
    selectedText: 'Selected',
    isDeliveryUnavailable: false,
    checkmarkAltText: 'check mark',
    isSelected: false,
    titleToolTipAltText: 'Pac-Man alt text',
    titleToolTipTitle: 'Pac-Man',
    titleToolTipText: 'Here is some text. Do you want delivery or pick-up?',
    titleToolTipOnHover: false,
    deliveryUnavailableText: 'Unavailable with your dealer',
    deliveryUnavailableToolTipText:
      'You must pick your vehicle up at the dealership.',
    deliveryUnavailableToolTipTitle: '',
    deliveryUnavailableToolTipAltText: 'no delivery info',
    deliveryUnavailableToolTipOnHover: false,
    orderType: '',
    changeDealerButtonText: 'Change Dealer',
    changeDealerButtonAriaLabel: 'Select a different dealer',
    deliveryMethodFee: '$500',
    addToFinanceLabel: 'Add to Finance',
    calculated: true,
    financeType: FINANCE_TYPES_Displayed.FINANCE,
  };

  return <DeliveryCard {...props} />;
};

export const DeliverySelected = () => {
  const props = {
    cardType: DELIVERY_CARDS_TYPES.DELIVERY,
    title: 'DELIVERY',
    address: 'Dees of Wimbledon 67 Plough Ln London SW17 0BW',
    selectButtonText: 'Select',
    selectButtonAriaLabel: 'Select the delivery option.',
    selectedText: 'Selected',
    isDeliveryUnavailable: false,
    checkmarkAltText: 'check mark',
    isSelected: true,
    titleToolTipAltText: 'Pac-Man alt text',
    titleToolTipTitle: 'Pac-Man',
    titleToolTipText: 'Here is some text. Do you want delivery or pick-up?',
    titleToolTipOnHover: false,
    deliveryUnavailableText: 'Unavailable with your dealer',
    deliveryUnavailableToolTipText:
      'You must pick your vehicle up at the dealership.',
    deliveryUnavailableToolTipTitle: '',
    deliveryUnavailableToolTipAltText: 'no delivery info',
    deliveryUnavailableToolTipOnHover: false,
    orderType: '',
    changeDealerButtonText: 'Change Dealer',
    changeDealerButtonAriaLabel: 'Select a different dealer',
    deliveryMethodFee: '$500',
  };

  return <DeliveryCard {...props} />;
};

export const DeliveryUnavailableNewOrder = () => {
  const props = {
    cardType: DELIVERY_CARDS_TYPES.DELIVERY,
    title: 'DELIVERY',
    address: 'Dees of Wimbledon 67 Plough Ln London SW17 0BW',
    deliveryPostalCodeLabel: 'Delivery Post Code:',
    zipCode: '00001',
    selectButtonText: 'Select',
    selectButtonAriaLabel: 'Select the delivery option.',
    selectedText: 'Selected',
    isDeliveryUnavailable: true,
    checkmarkAltText: 'check mark',
    isSelected: false,
    titleToolTipAltText: 'Pac-Man alt text',
    titleToolTipTitle: 'Pac-Man',
    titleToolTipText: 'Here is some text. Do you want delivery or pick-up?',
    titleToolTipOnHover: false,
    deliveryUnavailableText: 'Unavailable with your dealer',
    deliveryUnavailableToolTipText:
      'You must pick your vehicle up at the dealership.',
    deliveryUnavailableToolTipTitle: '',
    deliveryUnavailableToolTipAltText: 'no delivery info',
    deliveryUnavailableToolTipOnHover: false,
    orderType: 'ORDER',
    changeDealerButtonText: 'Change Dealer',
    changeDealerButtonAriaLabel: 'Select a different dealer',
    deliveryMethodFee: '$500',
  };

  return <DeliveryCard {...props} />;
};

export const DeliveryUnavailablePreOrder = () => {
  const props = {
    cardType: DELIVERY_CARDS_TYPES.DELIVERY,
    title: 'DELIVERY',
    address: 'Dees of Wimbledon 67 Plough Ln London SW17 0BW',
    zipCode: '00001',
    selectButtonText: 'Select',
    selectButtonAriaLabel: 'Select the delivery option.',
    selectedText: 'Selected',
    isDeliveryUnavailable: true,
    checkmarkAltText: 'check mark',
    isSelected: false,
    titleToolTipAltText: 'Pac-Man alt text',
    titleToolTipTitle: 'Pac-Man',
    titleToolTipText: 'Here is some text. Do you want delivery or pick-up?',
    titleToolTipOnHover: false,
    deliveryUnavailableText: 'Unavailable with your dealer',
    deliveryUnavailableToolTipText:
      'You must pick your vehicle up at the dealership.',
    deliveryUnavailableToolTipTitle: '',
    deliveryUnavailableToolTipAltText: 'no delivery info',
    deliveryUnavailableToolTipOnHover: false,
    orderType: 'RESERVATION',
    changeDealerButtonText: 'Change Dealer',
    changeDealerButtonAriaLabel: 'Select a different dealer',
    deliveryMethodFee: '$500',
  };

  return <DeliveryCard {...props} />;
};
