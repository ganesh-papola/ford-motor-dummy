import React, { useState, useEffect, useRef } from 'react';
import Arrow, { ArrowOrientation } from '@Common/arrow/Arrow';
import { interpolateAuthoredText } from '@Utils/Utils';
import FDSTooltip from '@FDS/tooltip/FDSTooltip';
import TextInput from '@Common/inputs/textInput/TextInput';
import UseMyLocationArrow from '@Assets/images/useMyLocationArrow/useMyLocationArrow_blue.svg';
import './DealerSelect.scss';
import { useDispatch } from 'react-redux';
import useDebounce from '@Hooks/useDebounce';
import {
  getSuggestedDealers,
  allocateDealer,
} from '@Slices/dealerSearch/thunks';
import { ValidationState } from '@Common/inputs/validatingTextInput/ValidatingTextInput';
import PropertiesService from '@Services/propertiesService/PropertiesService';
import { actions as dealerSearchActions } from '@Slices/dealerSearch/slice';
import { getDeviceDebounceTime } from '@Utils/Utils';
import { NOTIFICATION_TYPES } from '@Constants/notifications';
import DealerSearchWarningModal from '../../../cart/modals/dealerSearchWarning/DealerSearchWarningModal';
import { dealerSearchResultsAnalytics } from '@Services/analyticsService/dealerSearchAnalytics/dealerSearchResultsAnalytics';

