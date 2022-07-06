export function getEstimatedGroupByFromGetCartResponseBody(
  getCartResponseBody
) {
  const product = getProductFromResponseBody(getCartResponseBody);
  const catalogId = product?.catalogId;
  const isCatalogIdValid = isNonEmptyString(catalogId) && catalogId.length > 0;
  if (!isCatalogIdValid) return;

  const featureValueCodes = getGroupByFeatures()
    .map(({ familyCode, guxCategoryLabelsRegex }) =>
      getProductFeatureValueCode({
        product,
        familyCode,
        guxCategoryLabelsRegex,
      })
    )
    .filter((featureValueCode) => featureValueCode !== undefined);

  return [catalogId].concat(featureValueCodes).join(',');
}

export function getGroupByFeatures() {
  return [
    {
      name: 'trim',
      familyCode: '#T#',
      guxCategoryLabelsRegex: /trim/,
      label: 'Interior',
      showInUI: true,
    },

    {
      name: 'series',
      familyCode: 'MarketedSeries',
      guxCategoryLabelsRegex: /series/,
      label: 'Model',
      showInUI: false,
    },

    {
      name: 'bodyStyle',
      familyCode: 'BS-',
      guxCategoryLabelsRegex: /bodystyle/,
      showInUI: false,
    },

    {
      name: 'powertrain',
      familyCode: 'PowerTrain',
      guxCategoryLabelsRegex: /^powertrain/,
      label: 'Range',
      showInUI: true,
    },
    {
      name: 'paint',
      familyCode: 'PAA',
      guxCategoryLabelsRegex: /^paint/,
      label: 'Colour',
      showInUI: true,
    },
    {
      name: 'features',
      familyCode: 'ACC',
      guxCategoryLabelsRegex: /^features/,
      label: 'Extras',
      showInUI: true,
    },
    {
      name: 'features',
      familyCode: 'OCC',
      guxCategoryLabelsRegex: /^features/,
      label: 'Extras',
      showInUI: true,
    },
  ];
}

function getProductFeatureValueCode(params) {
  const {
    product = {},
    familyCode = '',
    guxCategoryLabelsRegex = /^$/,
  } = params;

  const feature = getFeature(product, familyCode);
  const featureValue = getFeatureValue(feature, guxCategoryLabelsRegex);

  return featureValue?.code;
}

function getProductFromResponseBody(responseBody = {}) {
  return responseBody?.entries?.[0]?.product ?? {};
}

function getFeature(product, familyCode) {
  const { features } = product;
  if (!isNonEmptyArray(features)) return;

  return features.filter((feature) =>
    isMatchingFeature(feature, familyCode)
  )[0];
}

function getFeatureValue(feature, guxCategoryLabelsRegex) {
  const { values: featureValues } = feature;
  if (!isNonEmptyArray(featureValues)) return;

  return featureValues.filter((featureValue) =>
    isMatchingFeatureValue(featureValue, guxCategoryLabelsRegex)
  )[0];
}

function isMatchingFeatureValue(featureValue, guxCategoryLabelsRegex) {
  const { code, guxCategoryLabels } = featureValue;

  return (
    isNonEmptyString(code) &&
    isNonEmptyString(guxCategoryLabels) &&
    guxCategoryLabelsRegex.test(guxCategoryLabels)
  );
}

function isMatchingFeature(feature = {}, familyCode) {
  const familyCodeToMatch = feature?.family?.code ?? null;

  return isNonEmptyString(familyCode) && familyCodeToMatch === familyCode;
}

export function isNonEmptyString(valueToCheck) {
  return typeof valueToCheck === 'string' && valueToCheck.length > 0;
}

function isNonEmptyArray(valueToCheck) {
  return Array.isArray(valueToCheck) && valueToCheck.length > 0;
}
