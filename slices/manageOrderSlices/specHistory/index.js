import { actions, reducer } from './slice';
import initialState from './initialState';
import * as thunks from './thunk';
import * as selectors from './selectors';

export default {
  actions,
  initialState,
  reducer,
  selectors,
  thunks,
};
