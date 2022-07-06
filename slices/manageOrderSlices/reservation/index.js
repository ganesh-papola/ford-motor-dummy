import { actions, reducer } from './slice';
import initialState from './initialState';
import * as thunks from './thunks';
import * as selectors from './selectors';

export default {
  actions,
  initialState,
  reducer,
  selectors,
  thunks,
};
