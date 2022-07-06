import { reducer } from './slice';
import initialState from './initialState';
import * as thunks from './thunks';
import * as selectors from './selectors';

export default {
  initialState,
  reducer,
  selectors,
  thunks,
};
