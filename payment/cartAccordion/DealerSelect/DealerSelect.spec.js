jest.mock('@Slices/dealerSearch/slice', () => ({
  actions: {
    setDeliveryRadius: jest.fn((payload) => {
      return {
        type: 'dealerSearch/setDeliveryRadius',
        payload,
      };
    }),
  },
}));

jest.mock('@Services/propertiesService/PropertiesService.js', () => ({
  __esModule: true,
  default: {
    getPageProperties: jest.fn(() => ({
      dealerSelectSearchRadius: '100',
    })),
  },
}));

jest.mock('@Slices/dealerSearch/thunkHelpers', () => ({
  ...jest.requireActual('@Slices/dealerSearch/thunkHelpers'),
  allocateAndGetDistanceToDealer: jest.fn(),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DealerSelect } from './DealerSelect';
import { allocateDealer } from '@Slices/dealerSearch/thunks';
import { allocateAndGetDistanceToDealer } from '@Slices/dealerSearch/thunkHelpers';
import '@testing-library/jest-dom/extend-expect';
import configureStore from 'redux-mock-store';
import { initialState as dealerSearchInitialState } from '@Slices/dealerSearch/initialState';
import { Provider } from 'react-redux';
import { actions as dealerSearchActions } from '@Slices/dealerSearch/slice';
import thunk from 'redux-thunk';

const props = {
  dealerSelectDropdownDistanceUnitOfMeasure: 'miles',
  dealerSelectLocationInputLabel: 'Your Location',
  dealerSelectLocationInputErrorMessage: 'Location Error',
  dealerSelectLocationSubmitButtonAriaText: 'Submit Location',
  dealerSelectUseMyLocationLabel: 'Use My Location',
  dealerSelectInternationalCustomerButtonText: 'I am an International Customer',
  dealerSelectInternationalCustomerButtonLink: 'https://google.com',
  dealerSelectInternationalCustomerButtonLinkQueryParam:
    '?customertype=international&searchtype=location',
  dealerSelectInternationalCustomerTooltipTitle: 'Tooltip Title',
  dealerSelectInternationalCustomerTooltipContent: 'Tooltip Content',
  dealerSelectDealerName: 'DEES of Wimbledon',
  dealerSelectDealerDistance: '7.3',
  dealerSelectDealerDistanceCopy: 'miles from your location',
  dealerSelectAvailabilityPlaceHolder:
    'Available From: {minLeadTime}-{maxLeadTime} Weeks',
  dealerSelectChangeDealerText: 'Change Dealer',
  dealerSelectChangeDealerPath: 'https://google.com',
  dealerSelectChangeDealerPathQueryParam: '?customertype=local',
  firstMinLeadTime: '23',
  firstMaxLeadTime: '54',
  dealerSelectInternationalCustomerToolTipAriaLabel: 'Tooltip Aria',
  dealerSelectSearchByDealerButtonText: 'Search By Dealer',
  dealerSelectSearchByDealerButtonLink: 'https://google.com/dealer',
  dealerSelectSearchByDealerButtonLinkQueryParam:
    '?customertype=local&searchtype=dealer',
  dealerSelectSearchByDealerSeparator: '|',
  suggestedDealers: [
    {
      address: { town: 'glasgow' },
      name: 'oranges',
      distance: 45,
    },
    {
      address: { town: 'glasgow part two' },
      name: 'oranges',
      distance: 47.7,
    },
    {
      address: { town: 'london' },
      name: 'watermelons',
      distance: 64,
    },
  ],
  dealerSelectEmptyResultsErrorMessage: 'No Location Found',
  dealerZipCode: '45B0 1',
  selectedDeliveryMethod: 'delivery',
  dealerId: '1234',
  nameplate: 'Mustang Mach e',
  handleChangeDealerClick: jest.fn(),
  removeCartNotificationMessages: jest.fn(),
  searchedLocationOrDealerAnalytic: jest.fn(),
  updateShowCartNotification: jest.fn(),
};

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockInitialState = {
  dealerSearch: { ...dealerSearchInitialState },
};

describe('DealerSelect', () => {
  it('should call setDeliveryRadius action to update state using dealerSelectSearchRadius bev_property', () => {
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...props} />
      </Provider>
    );
    expect(dealerSearchActions.setDeliveryRadius).toHaveBeenCalledTimes(1);
  });

  it('should render only dealer select form by default', () => {
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...props} />
      </Provider>
    );
    expectDealerFormIsInTheDocument();
    expectDealerInfoIsNotInTheDocument();
  });

  it('should render dealer information and not dealer form after dealer is selected', () => {
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...props} isDealerized={true} />
      </Provider>
    );
    // Default state tested above.
    expectDealerInfoIsInTheDocument();
    expectDealerFormIsNotInTheDocument();
  });

  it('Should not render TextInput when the dealerSelectLocationInputLabel is not authored', () => {
    const newProps = { ...props, dealerSelectLocationInputLabel: undefined };
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...newProps} />
      </Provider>
    );
    expect(screen.queryByLabelText('Your Location')).not.toBeInTheDocument();
  });

  it('Should show error message onclick of dealerSelectLocationButton when dealerSelectInput is empty', () => {
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...props} />
      </Provider>
    );
    const dealerSelectInput = screen.queryByLabelText('Your Location');
    const dealerSelectLocationButton = screen.queryByLabelText(
      'Submit Location'
    );
    expect(dealerSelectInput.value).toBe('');
    expect(screen.queryByText('Location Error')).not.toBeInTheDocument();
    expect(dealerSelectInput).not.toHaveFocus();
    fireEvent.click(dealerSelectLocationButton);
    expect(dealerSelectInput).toHaveFocus();
    expect(screen.queryByText('Location Error')).toBeInTheDocument();
  });

  it('Should not render Submit Button when the dealerSelectLocationSubmitButtonAriaText is not authored', () => {
    const newProps = {
      ...props,
      dealerSelectLocationSubmitButtonAriaText: undefined,
    };
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...newProps} />
      </Provider>
    );
    expect(
      screen.queryByRole('button', { name: 'Submit Location' })
    ).not.toBeInTheDocument();
  });

  it('Should not render Use My Location Button when the dealerSelectUseMyLocationLabel is not authored', () => {
    const newProps = {
      ...props,
      dealerSelectUseMyLocationLabel: undefined,
    };
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...newProps} />
      </Provider>
    );
    expect(
      screen.queryByRole('button', { name: 'Use My Location' })
    ).not.toBeInTheDocument();
  });

  it('Should not render Search By Dealer Button when the dealerSelectSearchByDealerButtonText and dealerSelectSearchByDealerButtonLink is not authored', () => {
    const newProps = {
      ...props,
      dealerSelectSearchByDealerButtonText: undefined,
      dealerSelectSearchByDealerButtonLink: undefined,
    };
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...newProps} />
      </Provider>
    );
    expect(
      screen.queryByRole('link', { name: 'Search By Dealer' })
    ).not.toBeInTheDocument();
  });

  it('Should not render Customer Type Button when the dealerSelectInternationalCustomerButtonText and dealerSelectInternationalCustomerButtonLink is not authored', () => {
    const newProps = {
      ...props,
      dealerSelectInternationalCustomerButtonText: undefined,
      dealerSelectInternationalCustomerButtonLink: undefined,
    };
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...newProps} />
      </Provider>
    );
    expect(
      screen.queryByRole('link', { name: 'I am an International Customer' })
    ).not.toBeInTheDocument();
  });

  it('Should not render Dealer Info when the dealerSelectDealerName is not authored', () => {
    const newProps = {
      ...props,
      dealerSelectDealerName: undefined,
      isDealerized: true,
    };
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...newProps} />
      </Provider>
    );
    expect(screen.queryByText('DEES of Wimbledon')).not.toBeInTheDocument();
  });

  it('Should not render Dealer Location when the dealerSelectDealerDistance is not authored', () => {
    const newProps = {
      ...props,
      dealerSelectDealerDistance: undefined,
      isDealerized: true,
    };
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...newProps} />
      </Provider>
    );
    expect(
      screen.queryByText('7.3 miles from your location')
    ).not.toBeInTheDocument();
  });

  it('Should not render Dealer Location when the dealerSelectDealerDistanceCopy is not authored', () => {
    const newProps = {
      ...props,
      dealerSelectDealerDistanceCopy: undefined,
      isDealerized: true,
    };
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...newProps} />
      </Provider>
    );
    expect(
      screen.queryByText('7.3 miles from your location')
    ).not.toBeInTheDocument();
  });

  it('should show deliveryDataDealerDistance rather than dealerSelectDealerDistance', () => {
    const newProps = {
      ...props,
      deliveryDataDealerDistance: 99,
      isDealerized: true,
    };
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...newProps} />
      </Provider>
    );
    expect(
      screen.queryByText('99 miles from your location')
    ).toBeInTheDocument();
  });

  it('Should not render Dealer Availability when the firstMinLeadTime and firstMaxLeadTime is not available', () => {
    const newProps = {
      ...props,
      firstMinLeadTime: undefined,
      firstMaxLeadTime: undefined,
      isDealerized: true,
    };
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...newProps} />
      </Provider>
    );
    expect(
      screen.queryByText(/^(Available From:).*(Weeks)$/)
    ).not.toBeInTheDocument();
  });

  it('Should not render Change Dealer when the ChangeDealerText and Path are not authored', () => {
    const newProps = {
      ...props,
      dealerSelectChangeDealerText: undefined,
      dealerSelectChangeDealerPath: undefined,
      isDealerized: true,
    };
    render(
      <Provider store={mockStore(mockInitialState)}>
        <DealerSelect {...newProps} />
      </Provider>
    );

    expect(
      screen.queryByRole('link', { name: 'Change Dealer' })
    ).not.toBeInTheDocument();
  });

  describe('When user enters the "Enter" key', () => {
    it('should dispatch allocateDealer thunk with first dealer from suggested dealers when valid location is typed', () => {
      const store = mockStore(mockInitialState);
      render(
        <Provider store={store}>
          <DealerSelect {...props} />
        </Provider>
      );
      const dealerSelectInput = screen.queryByLabelText('Your Location');
      fireEvent.change(dealerSelectInput, { target: { value: 'xxxxx' } });
      expect(dealerSelectInput.value).toBe('xxxxx');
      screen.getByLabelText('Your Location').focus();
      fireEvent.keyDown(dealerSelectInput, {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
      const actions = store.getActions();
      const allocateDealerAction = actions.filter(
        (obj) => obj.type === 'dealerSearch/allocateDealer/pending'
      );
      expect(allocateDealerAction.length).toEqual(1);
    });
    it('should not dispatch allocateDealer thunk with first dealer from suggested dealers when invalid location is typed', () => {
      const store = mockStore(mockInitialState);
      const newProps = { ...props, suggestedDealers: [] };
      render(
        <Provider store={store}>
          <DealerSelect {...newProps} />
        </Provider>
      );
      const dealerSelectInput = screen.queryByLabelText('Your Location');
      fireEvent.change(dealerSelectInput, { target: { value: 'xxxxx' } });
      expect(dealerSelectInput.value).toBe('xxxxx');
      screen.getByLabelText('Your Location').focus();
      fireEvent.keyDown(dealerSelectInput, {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
      const actions = store.getActions();
      const allocateDealerAction = actions.filter(
        (obj) => obj.type === 'dealerSearch/allocateDealer/pending'
      );
      expect(allocateDealerAction.length).toEqual(0);
    });
  });

  describe('No dealers located in radius modal pop up', () => {
    it('should show warning modal when no dealers found in use my location radius', () => {
      const dealerSearchWarningProps = {
        showDealerSearchWarningModal: true,
        dealerSearchWarningModalTitle: 'Dealer search warning',
        dealerSearchWarningModalBodyContent: 'No Dealer Found !!',
        dealerSearchWarningModalCtaLabel: 'Ok',
        dealerSearchWarningModalCtaAriaLabel: 'Ok',
        checkDealerSearchWarningModal: true,
        handleButtonOnClick: jest.fn(),
        autoAllocateDealerFromBrowserLocation: jest.fn(),
        autoAllocateDealerHasFailed: true,
      };
      const newProps = { ...props, ...dealerSearchWarningProps };
      const store = mockStore(mockInitialState);
      render(
        <Provider store={store}>
          <DealerSelect {...newProps} />
        </Provider>
      );
      const useMyLocationButton = screen.queryByText('Use My Location');
      fireEvent.click(useMyLocationButton);
      expect(
        screen.queryByText(
          dealerSearchWarningProps.dealerSearchWarningModalTitle
        )
      ).toBeInTheDocument();
    });
  });

  describe('when suggested dealers is a non-empty list', () => {
    it('should allocate the first suggested dealer when user presses enter key', () => {
      const store = mockStore(mockInitialState);
      render(
        <Provider store={store}>
          <DealerSelect {...props} />
        </Provider>
      );

      const locationSearchField = screen.queryByLabelText(
        props.dealerSelectLocationInputLabel
      );
      enterTextIntoSearchFieldAndExpectThatFieldIsUpdated(locationSearchField);

      locationSearchField.focus();
      fireEvent.keyDown(locationSearchField, {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });

      const allocateDealerActions = store
        .getActions()
        .filter(({ type }) => type === allocateDealer.pending.type);

      expect(allocateDealerActions.length).toEqual(1);

      expect(allocateAndGetDistanceToDealer.mock.calls[0][0]).toEqual(
        props.suggestedDealers[0]
      );
    });

    it('should allocate the first suggested dealer when user clicks arrow button', () => {
      const store = mockStore(mockInitialState);
      render(
        <Provider store={store}>
          <DealerSelect {...props} />
        </Provider>
      );

      const locationSearchField = screen.queryByLabelText(
        props.dealerSelectLocationInputLabel
      );
      enterTextIntoSearchFieldAndExpectThatFieldIsUpdated(locationSearchField);

      const dealerSelectArrowButton = screen.queryByRole('button', {
        name: props.dealerSelectLocationSubmitButtonAriaText,
      });
      fireEvent.click(dealerSelectArrowButton);

      const allocateDealerActions = store
        .getActions()
        .filter(({ type }) => type === allocateDealer.pending.type);

      expect(allocateDealerActions.length).toEqual(1);

      expect(allocateAndGetDistanceToDealer.mock.calls[0][0]).toEqual(
        props.suggestedDealers[0]
      );
    });
    it('Button should be disabled after first fire event', () => {
      const store = mockStore(mockInitialState);
      render(
        <Provider store={store}>
          <DealerSelect {...props} />
        </Provider>
      );

      const locationSearchField = screen.queryByLabelText(
        props.dealerSelectLocationInputLabel
      );
      enterTextIntoSearchFieldAndExpectThatFieldIsUpdated(locationSearchField);

      const dealerSelectArrowButton = screen.queryByRole('button', {
        name: props.dealerSelectLocationSubmitButtonAriaText,
      });

      expect(dealerSelectArrowButton).not.toBeDisabled();
      fireEvent.click(dealerSelectArrowButton);
      expect(dealerSelectArrowButton).toBeDisabled();
      expect(dealerSelectArrowButton).toHaveAttribute('disabled');
    });
    it('Button should be disabled after first Enter key press event', () => {
      const store = mockStore(mockInitialState);
      render(
        <Provider store={store}>
          <DealerSelect {...props} />
        </Provider>
      );

      const locationSearchField = screen.queryByLabelText(
        props.dealerSelectLocationInputLabel
      );
      const dealerSelectArrowButton = screen.queryByRole('button', {
        name: props.dealerSelectLocationSubmitButtonAriaText,
      });
      enterTextIntoSearchFieldAndExpectThatFieldIsUpdated(locationSearchField);
      expect(dealerSelectArrowButton).not.toBeDisabled();
      locationSearchField.focus();
      fireEvent.keyDown(locationSearchField, {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
      fireEvent.click(dealerSelectArrowButton);
      expect(dealerSelectArrowButton).toBeDisabled();
      expect(dealerSelectArrowButton).toHaveAttribute('disabled');
    });

    describe('for the list of suggested dealers', () => {
      const {
        suggestedDealers,
        dealerSelectDropdownDistanceUnitOfMeasure: distanceUom,
      } = props;

      const testCases = [
        ['first', suggestedDealers[0]],
        ['second', suggestedDealers[1]],
        ['third', suggestedDealers[2]],
      ];

      beforeEach(() => {
        allocateAndGetDistanceToDealer.mockClear();
      });

      it.each(testCases)(
        'it should allocate the %s dealer when that dealer is clicked in the list',
        (_, suggestedDealer) => {
          const store = mockStore(mockInitialState);
          render(
            <Provider store={store}>
              <DealerSelect {...props} />
            </Provider>
          );

          const locationSearchField = screen.queryByLabelText(
            props.dealerSelectLocationInputLabel
          );
          enterTextIntoSearchFieldAndExpectThatFieldIsUpdated(
            locationSearchField
          );

          const selectedDealerTextContent = getSuggestedDealerButtonTextContent(
            {
              distanceUom,
              suggestedDealer,
            }
          );

          const selectedDealerButton = screen.getByText(
            (content, node) =>
              node.tagName === 'BUTTON' &&
              node.textContent === selectedDealerTextContent
          );

          fireEvent.click(selectedDealerButton);

          const allocateDealerActions = store
            .getActions()
            .filter(({ type }) => type === allocateDealer.pending.type);

          expect(allocateDealerActions.length).toEqual(1);

          expect(allocateAndGetDistanceToDealer.mock.calls[0][0]).toEqual(
            suggestedDealer
          );
        }
      );

      it('it should check if leadTime and distance are populated in the list', () => {
        const store = mockStore(mockInitialState);
        const mockData = [
          {
            address: {
              town: 'WOODFORD',
            },
            code: 'GBR|42184|MA|F',
            distance: 13.586441,
            leadTime: '7',
            name: 'Gates of Woodford',
          },
          {
            address: {
              town: 'ENFIELD',
            },
            code: 'GBR|42184|LA|F',
            distance: 17.657179,
            leadTime: '1',
            name: 'Gates of Enfield',
          },
          {
            address: {
              town: 'Harlow',
            },

            code: 'GBR|42184|AA|F',
            distance: 26.82453,
            leadTime: '8',
            name: 'Gates of Harlow',
          },
        ];

        const extendedProps = {
          ...props,
          suggestedDealers: mockData,
          dealerSelectDropdownDistanceUnitOfMeasure: 'Mile(s)',
          dealerSelectAvailabilityPlaceHolder:
            'Available From: {minLeadTime} Week(s)',
        };

        render(
          <Provider store={store}>
            <DealerSelect {...extendedProps} />
          </Provider>
        );

        const checkForLeadTime = screen.getByText('Available From: 8 Week(s)');
        const checkForDistance = screen.getByText('17.7 Mile(s)');

        expect(checkForLeadTime).toBeInTheDocument();
        expect(checkForDistance).toBeInTheDocument();
      });
    });

    describe('Dealer Search returns empty result error message for invalid location', () => {
      it('should render the dealer select empty results error message', () => {
        const { rerender } = render(
          <Provider store={mockStore(mockInitialState)}>
            <DealerSelect {...props} suggestedDealers={[]} />
          </Provider>
        );
        const dealerSelectInput = screen.queryByLabelText('Your Location');
        fireEvent.change(dealerSelectInput, { target: { value: 'xxxxx' } });
        rerender(
          <Provider store={mockStore(mockInitialState)}>
            <DealerSelect {...props} suggestedDealers={[]} />
          </Provider>
        );

        expect(dealerSelectInput.value).toBe('xxxxx');
        expect(screen.queryByText('No Location Found')).toBeInTheDocument();
      });
    });

    it('should disable the search button when dealer search field is empty', () => {
      render(
        <Provider store={mockStore(mockInitialState)}>
          <DealerSelect {...props} suggestedDealers={[]} />)
        </Provider>
      );
      const dealerSelectInput = screen.queryByLabelText('Your Location');
      const dealerSearchButton = screen.queryByRole('button', {
        name: 'Submit Location',
      });
      fireEvent.change(dealerSelectInput, { target: { value: 'xxxxx' } });
      expect(dealerSelectInput.value).toBe('xxxxx');
      expect(dealerSearchButton).toHaveAttribute('disabled');
    });

    it('should call updateShowCartNotification and removeCartNotificationMessages when change dealer clicked', () => {
      render(
        <Provider store={mockStore(mockInitialState)}>
          <DealerSelect {...props} isDealerized={true} />
        </Provider>
      );
      const dealerSelectButtons = [
        screen.queryByText('Change Dealer'),
        screen.queryByText('Search By Dealer'),
        screen.queryByText('I am an International Customer'),
      ];
      dealerSelectButtons.forEach((button, i) => {
        fireEvent.click(button);
        expect(props.updateShowCartNotification).toHaveBeenCalledTimes(i + 1);
        expect(props.removeCartNotificationMessages).toHaveBeenCalledTimes(
          i + 1
        );
      });
    });
  });
});

function expectDealerInfoIsNotInTheDocument() {
  expect(screen.queryByText('DEES of Wimbledon')).not.toBeInTheDocument();
  expect(
    screen.queryByText('7.3 miles from your location')
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText('Available From: 23-54 Weeks')
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: 'Change Dealer' })
  ).not.toBeInTheDocument();
}

function expectDealerFormIsInTheDocument() {
  expect(screen.getByLabelText('Your Location')).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Submit Location' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Use My Location' })
  ).toBeInTheDocument();
}

