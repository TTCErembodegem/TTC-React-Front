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

export function selectPlayer(matchId, playerId) {
  console.log('dispatch selectPlayer', matchId, playerId, arguments);
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
        console.log('erreur!', err); // eslint-disable-line
      });
  };
}