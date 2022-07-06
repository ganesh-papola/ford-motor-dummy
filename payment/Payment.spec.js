import React from 'react';
import { shallow } from 'enzyme';
import { Payment } from './Payment';
import SapCommerceService from '@Services/sapCommerceService/SapCommerceService';
import PropertiesService from '@Services/propertiesService/PropertiesService';
import ReservationLimitModal from '../yourDetails/reservationLimitModal/ReservationLimitModal';
import CountryInformationService from '@Services/countryInformationService/CountryInformationService';
import { CATALOG_IDS } from '@Constants/main';

jest.mock('@Services/sapCommerceService/SapCommerceService');
jest.mock('@Services/countryInformationService/CountryInformationService');

describe('Payment Page Component', () => {
  const mockProps = {
    countryCode: 'GBR',
    fmaLogIn: jest.fn(),
    isAuthenticated: true,
    disclosuresAuthorSelected: jest.fn(),
    paymentRedirectUrl: '#',
    dealerData: {
      commonId: 'dealer code',
      dealerName: 'dealer name',
      reservationDeposit: {
        currency: 'USD',
        value: '10',
      },
    },
    spaFlowInfo: [
      {},
      {},
      {},
      {
        url: 'some url',
      },
    ],
  };

  let wrapper;
  const setupWrapper = (props = {}) => {
    wrapper = shallow(<Payment {...mockProps} {...props} />);
  };

  beforeEach(() => {
    PropertiesService.getPageProperties = jest.fn(() => {
      return {
        catalogId: 'WANAB-CGW-2021-CX727',
      };
    });

    CountryInformationService.getCountryCode = jest.fn(() => {
      return 'USA';
    });

    const mockDocumentQuerySelector = () => {
      const mockFordPayInput = document.createElement('input');
      mockFordPayInput.setAttribute('class', 'btn');
      mockFordPayInput.setAttribute('type', 'submit');
      mockFordPayInput.setAttribute('value', 'text');
      return mockFordPayInput;
    };

    window.initializeFordPayForEU = jest.fn(() => {
      return Promise.resolve();
    });

    document.querySelector = jest.fn(mockDocumentQuerySelector);

    Object.defineProperty(window, 'fma', {
      writable: true,
      value: {
        login: jest.fn(),
        CATBundle: {
          access_token: 'some token',
        },
        model: {
          config: {
            redirectUrl: 'www.website.com',
          },
        },
      },
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href:
          'https://www.ford.co.uk/en/home/pre-order/root/confirmation.html?paymentResponse=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b3RhbEFtb3VudCI6IjUwMDAuMDAiLCJtZXJjaGFudElkIjoiMTEyMDU0MTgwMyIsImN1c3RvbUZpZWxkcyI6eyJvcmRlcklkIjoic2l0LTEwMDc2MTAwIn0sImNhcmRUeXBlIjoiTi9BIiwiZXJyb3JNZXNzYWdlIjoiSVBHIFN0YXR1czogRkFJTEVEIiwic3RhdHVzIjoiZmFpbHVyZSJ9.XJz1N3rOLZSztm1zA7RbRwdCme7dTTSUnJ438Q2ro67cVa69LDjevaZBx04w2pc9VCElWAWlGigSEtAlQdGPdRJEZWcHKmYbJ9m5uq_9BSKM45ppHKiuOvrQntI92h2cbR44q3IgK3emKaxP4O8J1i3g6vb3ihNZtRecf1fNOlsFzzIsEYkoleU4V8UqdGdpg930uHU79Fz8ToJAXJZv8qPrhlHMWaj75OzBBWsFNymvxzLVeFGvePVLRknoX9iXdcDQ70UphY85uDhF-4EabCASbu2YLmLl1i68d1rnMcj6IbiaYfcTiHqU1e32RDwkcUsPyQoltYmKYEHipgNAuQ',
      },
    });

    SapCommerceService.reservationDetails = jest.fn(() => {
      return Promise.resolve({ status: 200 });
    });

    SapCommerceService.reservationCount = jest.fn(() => {
      return Promise.resolve();
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('when component is mounted, then will render', () => {
    setupWrapper();
    expect(wrapper.instance()).toBeDefined();
  });

  it(
    'when the user returns to Payment page from FordPay EU, but a reservation was actually made, ' +
      "then redirect the user and do not call 'prepare'",
    async () => {
      CountryInformationService.getCountryCode = jest.fn(() => {
        return 'GBR';
      });
      setupWrapper();

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 200);
      });

      wrapper.update();
      expect(wrapper.state().redirect).toBeTruthy();
    }
  );

  it('when vehicle is Mustang Mach-e, should not call Reservations API and should not display the reservation limit modal ', (timerDone) => {
    const props = {
      catalogId: CATALOG_IDS.MACH_E,
    };
    setupWrapper(props);

    setTimeout(() => {
      timerDone();
      expect(SapCommerceService.reservationCount).not.toHaveBeenCalled();
      wrapper.update();
      expect(wrapper.state().reservationLimitReached).toBeFalsy();
      expect(wrapper.find(ReservationLimitModal).length).toBe(0);
      expect(
        wrapper.find('.payment-components-container').exists()
      ).toBeTruthy();
    }, 100);
  });
});