function expectDealerInfoIsInTheDocument() {
  expect(screen.queryByText('DEES of Wimbledon')).toBeInTheDocument();
  expect(
    screen.queryByText('7.3 miles from your location')
  ).toBeInTheDocument();
  expect(screen.queryByText('Available From: 23-54 Weeks')).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: 'Search By Dealer' })
  ).toHaveAttribute(
    'href',
    'https://google.com/dealer?customertype=local&searchtype=dealer&postcode=45B0 1&deliverymethod=delivery'
  );
  expect(screen.queryByRole('link', { name: 'Change Dealer' })).toHaveAttribute(
    'href',
    'https://google.com?customertype=local&postcode=45B0 1&deliverymethod=delivery'
  );
  expect(
    screen.getByRole('link', { name: 'I am an International Customer' })
  ).toHaveAttribute(
    'href',
    'https://google.com?customertype=international&searchtype=location&postcode=45B0 1&deliverymethod=delivery'
  );
  expect(
    screen.getByRole('button', { name: 'Tooltip Aria' })
  ).toBeInTheDocument();
}

function expectDealerFormIsNotInTheDocument() {
  expect(screen.queryByLabelText('Your Location')).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Submit Location' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Use My Location' })
  ).not.toBeInTheDocument();
}

function enterTextIntoSearchFieldAndExpectThatFieldIsUpdated(
  searchField,
  searchString = 'this is the default search string'
) {
  fireEvent.change(searchField, { target: { value: searchString } });
  expect(searchField.value).toBe(searchString);
}

function getSuggestedDealerButtonTextContent({ distanceUom, suggestedDealer }) {
  const {
    name,
    distance,
    address: { town },
  } = suggestedDealer;

  const distanceFormatted = distance.toFixed(1);

  return `${name}${distanceFormatted} ${distanceUom}${town}`;
}
