import React from 'react';
import {
  cleanup,
  fireEvent,
  renderWithRedux,
  screen,
} from '@Utils/testingLibraryUtils';
import { CartAccordion } from './CartAccordion';
import { financialPlanSuccessData } from '@Ducks/ngc/mockData';
import PropertiesService from '@Services/propertiesService/PropertiesService';
import CountryInformationService from '@Services/countryInformationService/CountryInformationService';
import '@testing-library/jest-dom/extend-expect';
import { ACCORDION_TYPES } from '@Constants/main';
import fetchDisclosure from '@Services/disclosure/disclosure';
import AemMultiFieldHelper from '@Utils/aemMultiFieldHelper/AemMultiFieldHelper';

global.Math.random = () => 1; // Setting random for FDSTooltip

jest.mock('@Services/disclosure/disclosure');

jest.mock('@Utils/Utils', () => ({
  ...jest.requireActual('@Utils/Utils'),
  getIsProduction: () => true,
}));

beforeEach(() => {
  PropertiesService.getPageProperties = jest.fn(() => {
    return { fmaLangCode: 'en_us' };
  });
  CountryInformationService.getCountryCode = jest.fn(() => 'USA');
  fetchDisclosure.mockReturnValue(
    Promise.resolve([
      {
        name: 'disclosure',
        content: 'some content',
        symbol: '**',
      },
      {
        name: 'disclosure 2',
        content: 'some content 2',
        symbol: '†',
      },
    ])
  );
});

afterEach(() => {
  cleanup();
});

const props = {
  title: 'PAYMENT METHOD',
  subtitle: 'Select a payment method.',
  calculatorSharedDataChange: () => {},
  accordionType: ACCORDION_TYPES.PAYMENT_METHOD,
  financePlans: financialPlanSuccessData,
  updatePaymentCategories: jest.fn(),
  fetchFinancialPlan: () => {},
  updateAuthoredNodes: () => {},
  updateSelectedProtectionPlan: () => {},
  checkmarkAltText: '',
  showCartWarning: () => {},
  selectedFinancePlan: '',
  isOpen: true,
  toggleCartAccordion: jest.fn(),
  nextStepsText: 'Next Steps',
  skipCartAccordion: jest.fn(),
  paymentCardSelectAriaLabel: 'Select {planName} as your payment method.',
  paymentMethodRetailCustomerDescription:
    'Showing payment plans for Retail Customers.',
  paymentMethodRetailCustomerButtonText: 'See Business Plans',
  paymentMethodRetailCustomerButtonAriaLabel: 'See Business Plans',
  paymentMethodBusinessCustomerDescription:
    'Showing payment plans for Business Customers.',
  paymentMethodBusinessCustomerButtonText: 'See Retail Plans',
  paymentMethodBusinessCustomerButtonAriaLabel: 'See Retail Plans',
  showAccessories: true,
  showCharging: true,
  showDeliveryMethod: true,
  showIncentives: true,
  showProtectionPlans: true,
  showTradeIn: true,
  showTaxesAndFees: true,
  paymentCategoriesList: [],
  firstThreeAccessories: [],
  optionItems: [],
  userData: [],
  incompleteCartAccordion: jest.fn(),
};

const extendedProps = {
  ...props,
  consolidatedHeader: 'Already Included',
  consolidatedDescription:
    '{noOfIncludedCards} items are already included with the vehicle.',
  consolidatedIncludedCardsLength: 5,
  consolidatedButtonText: 'View All',
  consolidatedButtonUrl:
    '/content/guxeu/uk/en_gb/home/root/basket/charging.html',
  consolidatedButtonOpenUrlIn: 'same_window',
  consolidatedAltImageText: 'Your Ford vehicle',
  'data-v-f2c1522c': '',
  dealerInstalledOptionsDescription: undefined,
  dealerInstalledOptionsIncludedCardsLength: undefined,
  dealerInstalledOptionsVdmDis: undefined,
  dealerInstalledOptionsAccDis: undefined,
  dealerInstalledOptionsSecondPartDescription: undefined,
};

