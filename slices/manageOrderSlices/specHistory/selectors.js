export function getAmendSpecIsLoading(state) {
  return state.isLoading;
}

export function getAmendSpecHasSucceeded(state) {
  return state.hasSucceeded;
}

export function getAmendSpecHasSucceededWithValidData(state) {
  return state.hasSucceededWithValidData;
}

export function getAmendSpecHasFailed(state) {
  return state.hasFailed;
}

export function getAmendHistoryData(state) {
  return state?.amendSpecHistory?.data?.specHistory || [];
}

export function getFormattedOrderAmendments(state) {
  const specDatas = getAmendHistoryData(state);
  return {
    orderAmendments: specDatas.map((specData) => ({
      amendmentDate: specData?.amendmentDate,
      wersCodes: specData.wersCodes?.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.family?.code]: {
            label: '',
            value: curr.values?.[0]?.description,
          },
        };
      }, {}),
    })),
  };
}
