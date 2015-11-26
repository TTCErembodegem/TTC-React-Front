import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import { todos, filter } from './players.js';

const rootReducer = combineReducers({
  todos,
  filter,
  router
});

export default rootReducer;
