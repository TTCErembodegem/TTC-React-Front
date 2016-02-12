import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import * as reducers from './reducers.js';
import matches from './matchReducers.js';

const rootReducer = combineReducers({
  ...reducers,
  matches,
  router
});

export default rootReducer;