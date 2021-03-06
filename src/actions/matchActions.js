import Promise from 'bluebird';
import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import storeUtil from '../storeUtil.js';
import {showSnackbar, setSetting} from './configActions.js';
import {broadcastReload} from '../hub.js';
import trans from '../locales.js';
import moment from 'moment';
import _ from 'lodash';

export function simpleLoaded(data) {
  return {
    type: ActionTypes.MATCHES_LOADED,
    payload: data
  };
}

const shouldSync = match => !match.isSyncedWithFrenoy && moment().isAfter(match.date) && match.shouldBePlayed;

function frenoySync(dispatch, m, forceSync = false) {
  if (forceSync || shouldSync(m)) {
    // Non played matches date is 0001-01-01T00:00:00
    return http.post('/matches/FrenoyMatchSync?forceSync=' + forceSync, {id: m.id})
      .then(function(newmatch) {
        dispatch(simpleLoaded(newmatch));
        broadcastReload('match', newmatch.id);
      }, function(err) {
        if (forceSync) {
          dispatch(showSnackbar(trans('common.apiFail')));
        }
        console.error(err); // eslint-disable-line
      });
  }
  return null;
}

function frenoyReadOnlyMatchSync(match) {
  return dispatch => {
    if (shouldSync(match)) {
      http.post('/matches/FrenoyOtherMatchSync', {id: match.id})
        .then(function(newmatch) {
          dispatch(readOnlyLoaded(Object.assign(newmatch, {frenoyDivisionId: match.frenoyDivisionId})));
        }, function(err) {
          console.error(err); // eslint-disable-line
        });
    }
  };
}

export function forceFrenoySync(matchId) {
  return dispatch => frenoySync(dispatch, {id: matchId}, true);
}

export function loaded(data, dispatch) {
  if (!data) {
    return null;
  }

  dispatch(simpleLoaded(data));

  if (!_.isArray(data)) {
    data = [data];
  }

  var p = Promise.resolve();
  data.forEach(match => {
    p = p.then(() => frenoySync(dispatch, match));
  });
  return p;
}

export function readOnlyLoaded(data) {
  return {
    type: ActionTypes.READONLY_MATCHES_LOADED,
    payload: data
  };
}

export function getOpponentMatches(teamId, opponent = {}) {
  const key = 'GetOpponentMatches' + teamId + opponent.teamCode + opponent.clubId;
  if (storeUtil.getConfig().get(key)) {
    return {type: 'empty', payload: ''};
  }

  return dispatch => {
    return http.get('/matches/GetOpponentMatches', {teamId, ...opponent})
      .then(function(matches) {
        dispatch(setSetting(key, true));

        if (!matches || !matches.length) {
          return;
        }

        dispatch(readOnlyLoaded(matches));

        matches.forEach(m => {
          dispatch(frenoyReadOnlyMatchSync(m));
        });
        return null;

      }, function(err) {
        console.log('GetOpponentMatches!', err); // eslint-disable-line
      });
  };
}


export function selectPlayer(matchId, status, statusNote, playerId) {
  return dispatch => {
    const match = storeUtil.getMatch(matchId);
    const player = storeUtil.getPlayer(playerId);
    const comp = player.getCompetition(match.competition);

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
        uniqueIndex: comp.uniqueIndex,
        status: status,
        statusNote: statusNote,
      };
    } else {
      matchPlayer.status = status;
    }

    const isMyFormation = statusNote !== null;
    if (isMyFormation) {
      matchPlayer.statusNote = statusNote;
    }

    return http.post('/matches/' + (isMyFormation ? 'SetMyFormation' : 'TogglePlayer'), matchPlayer)
      .then(function(data) {
        if (data) {
          dispatch(simpleLoaded(data));
          broadcastReload('match', data.id);
        }

      }, function(err) {
        console.log('TogglePlayer!', err); // eslint-disable-line
      });
  };
}

export function editMatchPlayers(matchPlayersInfo, doShowSnackbar = true) {
  return dispatch => {
    return http.post('/matches/EditMatchPlayers', matchPlayersInfo)
      .then(function(data) {
        if (data) {
          dispatch(simpleLoaded(data));
          broadcastReload('match', data.id);

          if (doShowSnackbar) {
            const msg = !matchPlayersInfo.blockAlso ? 'snackbarSaved' : 'snackbarBlocked';
            dispatch(showSnackbar(trans('match.plys.' + msg)));
          }
        }

      }, function(err) {
        console.log('editMatchPlayers!', err); // eslint-disable-line
      });
  };
}

export function matchUpdated(dataId, updateType) {
  if (updateType === 'score') {
    return {
      type: ActionTypes.SET_SETTING,
      payload: {key: 'newMatchScore' + dataId, value: true}
    };
  } else if (updateType === 'report') {
    return {
      type: ActionTypes.SET_SETTING,
      payload: {key: 'newMatchComment' + dataId, value: true}
    };
  }
}

export function updateScore(matchScore) {
  return dispatch => {
    return http.post('/matches/UpdateScore', matchScore)
      .then(function(data) {
        if (!data) {
          return;
        }
        dispatch(simpleLoaded(data));
        broadcastReload('match', data.id, 'score');

      }, function(err) {
        console.log('UpdateScore!', err); // eslint-disable-line
      });
  };
}

export function frenoyTeamSync(teamId) {
  return dispatch => {
    return http.post('/matches/FrenoyTeamSync', {id: teamId})
      .then(function() {
        dispatch(showSnackbar(trans('common.apiSuccess') + ': Duw F5 om de wijzigingen te zien'));

      }, function(err) {
        console.log('frenoyTeamSync!', err); // eslint-disable-line
      });
  };
}

export function postReport(matchId, reportText) {
  return dispatch => {
    var user = storeUtil.getUser();
    return http.post('/matches/Report', {matchId, text: reportText, playerId: user.playerId})
      .then(function(data) {
        if (!data) {
          return;
        }
        dispatch(simpleLoaded(data));
        broadcastReload('match', data.id, 'report');
        dispatch(showSnackbar(trans('match.report.reportPosted')));

      }, function(err) {
        console.log('Report!', err); // eslint-disable-line
      });
  };
}

export function postComment(comment) {
  return dispatch => {
    return http.post('/matches/Comment', comment)
      .then(function(data) {
        if (!data) {
          return;
        }
        dispatch(simpleLoaded(data));
        broadcastReload('match', data.id, 'report');
        dispatch(showSnackbar(trans('match.report.commentPosted')));

      }, function(err) {
        console.log('Comment!', err); // eslint-disable-line
      });
  };
}

export function deleteComment(commentId) {
  return dispatch => {
    return http.post('/matches/DeleteComment', {id: commentId})
      .then(function(data) {
        if (!data) {
          return;
        }
        dispatch(simpleLoaded(data));
        broadcastReload('match', data.id);
        dispatch(showSnackbar(trans('match.report.commentDeleted')));

      }, function(err) {
        console.log('Delete Comment!', err); // eslint-disable-line
      });
  };
}
