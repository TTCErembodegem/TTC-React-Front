import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { util as storeUtil } from '../store.js';

export function loaded(data) {
  return {
    type: ActionTypes.MATCHES_LOADED,
    payload: data
  };
}

function togglePlayerSelection(match, player) {
  return {
    type: ActionTypes.MATCHES_PLAYER_TOGGLE,
    payload: {
      match,
      player
    }
  };
}

function selectedPlayer(data) {
  return {
    type: ActionTypes.MATCHES_PLAYER_SELECT,
    payload: data
  };
}

export function selectPlayer(matchId, playerId) {
  return (dispatch, getState) => {
    var match = storeUtil.getMatch(matchId);
    //var team = storeUtil.getTeam(match.teamId);
    var player = storeUtil.getPlayer(playerId);
    console.log(match, player/*, team*/);

    dispatch(togglePlayerSelection(match, player));

    if (!match.plays(player)) {
      return http.post('/matches/AddPlayer', {matchId, playerId})
        .then(function(data) {
          dispatch(selectedPlayer(data));

        }, function(err) {
          console.log('erreur!', err); // eslint-disable-line
        });
    }
  };
}