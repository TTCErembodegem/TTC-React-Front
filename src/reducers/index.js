import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import * as reducers from './reducers.js';

const rootReducer = combineReducers({
  ...reducers,
  router
});

export default rootReducer;