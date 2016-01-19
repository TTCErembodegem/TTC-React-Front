import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import { players, clubs, calendar } from './players.js';

const rootReducer = combineReducers({
  players,
  clubs,
  calendar,
  router
});

export default rootReducer;