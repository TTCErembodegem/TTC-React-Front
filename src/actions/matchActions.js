import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { util as storeUtil } from '../store.js';

import MatchModel from '../models/MatchModel.js';

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
    var player = storeUtil.getPlayer(playerId);
    var comp = player.getCompetition(match.getTeam().competition);

    var matchPlayer = {
      matchId: match.id,
      playerId: player.id,
      home: true,
      position: match.players.size + 1,
      ranking: comp.ranking,
      name: player.alias,
      alias: player.alias,
      uniqueIndex: comp.uniqueIndex
    };
    var newMatch = new MatchModel(Object.assign({}, match, {players: [matchPlayer]}));

    dispatch(togglePlayerSelection(newMatch));

    //if (!match.plays(player)) {
    return http.post('/matches/TogglePlayer', matchPlayer)
      .then(function(data) {
        console.log('match return', data);
        dispatch(selectedPlayer(data));

      }, function(err) {
        console.log('erreur!', err); // eslint-disable-line
      });
    //}
  };
}