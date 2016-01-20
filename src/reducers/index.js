import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import { players, clubs, calendar, teams } from './players.js';

const rootReducer = combineReducers({
  players,
  clubs,
  calendar,
  teams,
  router
});

export default rootReducer;