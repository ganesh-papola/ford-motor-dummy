import * as selectors from './selectors';

describe('FMA selectors', () => {
  it('getFma - If no FMA object in state, returns empty object', () => {
    const rootState = {};
    expect(selectors.getFma(rootState)).toEqual({});
  });

  it('getFma - If FMA object in state, returns FMA object', () => {
    const rootState = {
      fma: {
        isAuthenticated: false,
      },
    };

    expect(selectors.getFma(rootState)).toEqual(rootState.fma);
  });

  it('getFmaIsAuthenticated - If no isAuthenticated property in FMA object, returns undefined', () => {
    const rootState = {
      fma: {},
    };

    expect(selectors.getFmaIsAuthenticated(rootState)).toBeUndefined();
  });

  it('getFmaIsAuthenticated - If isAuthenticated property in FMA object, returns property value', () => {
    const rootState = {
      fma: {
        isAuthenticated: true,
      },
    };

    expect(selectors.getFmaIsAuthenticated(rootState)).toBe(true);
  });

  it('getOverrideFmaRequired - If no overrideFmaRequired property in FMA object, returns false', () => {
    const rootState = {
      fma: {},
    };

    expect(selectors.getOverrideFmaRequired(rootState)).toBeFalsy();
  });

  it('getOverrideFmaRequired - If overrideFmaRequired property in FMA object, returns property value', () => {
    const rootState = {
      fma: {
        overrideFmaRequired: true,
      },
    };

    expect(selectors.getOverrideFmaRequired(rootState)).toBe(true);
  });

  it('getAccessToken -return accessToken', () => {
    const rootState = {
      fma: {
        access_token: 'abc',
      },
    };

    expect(selectors.getAccessToken(rootState)).toBe('abc');
  });

  describe('getUserHasGuestGUID', () => {
    it('returns true when there is a valid guest guid', () => {
      const state = {
        fma: {
          guestGUID: '393f4aa7-20b2-4b3a-83e2-230bb8f53a45',
        },
      };
      expect(selectors.getUserHasGuestGUID(state)).toBeTruthy();
    });
  });
});
