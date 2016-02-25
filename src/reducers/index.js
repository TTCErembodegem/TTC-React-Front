import { combineReducers } from 'redux';

import * as reducers from './reducers.js';
import matches from './matchReducers.js';
import user from './userReducers.js';

const rootReducer = combineReducers({
  ...reducers,
  matches,
  user,
});

export default rootReducer;