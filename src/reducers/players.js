//import { List, Map } from 'immutable';
import * as ActionTypes from '../actions/ActionTypes.js';
//import _ from 'lodash';

import Player from '../models/Player.js';
import Match from '../models/Match.js';

export function config(state = {initialLoadCompleted: false}, action = null) {
  const {type} = action;
  switch (type) {
  case ActionTypes.INITIAL_LOADED:
    return {initialLoadCompleted: true};
  default:
    return state;
  }
}

export function players(state = [], action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.PLAYERS_LOADED:
    //console.log('pls', payload[0]);
    //var result = payload.map(x => _.extend(new Player(), x));
    var result = payload.map(x => new Player(x));
    //console.log('pls-class', result[0]);
    return result;
  default:
    return state;
  }
}

export function clubs(state = [], action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.CLUBS_LOADED:
    //console.log('clubs', payload[0]);
    return payload;
  default:
    return state;
  }
}

export function teams(state = [], action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.TEAMS_LOADED:
    console.log('teams', payload[0]);
    return payload;
  default:
    return state;
  }
}

export function calendar(state = [], action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.CALENDAR_LOADED:
    console.log('match', new Match(payload[0]));
    return payload.map(x => new Match(x));
  default:
    return state;
  }
}