import Immutable from 'immutable';
import * as immutableHelpers from './immutableHelpers.js';
import * as ActionTypes from '../actions/ActionTypes.js';
//import _ from 'lodash';

import PlayerModel from '../models/PlayerModel.js';
import TeamModel from '../models/TeamModel.js';
import ClubModel from '../models/ClubModel.js';
import MatchModel from '../models/MatchModel.js';

export function config(state = Immutable.Map({initialLoadCompleted: false}), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.INITIAL_LOADED:
    return state.set('initialLoadCompleted', true);
  case ActionTypes.LOGIN_FAIL:
    return state.set('snackbar', payload);
  case ActionTypes.CONFIG_CLEAR_SNACKBAR:
    return state.remove('snackbar');
  default:
    return state;
  }
}

export function readonlyMatches(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.READONLY_MATCHES_LOADED:
    return immutableHelpers.merge(state, payload, x => new MatchModel(x));
  default:
    return state;
  }
}

export function players(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.PLAYERS_LOADED:
    var result = payload.map(x => new PlayerModel(x));
    console.log('PLAYERS_LOADED', result[0]); // eslint-disable-line
    return Immutable.List(result);
  default:
    return state;
  }
}

export function clubs(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.CLUBS_LOADED:
    var result = payload.map(x => new ClubModel(x));
    console.log('CLUBS_LOADED', result[0]); // eslint-disable-line
    return Immutable.List(result);
  default:
    return state;
  }
}

export function teams(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.TEAMS_LOADED:
    var result = payload.map(x => new TeamModel(x));
    console.log('TEAMS_LOADED', result[0]); // eslint-disable-line
    return Immutable.List(result);
  default:
    return state;
  }
}