//import { List, Map } from 'immutable';
import * as ActionTypes from '../actions/ActionTypes.js';
//import _ from 'lodash';

import PlayerModel from '../models/PlayerModel.js';
import MatchModel from '../models/MatchModel.js';

export function user(state = {teams: []}, action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.LOGIN:
    return payload;
  default:
    return state;
  }
}

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
    var result = payload.map(x => new PlayerModel(x));
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
    //console.log('teams', payload[0]);
    return payload;
  default:
    return state;
  }
}

export function calendar(state = [], action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.CALENDAR_LOADED:
    //console.log('match', new MatchModel(payload[0]));
    var result = payload.map(x => new MatchModel(x));
    //console.log('matches', result);
    return result;
  default:
    return state;
  }
}