const includedChargingRedux = [
  {
    code: 'HTSAD',
    shortDescription: 'UNIVERSAL HOME CHARGE CORD',
    imageAssets: [
      {
        sequenceNumber: 0,
        featureConditions: 'HTSAD',
        assetPath:
          '//guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
        videoLinks: [],
      },
    ],
    productType: 'CHARGING',
    state: 'INCLUDED',
    financeData: {
      financeType: 'CASH',
    },
  },
  {
    code: 'JZCAE',
    shortDescription:
      'UP TO 115KW DC HIGH POWER CHARGING (STANDARD RANGE) & UP TO 150KW DC HIGH POWER CHARGING (EXTENDED RANGE)',
    imageAssets: [
      {
        sequenceNumber: 0,
        featureConditions: 'JZCAE',
        assetPath:
          '//guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
        videoLinks: [],
      },
    ],
    productType: 'CHARGING',
    state: 'INCLUDED',
    financeData: {
      financeType: 'CASH',
    },
  },
];

describe('CartAccordion', () => {
  it('should be open', () => {
    renderWithRedux(<CartAccordion {...props} />);
    expect(screen.getByLabelText(props.title)).toBeInTheDocument();
  });

  it('when the accordion type is payment method and there are business finance plans', () => {
    renderWithRedux(<CartAccordion {...props} isAnyBusinessPlans />);
    expect(
      screen.getByText(props.paymentMethodBusinessCustomerDescription)
    ).toBeInTheDocument();
  });

  it('should have the ability to show (Required)', () => {
    renderWithRedux(
      <CartAccordion {...props} isRequired requiredText="(Required)" />
    );
    expect(screen.getByText('(Required)')).toBeInTheDocument();
  });

  it('should have the ability to show green checkmark', () => {
    renderWithRedux(<CartAccordion {...props} isChecked />);
    const img = screen.getByRole('presentation');
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveAttribute('class', 'chevron-img up');
    expect(img).toHaveAttribute('src', 'chevron-blue.svg');
  });

  it('should have the ability to toggle accordion.', () => {
    const toggleCartAccordion = jest.fn();
    renderWithRedux(
      <CartAccordion {...props} toggleCartAccordion={toggleCartAccordion} />
    );
    expect(screen.getByLabelText(props.title));
    fireEvent.click(screen.getByText(props.title));
    expect(toggleCartAccordion).toHaveBeenCalled();
  });

  it('should display "next steps" if prop present', () => {
    const skipCartAccordion = jest.fn();
    renderWithRedux(
      <CartAccordion
        {...props}
        skipCartAccordion={skipCartAccordion}
        showNextSteps={true}
      />
    );
    expect(screen.getByText(props.nextStepsText));
    fireEvent.click(screen.getByText(props.nextStepsText));
    expect(skipCartAccordion).toHaveBeenCalled();
  });

  describe('Cart accordion functionality to render different accordion types', () => {
    it.each(Object.values(ACCORDION_TYPES))(
      'test each accordion type for correct css class',
      (accordionType) => {
        renderWithRedux(
          <CartAccordion {...props} accordionType={accordionType} />
        );
        const typeGroup = screen.queryByRole('group');
        expect(typeGroup).toHaveClass('cart-accordion ' + accordionType);
      }
    );
  });

  describe('Cart Accordion featureImageURLs', () => {
    it('should have featureImageURLs when in accessories accordion', () => {
      const { container } = renderWithRedux(
        <CartAccordion
          {...props}
          accordionType={ACCORDION_TYPES.ACCESSORIES}
          optionItems={[]}
          firstThreeAccessories={[
            {
              code: 'YAJAG',
              shortDescription:
                'Mottez° Ski & Snowboard Carrier tow bar mounted',
              longDescription:
                "<p>For 6 pairs of skis, or 4 pairs of skis and 1 snowboard, or 2 pairs of skis and 2 snowboards. A quick click system mounts the carrier to the tow ball without using any tools. Skis &amp; snowboards are lockable to the carrier and the carrier is lockable to the tow ball.</p><ul><li>Foldable for continued access to the boot</li><li>Designed to carry different types of skis & snowboards</li><li>Skis & snowboards are easily accessible</li><li>Powder coated and thermo-hardened for anti-rust</li><li>Skis & snowboards aerodynamically mounted sidewards</li><li>Weight: 19 kg</li><li>Always check the vehicle owner's manual or the specifications sticker on the vehicle for the maximum recommended vertical tow bar load.  </li></ul>",
              msrp: 264.95,
              imageAssets: [
                {
                  sequenceNumber: 1,
                  featureConditions: 'YAJAG',
                  assetPath:
                    'accessories/eu_accessory_3_CX727_51171_L_51974_SK012073.jpg',
                  videoLinks: [],
                },
              ],
              mappedPartId: '2483279',
              productType: 'ACCESSORY',
              state: 'AVAILABLE',
              warrantyInformation:
                'Warranty covered by Ford supplier. For further details please ask your Ford dealer.',
              disclaimer: 'Recommended Retail Price including VAT.',
              group: 'Transportation',
              subgroup: 'Rear Transportation',
              sequence: 3,
              isTopSeller: false,
              eprelId: '',
              height: '',
              length: '',
              width: '',
              weight: '',
              financeData: {
                financeType: 'CASH',
              },
            },
            {
              code: 'YKGAJ',
              shortDescription: 'Rubber Floor Mats front and rear, black',
              longDescription:
                '<p>Set of 3, with Mach-E logo on the front mats and fixings on driver and passenger side. Pony logo on the single one-piece rear mat.</p>',
              msrp: 133.3,
              imageAssets: [
                {
                  sequenceNumber: 1,
                  featureConditions: 'YKGAJ',
                  assetPath:
                    'accessories/eu_accessory_3_CX727_50091_R_52370_2526939_SK012000.jpg',
                  videoLinks: [],
                },
              ],
              mappedPartId: '2465290',
              productType: 'ACCESSORY',
              state: 'AVAILABLE',
              warrantyInformation: 'Warranty covered by Ford.',
              disclaimer: 'Recommended Retail Price including VAT.',
              group: 'Protection',
              subgroup: 'Interior Protection',
              sequence: 3,
              isTopSeller: true,
              eprelId: '',
              height: '',
              length: '',
              width: '',
              weight: '',
              financeData: {
                financeType: 'CASH',
              },
            },
            {
              code: 'YBPAH',
              shortDescription:
                'Detachable Tow Bar requires the Electrical Kit and Trailer Rear Module for fitment of the Tow Bar',
              longDescription:
                '<p>Only in combination with vehicle specific electrical kit and trailer rear module. Suitable for rear bike carriers with up to 3 bikes.</p><ul></ul>',
              msrp: 535.33,
              imageAssets: [
                {
                  sequenceNumber: 1,
                  featureConditions: 'YBPAH',
                  assetPath:
                    'accessories/eu_accessory_3_CX727_52367_G_52650_SK011563.jpg',
                  videoLinks: [],
                },
              ],
              mappedPartId: '2483493',
              productType: 'ACCESSORY',
              state: 'AVAILABLE',
              warrantyInformation: 'Warranty covered by Ford.',
              disclaimer:
                'Recommended Retail Price including VAT. Please ask your Ford dealer for additional fitting charges. Please note that supplementary parts may also be required.',
              group: 'Transportation',
              subgroup: 'Tow Bars',
              sequence: 6,
              isTopSeller: false,
              eprelId: '',
              height: '',
              length: '',
              width: '',
              weight: '',
              financeData: {
                financeType: 'CASH',
              },
            },
          ]}
          featureImageURLs={{
            YAJAG: ['https://via.placeholder.com/200x100'],
            YKGAJ: ['https://via.placeholder.com/350x150'],
            YBPAH: ['https://via.placeholder.com/400x200'],
          }}
        />
      );

      expect(container.querySelector('[data-code=YAJAG]').src).toContain(
        'https://via.placeholder.com/200x100'
      );

      expect(container.querySelector('[data-code=YKGAJ]').src).toContain(
        'https://via.placeholder.com/350x150'
      );

      expect(container.querySelector('[data-code=YBPAH]').src).toContain(
        'https://via.placeholder.com/400x200'
      );
    });
    it('should have featureImageURLs when in charging accordion', () => {
      const { container } = renderWithRedux(
        <CartAccordion
          {...extendedProps}
          accordionType={ACCORDION_TYPES.CHARGING}
          optionItems={[]}
          cqPath="bev-cart_checkout.aem.react-app"
          includedChargingRedux={includedChargingRedux}
          featureImageURLs={{
            HTSAD: [
              'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
            JZCAE: [
              'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
          }}
        />
      );

      expect(container.querySelector('[data-code=HTSAD]').src).toContain(
        'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
      expect(container.querySelector('[data-code=JZCAE]').src).toContain(
        'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
    });
    it('should have featureImageURLs when isComplete is true and includedChargingRedux is not empty and renders ListAccessoriesAndChargingCardContainer', () => {
      const { container } = renderWithRedux(
        <CartAccordion
          {...extendedProps}
          isComplete={true}
          accordionType={ACCORDION_TYPES.CHARGING}
          optionItems={[]}
          cqPath="bev-cart_checkout.aem.react-app"
          includedChargingRedux={includedChargingRedux}
          featureImageURLs={{
            HTSAD: [
              'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
            JZCAE: [
              'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
          }}
          addedChargingRedux={[]}
          incompleteCartAccordion={jest.fn()}
        />
      );

      expect(container.querySelector('[data-code=HTSAD]').src).toContain(
        'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
      expect(container.querySelector('[data-code=JZCAE]').src).toContain(
        'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
    });
    it('should have featureImageURLs when isComplete is true and addedChargingRedux is not empty and renders ListAccessoriesAndChargingCardContainer', () => {
      const { container } = renderWithRedux(
        <CartAccordion
          {...extendedProps}
          isComplete={true}
          accordionType={ACCORDION_TYPES.CHARGING}
          optionItems={[]}
          cqPath="bev-cart_checkout.aem.react-app"
          addedChargingRedux={[
            {
              code: 'HTSAD',
              shortDescription: 'UNIVERSAL HOME CHARGE CORD',
              imageAssets: [
                {
                  sequenceNumber: 0,
                  featureConditions: 'HTSAD',
                  assetPath:
                    '//guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
                  videoLinks: [],
                },
              ],
              productType: 'CHARGING',
              state: 'INCLUDED',
              financeData: {
                financeType: 'CASH',
              },
            },
            {
              code: 'JZCAE',
              shortDescription:
                'UP TO 115KW DC HIGH POWER CHARGING (STANDARD RANGE) & UP TO 150KW DC HIGH POWER CHARGING (EXTENDED RANGE)',
              imageAssets: [
                {
                  sequenceNumber: 0,
                  featureConditions: 'JZCAE',
                  assetPath:
                    '//guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
                  videoLinks: [],
                },
              ],
              productType: 'CHARGING',
              state: 'INCLUDED',
              financeData: {
                financeType: 'CASH',
              },
            },
          ]}
          featureImageURLs={{
            HTSAD: [
              'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
            JZCAE: [
              'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
          }}
          includedChargingRedux={[]}
          incompleteCartAccordion={jest.fn()}
        />
      );

      expect(container.querySelector('[data-code=HTSAD]').src).toContain(
        'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
      expect(container.querySelector('[data-code=JZCAE]').src).toContain(
        'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
    });
    it('should have featureImageURLs when in charging accordion and ChargingCard has cqPath', () => {
      AemMultiFieldHelper.getMultiFieldProps = jest
        .fn()
        .mockImplementation(() => [
          {
            code: 'HTSAD',
            mediumDescription: 'Test',
            chargingCardPartId: 'PartID',
            'jcr:primaryType': 'nt:unstructured',
            chargingCardIncludedDescription:
              'Our network combines multiple public charging networks, giving you hassle-free pay-as-you-go access to more than 150,000+ public charging stations, all through one account and one app. And access is complimentary for 5 years.',
            chargingCardModalDescription:
              'Our network combines multiple public charging networks, giving you hassle-free pay-as-you-go access to more than 150,000+ public charging stations, all through one account and one app. And access is complimentary for 5 years.',
            chargingCardImage:
              '/content/dam/guxeu/global-shared/cart_checkout/charging/fordpass.jpg',
            chargingCardName: 'On-The-Go Charging',
          },
          {
            code: 'JZCAE',
            mediumDescription: 'Test',
            chargingCardPartId: 'PartID',
            'jcr:primaryType': 'nt:unstructured',
            chargingCardIncludedDescription:
              'Premium On-The-Go Charging is complimentary for 1 year and provides preferential rates for high-power charging through Ionity, one of the many networks that make up the FordPass Charging Network.',
            chargingCardModalDescription:
              'Premium On-The-Go Charging is complimentary for 1 year and provides preferential rates for high-power charging through Ionity, one of the many networks that make up the FordPass Charging Network.',
            chargingCardImage:
              '/content/dam/guxeu/global-shared/cart_checkout/charging/card-detail-charging-network-02.jpg',
            chargingCardName: 'Premium On-The-Go Charging',
          },
        ]);

      const { container } = renderWithRedux(
        <CartAccordion
          {...extendedProps}
          accordionType={ACCORDION_TYPES.CHARGING}
          optionItems={[]}
          cqPath="bev-cart_checkout.aem.react-app"
          featureImageURLs={{
            HTSAD: [
              'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
            JZCAE: [
              'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
          }}
        />
      );

      expect(container.querySelector('[data-code=HTSAD]').src).toContain(
        'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
      expect(container.querySelector('[data-code=JZCAE]').src).toContain(
        'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
    });
    it('should have featureImageURLs when isComplete is true and chargingCard has cards and renders ListAccessoriesAndChargingCardContainer', () => {
      AemMultiFieldHelper.getMultiFieldProps = jest
        .fn()
        .mockImplementation(() => [
          {
            code: 'HTSAD',
            mediumDescription: 'Test',
            chargingCardPartId: 'PartID',
            'jcr:primaryType': 'nt:unstructured',
            chargingCardIncludedDescription:
              'Our network combines multiple public charging networks, giving you hassle-free pay-as-you-go access to more than 150,000+ public charging stations, all through one account and one app. And access is complimentary for 5 years.',
            chargingCardModalDescription:
              'Our network combines multiple public charging networks, giving you hassle-free pay-as-you-go access to more than 150,000+ public charging stations, all through one account and one app. And access is complimentary for 5 years.',
            chargingCardImage:
              '/content/dam/guxeu/global-shared/cart_checkout/charging/fordpass.jpg',
            chargingCardName: 'On-The-Go Charging',
          },
          {
            code: 'JZCAE',
            mediumDescription: 'Test',
            chargingCardPartId: 'PartID',
            'jcr:primaryType': 'nt:unstructured',
            chargingCardIncludedDescription:
              'Premium On-The-Go Charging is complimentary for 1 year and provides preferential rates for high-power charging through Ionity, one of the many networks that make up the FordPass Charging Network.',
            chargingCardModalDescription:
              'Premium On-The-Go Charging is complimentary for 1 year and provides preferential rates for high-power charging through Ionity, one of the many networks that make up the FordPass Charging Network.',
            chargingCardImage:
              '/content/dam/guxeu/global-shared/cart_checkout/charging/card-detail-charging-network-02.jpg',
            chargingCardName: 'Premium On-The-Go Charging',
          },
        ]);

      const { container } = renderWithRedux(
        <CartAccordion
          {...extendedProps}
          isComplete={true}
          accordionType={ACCORDION_TYPES.CHARGING}
          optionItems={[]}
          cqPath="bev-cart_checkout.aem.react-app"
          includedChargingRedux={[]}
          addedChargingRedux={[]}
          incompleteCartAccordion={jest.fn()}
          featureImageURLs={{
            HTSAD: [
              'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
            JZCAE: [
              'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
          }}
        />
      );

      expect(container.querySelector('[data-code=HTSAD]').src).toContain(
        'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
      expect(container.querySelector('[data-code=JZCAE]').src).toContain(
        'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
    });
    it('should have featureImageURLs when isComplete is true and availableAndAddedChargingRedux has cards and isHideChargingWhenLease is true and renders ListAccessoriesAndChargingCardContainer', () => {
      const { container } = renderWithRedux(
        <CartAccordion
          {...extendedProps}
          accordionType={ACCORDION_TYPES.CHARGING}
          optionItems={[]}
          availableAndAddedChargingRedux={[
            {
              code: 'HTSAD',
              shortDescription: 'UNIVERSAL HOME CHARGE CORD',
              imageAssets: [
                {
                  sequenceNumber: 0,
                  featureConditions: 'HTSAD',
                  assetPath:
                    '//guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
                  videoLinks: [],
                },
              ],
              productType: 'CHARGING',
              state: 'INCLUDED',
              financeData: {
                financeType: 'CASH',
              },
            },
            {
              code: 'JZCAE',
              shortDescription:
                'UP TO 115KW DC HIGH POWER CHARGING (STANDARD RANGE) & UP TO 150KW DC HIGH POWER CHARGING (EXTENDED RANGE)',
              imageAssets: [
                {
                  sequenceNumber: 0,
                  featureConditions: 'JZCAE',
                  assetPath:
                    '//guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
                  videoLinks: [],
                },
              ],
              productType: 'CHARGING',
              state: 'INCLUDED',
              financeData: {
                financeType: 'CASH',
              },
            },
          ]}
          cqPath="bev-cart_checkout.aem.react-app"
          includedChargingRedux={[]}
          addedChargingRedux={[]}
          incompleteCartAccordion={jest.fn()}
          featureImageURLs={{
            HTSAD: [
              'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
            JZCAE: [
              'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100',
            ],
          }}
        />
      );

      expect(container.querySelector('[data-code=HTSAD]').src).toContain(
        'https://guid/6e3079fd-c297-31a0-9e53-a6328e5dda16.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
      expect(container.querySelector('[data-code=JZCAE]').src).toContain(
        'https://guid/735aaed3-2a0f-3760-814e-8e5502b37676.jpg?catalogId=WAEGB-CGW-2021-CX727BEVSUVGBR202100'
      );
    });
  });
});
