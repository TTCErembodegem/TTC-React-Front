import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import * as reducers from './reducers.js';
import matches from './matchReducers.js';
import user from './userReducers.js';

const rootReducer = combineReducers({
  ...reducers,
  matches,
  user,
  router
});

export default rootReducer;