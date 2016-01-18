import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import { players } from './players.js';

const rootReducer = combineReducers({
  players,
  router
});

export default rootReducer;