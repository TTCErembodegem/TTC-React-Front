import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import * as reducers from './players.js';

const rootReducer = combineReducers({
  ...reducers,
  router
});

export default rootReducer;