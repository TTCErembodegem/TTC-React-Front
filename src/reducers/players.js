import { List, Map } from 'immutable';
import * as ActionTypes from '../actions/ActionTypes.js';

export function players(state = [], action = null) {
  const { type, payload } = action;
  switch (type) {
  case ActionTypes.PLAYERS_LOADED:
    return payload;
  default:
    return state;
  }
}