export const DealerSelect = (props) => {
  const {
    dealerId,
    dealerSelectLocationInputLabel,
    dealerSelectLocationInputErrorMessage,
    dealerSelectEmptyResultsErrorMessage,
    dealerSelectDropdownDistanceUnitOfMeasure,
    dealerSelectLocationSubmitButtonAriaText,
    dealerSelectUseMyLocationLabel,
    dealerSelectInternationalCustomerButtonText,
    dealerSelectInternationalCustomerButtonLink,
    dealerSelectInternationalCustomerButtonLinkQueryParam = '?customertype=international&searchtype=location',
    dealerSelectInternationalCustomerTooltipTitle,
    dealerSelectInternationalCustomerTooltipContent,
    dealerSelectInternationalCustomerToolTipAriaLabel,
    dealerSelectDealerName,
    dealerSelectDealerDistance,
    dealerSelectDealerDistanceCopy,
    deliveryDataDealerDistance,
    firstMinLeadTime,
    firstMaxLeadTime,
    dealerSelectAvailabilityPlaceHolder,
    dealerSelectChangeDealerText,
    dealerSelectChangeDealerPath,
    dealerSelectChangeDealerPathQueryParam = '?customertype=local&searchtype=location',
    dealerSelectSearchByDealerButtonText,
    dealerSelectSearchByDealerButtonLink,
    dealerSelectSearchByDealerButtonLinkQueryParam = '?customertype=local&searchtype=dealer',
    dealerSelectSearchByDealerSeparator = '|',
    suggestedDealers,
    autoAllocateDealerFromBrowserLocation,
    isDealerized,
    dealerZipCode,
    selectedDeliveryMethod,
    autoAllocateDealerHasFailed,
    dealerSearchWarningModalTitle,
    dealerSearchWarningModalBodyContent,
    dealerSearchWarningModalCtaLabel,
    dealerSearchWarningModalCtaAriaLabel,
    dealerSearchParams,
    checkDealerSearchWarningModal,
    clearLocationErrorMessage,
    updateShowCartNotification,
    removeCartNotificationMessages,
  } = props;

  const postCodeParam = dealerZipCode ? `&postcode=${dealerZipCode}` : ``;

  const deliveryMethodParam = selectedDeliveryMethod
    ? `&deliverymethod=${selectedDeliveryMethod}`
    : ``;

  const dealerSelectChangeDealerPathQueryParamUpdated =
    dealerSelectChangeDealerPathQueryParam +
    postCodeParam +
    deliveryMethodParam;

  const dealerSelectSearchByDealerButtonLinkQueryParamUpdated =
    dealerSelectSearchByDealerButtonLinkQueryParam +
    postCodeParam +
    deliveryMethodParam;

  const dealerSelectInternationalCustomerButtonLinkQueryParamUpdated =
    dealerSelectInternationalCustomerButtonLinkQueryParam +
    postCodeParam +
    deliveryMethodParam;

  const wrapperRef = useRef(null);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectDealerDisabled, setSelectDealerDisabled] = useState(false);
  const [
    shouldShowSearchErrorMessage,
    setShouldShowSearchErrorMessage,
  ] = useState(false);
  const [showSuggestedSearchResults, setShowSuggestedSearchResults] = useState(
    false
  );
  const [selectedLocationLabel, setSelectedLocationLabel] = useState('');

  const debouncedSearchTerm = useDebounce(
    searchTerm,
    getDeviceDebounceTime({})
  );

  const [
    showDealerSearchWarningModal,
    setShowDealerSearchWarningModal,
  ] = useState(false);

  const searchedDealerLocation = () => {
    const searchedDealerData = {
      dealerId,
      searchResultsLength: suggestedDealers.length,
      descriptor: 'manual search',
      enteredSearchValue: searchTerm,
      selectedIndex: 0,
      searchBy: 'manual location',
      radius: dealerSearchParams?.radius,
    };

    if (searchTerm && suggestedDealers.length > 0) {
      dealerSearchResultsAnalytics(searchedDealerData);
    }

    if (searchTerm && suggestedDealers.length === 0) {
      dealerSearchResultsAnalytics({
        ...searchedDealerData,
        descriptor: 'dealer search:dealer location search:current location',
        selectedIndex: 0,
        searchBy: 'current location',
      });
    }
  };

  const checkSearchErrorMsg = () => {
    if (suggestedDealers.length) {
      setShouldShowSearchErrorMessage(false);
    } else {
      setShouldShowSearchErrorMessage(true);
    }
  };

  useEffect(() => {
    searchedDealerLocation();
    checkSearchErrorMsg();
  }, [suggestedDealers, dealerId]);

  useEffect(() => {
    if (autoAllocateDealerHasFailed) {
      setShowDealerSearchWarningModal(true);
    } else {
      setShowDealerSearchWarningModal(false);
    }
  }, [autoAllocateDealerHasFailed]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(getSuggestedDealers({ searchString: debouncedSearchTerm })).then(
        () => {
          setShowSuggestedSearchResults(true);
        }
      );
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (searchTerm === '') {
      setShowSuggestedSearchResults(false);
      setShouldShowSearchErrorMessage(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      dealerSearchActions.setDeliveryRadius(
        PropertiesService.getPageProperties().dealerSelectSearchRadius
      )
    );
  }, []);

  const handleSearchTermInputChange = (event) => {
    setShouldShowSearchErrorMessage(false);
    const searchString = event.target.value;
    if (searchString !== '' && searchString !== null) {
      setInputValidation({
        validationState: '',
        validationMessage: '',
      });
    }
    if (selectedLocationLabel === searchTerm && searchTerm !== '') return;
    setSearchTerm(searchString);
  };

  const selectDealer = (selectedSuggestedDealer) => {
    if (isSelectDealerDisabled) return;
    setSelectDealerDisabled(true);
    const selectedSuggestedDealerIsValid =
      !!selectedSuggestedDealer &&
      suggestedDealers.includes(selectedSuggestedDealer);
    const defaultSuggestedDealer = suggestedDealers?.[0] ?? {};
    const selectedDealer = selectedSuggestedDealerIsValid
      ? selectedSuggestedDealer
      : defaultSuggestedDealer;
    dispatch(allocateDealer({ selectedDealer }));
    setSelectedLocationLabel(selectedDealer?.name);
    setShowSuggestedSearchResults(false);
  };

  const handleSelectLocationButtonClick = () => {
    if (!searchTerm) return handleEmptySearch();
    selectDealer();
  };

  const handleEnterKeyPress = (event) => {
    if (event.key !== 'Enter') return;
    if (searchTerm === '') return handleEmptySearch();
    selectDealer();
  };

  const [inputValidation, setInputValidation] = useState({
    validationState: '',
    validationMessage: '',
  });

  const dealerSelectAvailability = interpolateAuthoredText(
    {
      minLeadTime: firstMinLeadTime,
      maxLeadTime: firstMaxLeadTime,
    },
    dealerSelectAvailabilityPlaceHolder
  );

  const displayLeadTime = (leadTime) => {
    if (!dealerSelectAvailabilityPlaceHolder) {
      return;
    }
    return interpolateAuthoredText(
      {
        minLeadTime: leadTime,
      },
      dealerSelectAvailabilityPlaceHolder
    );
  };

  const handleEmptySearch = () => {
    if (!searchTerm) {
      setInputValidation({
        validationState: ValidationState.ERROR,
        validationMessage: dealerSelectLocationInputErrorMessage,
      });
      wrapperRef.current.inputRef.current.focus();
    }
  };

  const searchByDealerAuthored =
    dealerSelectSearchByDealerButtonText &&
    dealerSelectSearchByDealerButtonLink;

  const customerButtonAuthored =
    dealerSelectInternationalCustomerButtonText &&
    dealerSelectInternationalCustomerButtonLink;

  const changeDealerAuthored =
    dealerSelectChangeDealerText && dealerSelectChangeDealerPath;

  const onUseMyLocation = () => {
    autoAllocateDealerFromBrowserLocation();
  };

  const handleButtonOnClick = () => {
    if (showDealerSearchWarningModal) {
      clearLocationErrorMessage();
    }
    setShowDealerSearchWarningModal(false);
  };

  const handleChangeDealerClick = () => {
    updateShowCartNotification(false);
    removeCartNotificationMessages({ type: NOTIFICATION_TYPES.DEFAULT });
  };

  const deliveryDataDistanceOrDealerSearchDistance =
    deliveryDataDealerDistance || dealerSelectDealerDistance;

  return (
    <div className="dealer-select__outer">
      {!isDealerized ? (
        <div>
          <div className="dealer-select__inner">
            <div className="dealer-select__inputWrap">
              {dealerSelectLocationInputLabel && (
                <TextInput
                  className="dealer-select__input"
                  ref={wrapperRef}
                  placeholder={dealerSelectLocationInputLabel}
                  showPlaceholder={true}
                  hasBeenTouched={true}
                  value={selectedLocationLabel || searchTerm}
                  onChange={handleSearchTermInputChange}
                  onKeyDown={(event) =>
                    suggestedDealers.length < 1 && event.key === 'Enter'
                      ? event.preventDefault()
                      : handleEnterKeyPress(event)
                  }
                  includeErrorImg={false}
                  ariaRequired={true}
                  validation={inputValidation}
                >
                  <div
                    className={
                      showSuggestedSearchResults
                        ? 'dealer-select__list-wrapper'
                        : 'dealer-select__list-wrapper hidden'
                    }
                  >
                    <ul>
                      {suggestedDealers?.length > 0 &&
                        suggestedDealers.map((suggestedDealer) => (
                          <li
                            className="dealer-select__list-item"
                            key={suggestedDealer?.distance}
                          >
                            <button
                              className="dealer-select__button unbutton"
                              onClick={() => selectDealer(suggestedDealer)}
                              value={suggestedDealer?.name}
                            >
                              <span className="dealer-select__dealerDetails">
                                <span className="dealer-select__dealerName">
                                  {suggestedDealer?.name}
                                </span>
                                {dealerSelectDropdownDistanceUnitOfMeasure &&
                                  suggestedDealer?.distance && (
                                    <span className="dealer-select__dealerDistance">
                                      {`${suggestedDealer?.distance.toFixed(
                                        1
                                      )} ${dealerSelectDropdownDistanceUnitOfMeasure}`}
                                    </span>
                                  )}

                                {dealerSelectAvailabilityPlaceHolder &&
                                  suggestedDealer?.leadTime && (
                                    <span className="dealer-select__dealerLeadTime">
                                      {displayLeadTime(
                                        suggestedDealer?.leadTime
                                      )}
                                    </span>
                                  )}
                              </span>
                              <span className="dealer-select__dealerCity">
                                {suggestedDealer?.address.town}
                              </span>
                            </button>
                          </li>
                        ))}
                      {shouldShowSearchErrorMessage && (
                        <li className="dealer-select__no-location-found">
                          {dealerSelectEmptyResultsErrorMessage}
                        </li>
                      )}
                      {}
                    </ul>
                  </div>
                  {dealerSelectLocationSubmitButtonAriaText && (
                    <button
                      className="dealer-select__location-button"
                      disabled={
                        (suggestedDealers.length < 1 && searchTerm !== '') ||
                        isSelectDealerDisabled
                      }
                      aria-label={dealerSelectLocationSubmitButtonAriaText}
                      onClick={handleSelectLocationButtonClick}
                    >
                      <Arrow orientation={ArrowOrientation.RIGHT} />
                    </button>
                  )}
                </TextInput>
              )}
            </div>
            {dealerSelectUseMyLocationLabel && (
              <div className="dealer-select__use-my-location-container">
                <button
                  className="dealer-select__use-my-location"
                  onClick={onUseMyLocation}
                >
                  <img
                    src={UseMyLocationArrow}
                    className="dealer-select__use-my-location--image"
                    alt=""
                  />
                  {dealerSelectUseMyLocationLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="dealer-select__dealer-container">
          {dealerSelectDealerName && (
            <p className="dealer-select__dealer-name">
              {dealerSelectDealerName}
            </p>
          )}
          {deliveryDataDistanceOrDealerSearchDistance &&
            dealerSelectDealerDistanceCopy && (
              <p className="dealer-select__dealer-location">
                {`${deliveryDataDistanceOrDealerSearchDistance} ${dealerSelectDealerDistanceCopy}`}
              </p>
            )}
          {(firstMinLeadTime || firstMaxLeadTime) && (
            <p className="dealer-select__available-data">
              {dealerSelectAvailability}
            </p>
          )}
          {(searchByDealerAuthored || changeDealerAuthored) && (
            <div className="dealer-select__dealer-customer__container">
              {searchByDealerAuthored && (
                <div className="dealer-select__search-by-dealer">
                  <a
                    onClick={handleChangeDealerClick}
                    href={`${dealerSelectSearchByDealerButtonLink}${dealerSelectSearchByDealerButtonLinkQueryParamUpdated}`}
                    className="dealer-select__search-by-dealer--link"
                  >
                    {dealerSelectSearchByDealerButtonText}
                  </a>
                </div>
              )}
              {searchByDealerAuthored && changeDealerAuthored && (
                <div className="dealer-select__dealer-customer__pipe">
                  {dealerSelectSearchByDealerSeparator}
                </div>
              )}
              {changeDealerAuthored && (
                <p className="dealer-select__change-dealer">
                  <a
                    onClick={handleChangeDealerClick}
                    href={`${dealerSelectChangeDealerPath}${dealerSelectChangeDealerPathQueryParamUpdated}`}
                  >
                    {dealerSelectChangeDealerText}
                  </a>
                </p>
              )}
              {customerButtonAuthored && changeDealerAuthored && (
                <div className="dealer-select__dealer-customer__pipe">
                  {dealerSelectSearchByDealerSeparator}
                </div>
              )}
              {customerButtonAuthored && (
                <div className="dealer-select__customer-type">
                  <a
                    onClick={handleChangeDealerClick}
                    href={`${dealerSelectInternationalCustomerButtonLink}${dealerSelectInternationalCustomerButtonLinkQueryParamUpdated}`}
                    className="dealer-select__customer-type--link"
                  >
                    {dealerSelectInternationalCustomerButtonText}
                  </a>
                  {dealerSelectInternationalCustomerTooltipContent && (
                    <FDSTooltip
                      id="dealerSelectInternationalCustomerTooltip"
                      triggerAriaLabel={
                        dealerSelectInternationalCustomerToolTipAriaLabel
                      }
                      title={dealerSelectInternationalCustomerTooltipTitle}
                      content={dealerSelectInternationalCustomerTooltipContent}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {showDealerSearchWarningModal && checkDealerSearchWarningModal && (
        <DealerSearchWarningModal
          showDealerSearchWarningModal={showDealerSearchWarningModal}
          dealerSearchWarningModalTitle={dealerSearchWarningModalTitle}
          dealerSearchWarningModalBodyContent={
            dealerSearchWarningModalBodyContent
          }
          dealerSearchWarningModalCtaLabel={dealerSearchWarningModalCtaLabel}
          dealerSearchWarningModalCtaAriaLabel={
            dealerSearchWarningModalCtaAriaLabel
          }
          checkDealerSearchWarningModal={checkDealerSearchWarningModal}
          handleButtonOnClick={handleButtonOnClick}
        />
      )}
    </div>
  );
};
