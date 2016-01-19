import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import { players, clubs } from './players.js';

const rootReducer = combineReducers({
  players,
  clubs,
  router
});

export default rootReducer;