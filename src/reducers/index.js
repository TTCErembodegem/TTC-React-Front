import {combineReducers} from 'redux';

import * as reducers from './reducers';
import matches from './matchReducers';
import user from './userReducers';

const rootReducer = combineReducers({
  ...reducers,
  matches,
  user,
});

export default rootReducer;
