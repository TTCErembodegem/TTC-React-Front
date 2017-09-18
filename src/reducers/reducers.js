import Immutable from 'immutable';
import * as immutableHelpers from './immutableHelpers.js';
import * as ActionTypes from '../actions/ActionTypes.js';
//import _ from 'lodash';

import PlayerModel from '../models/PlayerModel.js';
import TeamModel from '../models/TeamModel.js';
import ClubModel from '../models/ClubModel.js';
import MatchModel from '../models/MatchModel.js';

var defaultConfigState = {
  initialLoadCompleted: false,
};

export function config(state = Immutable.Map(defaultConfigState), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.INITIAL_LOADED:
    return state.set('initialLoadCompleted', true);
  case ActionTypes.LOGIN_FAIL:
  case ActionTypes.SHOW_SNACKBAR:
    return state.set('snackbar', payload);
  case ActionTypes.CLEAR_SNACKBAR:
    return state.remove('snackbar');
  case ActionTypes.SET_SETTING:
    return state.set(payload.key, payload.value);
  default:
    return state;
  }
}

export function freeMatches(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.MATCHES_LOADED:
    //console.log('LOADED: freeMatches', payload, state.toArray());
    return immutableHelpers.merge(state, payload, x => new MatchModel(x), x => !x.shouldBePlayed);
    return state;
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
    return immutableHelpers.merge(state, payload, x => new PlayerModel(x), x => x.active);

  case ActionTypes.PLAYER_ACTIVE_CHANGED:
    if (!payload.isActive) {
      return state.filter(x => x.id !== payload.playerId);
    }
    return state;
  default:
    return state;
  }
}

export function admin(state = {players: Immutable.List([])}, action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.PLAYERS_LOADED:
    let recreantAndQuitters = immutableHelpers.merge(state.players, payload, x => new PlayerModel(x), x => !x.active && x.alias !== 'SYSTEM');
    return {players: recreantAndQuitters};

  case ActionTypes.PLAYER_ACTIVE_CHANGED:
    if (payload.isActive) {
      return {players: state.players.filter(x => x.id !== payload.playerId)};
    }
    return state;
  default:
    return state;
  }
}

export function clubs(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.CLUBS_LOADED:
    return immutableHelpers.merge(state, payload, x => new ClubModel(x));
  default:
    return state;
  }
}

export function teams(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.TEAMS_LOADED:
    return immutableHelpers.merge(state, payload, x => new TeamModel(x));
  default:
    return state;
  }
}