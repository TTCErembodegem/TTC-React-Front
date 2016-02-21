import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { util as storeUtil } from '../store.js';

//import MatchModel from '../models/MatchModel.js';

export function loaded(data) {
  return {
    type: ActionTypes.MATCHES_LOADED,
    payload: data
  };
}

function updateMatch(match) {
  return {
    type: ActionTypes.MATCHES_UPDATE,
    payload: match
  };
}

export function getLastOpponentMatches(opponent) {
  return dispatch => {
    return http.get('/matches/GetLastOpponentMatches', opponent)
      .then(function(data) {
        dispatch(loaded(data));
      }, function(err) {
        console.log('GetLastOpponentMatches!', err); // eslint-disable-line
      });
  };
}

export function selectPlayer(matchId, playerId) {
  return (dispatch, getState) => {
    var match = storeUtil.getMatch(matchId);
    var player = storeUtil.getPlayer(playerId);
    var comp = player.getCompetition(match.getTeam().competition);

    var matchPlayer = match.plays(player);
    if (!matchPlayer) {
      matchPlayer = {
        matchId: match.id,
        playerId: player.id,
        home: match.isHomeMatch,
        position: match.players.size + 1,
        ranking: comp.ranking,
        name: player.alias,
        alias: player.alias,
        uniqueIndex: comp.uniqueIndex
      };
    }

    return http.post('/matches/TogglePlayer', matchPlayer)
      .then(function(data) {
        dispatch(updateMatch(data));

      }, function(err) {
        console.log('TogglePlayer!', err); // eslint-disable-line
      });
  };
}