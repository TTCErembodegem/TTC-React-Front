import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { util as storeUtil } from '../store.js';
import { showSnackbar } from './configActions.js';
import trans from '../locales.js';

//import MatchModel from '../models/MatchModel.js';

export function loaded(data) {
  return {
    type: ActionTypes.MATCHES_LOADED,
    payload: data
  };
}

export function readOnlyLoaded(data) {
  return {
    type: ActionTypes.READONLY_MATCHES_LOADED,
    payload: data
  };
}

export function getLastOpponentMatches(teamId, opponent) {
  return dispatch => {
    return http.get('/matches/GetLastOpponentMatches', {teamId, ...opponent})
      .then(function(data) {
        dispatch(readOnlyLoaded(data));
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
        dispatch(loaded(data));

      }, function(err) {
        console.log('TogglePlayer!', err); // eslint-disable-line
      });
  };
}

export function postReport(matchId, reportText) {
  return (dispatch, getState) => {
    var user = storeUtil.getUser();
    return http.post('/matches/Report', {matchId, text: reportText, playerId: user.playerId})
      .then(function(data) {
        dispatch(loaded(data));
        dispatch(showSnackbar(trans('match.report.reportPosted')));

      }, function(err) {
        console.log('Report!', err); // eslint-disable-line
      });
  };
}

export function postComment(matchId, commentText) {
  return (dispatch, getState) => {
    var user = storeUtil.getUser();
    return http.post('/matches/Comment', {matchId, text: commentText, playerId: user.playerId})
      .then(function(data) {
        dispatch(loaded(data));
        dispatch(showSnackbar(trans('match.report.commentPosted')));

      }, function(err) {
        console.log('Comment!', err); // eslint-disable-line
      });
  };
}