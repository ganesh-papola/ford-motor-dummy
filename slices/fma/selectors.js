import { GLOBAL_REGEX } from '@Constants/main';

export const getFma = (state) => state?.fma || {};

export const getFmaIsAuthenticated = (state) => getFma(state)?.isAuthenticated;

export const getUserHasGuestGUID = (state) =>
  String(getFma(state)?.guestGUID).match(GLOBAL_REGEX.GUID) !== null;
// String.match will return null if there are no strings that match, i.e. if it's not a valid guid, it will come back null

export const getGuestGUID = (state) => getFma(state)?.guestGUID;

export const getFMAorGuestGUIDAuth = (state) =>
  getFma(state)?.isAuthenticated || getUserHasGuestGUID(state);

export const getOverrideFmaRequired = (state) =>
  getFma(state)?.overrideFmaRequired;

export const getAccessToken = (state) => getFma(state)?.access_token;

export const getIsFmaLoading = (state) => getFma(state)?.isLoading;
