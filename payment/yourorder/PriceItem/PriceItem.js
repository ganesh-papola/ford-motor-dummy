import React from 'react';
import cssClasses from 'classnames';
import CurrencyFormatter from '@Utils/currencyFormatter/CurrencyFormatter';

const PriceItem = (props) => {
  const {
    description,
    priceValue,
    renderDisclaimer,
    disclaimerOnLabel,
    disclaimerDetails,
    classNames,
    formattingRequired = false,
    isIalPrice = false,
    suppressZeroValue = false,
  } = props;

  const outerClassName = cssClasses('description-and-price', classNames?.outer);
  const descriptionClassNames = cssClasses(
    'description',
    classNames?.description
  );
  const priceClassNames = cssClasses('price', classNames?.price);
  const formattedPriceValue = formattingRequired
    ? CurrencyFormatter.formatPrice({
        price: priceValue,
        isDelimiterFormattingNeeded: isIalPrice,
      })
    : priceValue;

  return description ? (
    <div className={outerClassName} key={description}>
      <div className={descriptionClassNames}>
        {description}
        {disclaimerOnLabel &&
          renderDisclaimer &&
          renderDisclaimer(disclaimerDetails)}
      </div>
      <div className={priceClassNames}>
        {/* if price value is there (truthy) and suppress zero value is not set to true then only display value*/}
        {(!!priceValue || !suppressZeroValue) && formattedPriceValue}
        {!disclaimerOnLabel &&
          renderDisclaimer &&
          renderDisclaimer(disclaimerDetails)}
      </div>
    </div>
  ) : (
    ''
  );
};
export default PriceItem;
