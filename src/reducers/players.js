import { List, Map } from 'immutable';
import * as ActionTypes from '../actions/ActionTypes.js';

export function players(state = [], action = null) {
  const { type, payload } = action;
  switch (type) {
  case ActionTypes.PLAYERS_LOADED:
    //console.log(payload);
    return payload;
  default:
    return state;
  }
}

export function clubs(state = [], action = null) {
  const { type, payload } = action;
  switch (type) {
  case ActionTypes.CLUBS_LOADED:
    //console.log(payload);
    return payload;
  default:
    return state;
  }
}

export function teams(state = [], action = null) {
  const { type, payload } = action;
  switch (type) {
  case ActionTypes.TEAMS_LOADED:
    //console.log(payload);
    return payload;
  default:
    return state;
  }
}

export function calendar(state = [], action = null) {
  const { type, payload } = action;
  switch (type) {
  case ActionTypes.CALENDAR_LOADED:
    console.log(payload);
    return payload;
  default:
    return state;
  }
}