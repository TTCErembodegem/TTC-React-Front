import * as ActionTypes from './ActionTypes';

export function playersLoaded(players) {
  return {
    type: ActionTypes.PLAYERS_LOADED,
    payload: players
  };
}

export function clubsLoaded(players) {
  return {
    type: ActionTypes.CLUBS_LOADED,
    payload: players
  };
}