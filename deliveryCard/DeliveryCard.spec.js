import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DeliveryCard } from './DeliveryCard';
import '@testing-library/jest-dom/extend-expect';

global.Math.random = () => 1; // Setting random for FDSTooltip

describe('DeliveryCard', () => {
  it('should render collection card', () => {
    const props = {
      title: 'COLLECTION',
      address: 'Dees of Wimbledon 67 Plough Ln London SW17 0BW',
      isDealerized: true,
      cardType: 'collection',
      deliveryZipcode: '10001H',
    };
    render(<DeliveryCard {...props} />);
    expect(screen.queryByText('COLLECTION')).toBeInTheDocument();
    expect(
      screen.queryByText('Dees of Wimbledon 67 Plough Ln London SW17 0BW')
    ).toBeInTheDocument();
    expect(screen.queryByText('10001H')).not.toBeInTheDocument();
  });
  it('should render delivery card', () => {
    const props = {
      title: 'DELIVERY',
      address: 'Dees of Wimbledon 67 Plough Ln London SW17 0BW',
      isDeliveryUnavailable: false,
      isNewOrder: true,
      isDealerized: true,
      cardType: 'delivery',
      deliveryZipcode: '10001H',
    };
    render(<DeliveryCard {...props} />);
    expect(screen.queryByText('DELIVERY')).toBeInTheDocument();
    expect(
      screen.queryByText('Dees of Wimbledon 67 Plough Ln London SW17 0BW')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('10001H')).toBeInTheDocument();
  });
  it('should render card with a tooltip', () => {
    const props = {
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
      titleToolTipText: 'Here is some text',
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
      isDealerized: true,
    };
    render(<DeliveryCard {...props} />);
    expect(screen.queryByText('Here is some text')).toBeInTheDocument();
  });
  it('should render card selected', () => {
    const props = {
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
      isDealerized: true,
    };
    render(<DeliveryCard {...props} />);
    expect(screen.queryByText('Selected')).toBeInTheDocument();
  });
  it('should render card with delivery unavailable as a new order', () => {
    const props = {
      title: 'DELIVERY',
      address: 'Dees of Wimbledon 67 Plough Ln London SW17 0BW',
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
      isDealerized: true,
    };
    render(<DeliveryCard {...props} />);
    expect(
      screen.queryByText('Unavailable with your dealer')
    ).toBeInTheDocument();
  });
  it('should render card with delivery unavailable as a pre order', () => {
    const props = {
      title: 'DELIVERY',
      address: 'Dees of Wimbledon 67 Plough Ln London SW17 0BW',
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
      isDealerized: true,
    };
    render(<DeliveryCard {...props} />);
    expect(
      screen.queryByText('Unavailable with your dealer')
    ).toBeInTheDocument();
  });
  it('Should call update delivery options when dealerSelect enabled, dealerized and delivery method changed', () => {
    const props = {
      title: 'DELIVERY',
      selectButtonText: 'Select',
      isDealerized: true,
      isDealerSelectEnabled: true,
      selectedDeliveryMethod: 'delivery',
      updateDeliveryMethodShowDealer: jest.fn(),
      updateDeliveryOptions: jest.fn(),
      updateSelectedDeliveryMethod: jest.fn(),
    };
    render(<DeliveryCard {...props} />);
    const selectButton = screen.queryByText('Select');
    fireEvent.click(selectButton);
    expect(props.updateDeliveryOptions).toHaveBeenCalled();
    expect(props.updateSelectedDeliveryMethod).not.toHaveBeenCalled();
  });
  it('Should call update selected delivery method when dealerSelect enabled, not dealerized and delivery method changed', () => {
    const props = {
      title: 'DELIVERY',
      deliveryMethodFee: '$500',
      selectButtonText: 'Select',
      isDealerized: false,
      isDealerSelectEnabled: true,
      selectedDeliveryMethod: 'collection',
      updateDeliveryMethodShowDealer: jest.fn(),
      updateDeliveryOptions: jest.fn(),
      updateSelectedDeliveryMethod: jest.fn(),
    };
    render(<DeliveryCard {...props} />);
    const selectButton = screen.queryByText('Select');
    fireEvent.click(selectButton);
    expect(props.updateDeliveryOptions).not.toHaveBeenCalled();
    expect(props.updateSelectedDeliveryMethod).toHaveBeenCalled();
  });

  it('Should render add to finance checkbox, if selectedFinancePlan is not cash and payment provider is Santander and has some delivery fee', () => {
    const props = {
      title: 'DELIVERY',
      addToFinanceLabel: 'Add to Finance',
      enableDeliveryFinancing: true,
      isDeliveryUnavailable: false,
      calculated: true,
      isSelected: true,
      selectedFinancePlan: 'fsl',
      paymentProvider: 'Santander',
      deliveryFee: 100,
    };
    render(<DeliveryCard {...props} />);
    expect(screen.queryByText('Add to Finance')).toBeInTheDocument();
  });

  it('Should not render add to finance checkbox, if selectedFinancePlan is cash or payment provider is not Santander', () => {
    const props = {
      title: 'DELIVERY',
      addToFinanceLabel: 'Add to Finance',
      enableDeliveryFinancing: true,
      isDeliveryUnavailable: false,
      calculated: true,
      isSelected: true,
      selectedFinancePlan: 'c',
      paymentProvider: 'GFC',
      deliveryFee: 0,
    };
    render(<DeliveryCard {...props} />);
    expect(screen.queryByText('Add to Finance')).not.toBeInTheDocument();
  });

  it('Should update delivery to finance, if checked for add to finance', () => {
    const props = {
      title: 'DELIVERY',
      addToFinanceLabel: 'Add to Finance',
      enableDeliveryFinancing: true,
      isDeliveryUnavailable: false,
      calculated: true,
      isSelected: true,
      selectedFinancePlan: 'fsl',
      paymentProvider: 'Santander',
      deliveryFee: 100,
      updateDeliveryFinance: jest.fn(),
    };
    render(<DeliveryCard {...props} />);
    const btn = screen.queryByText('Add to Finance');
    fireEvent.click(btn);
    expect(props.updateDeliveryFinance).toHaveBeenCalled();
  });

  it('Should render nonDealerizedCartContent if no dealer is available in cart', () => {
    const props = {
      title: 'DELIVERY',
      cardType: 'delivery',
      deliveryCardContent: 'No Dealer',
      isDealerized: false,
    };
    render(<DeliveryCard {...props} />);
    expect(screen.queryByText('No Dealer')).toBeInTheDocument();
  });
  it('Should not render nonDealerizedCartContent if dealer is available in cart', () => {
    const props = {
      title: 'DELIVERY',
      cardType: 'delivery',
      deliveryCardContent: 'No Dealer',
      isDealerized: true,
    };
    render(<DeliveryCard {...props} />);
    expect(screen.queryByText('No Dealer')).not.toBeInTheDocument();
  });
});
