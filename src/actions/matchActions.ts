import Promise from 'bluebird';
import moment from 'moment';
import _ from 'lodash';
import ActionTypes from './ActionTypes';
import http from '../utils/httpClient';
import storeUtil from '../storeUtil';
import {showSnackbar, setSetting} from './configActions';
import {broadcastReload} from '../hub';
import trans from '../locales';

export function simpleLoaded(data) {
  return {
    type: ActionTypes.MATCHES_LOADED,
    payload: data,
  };
}

const shouldSync = match => !match.isSyncedWithFrenoy && moment().isAfter(match.date) && match.shouldBePlayed;

function frenoySync(dispatch, m, forceSync = false) {
  if (forceSync || shouldSync(m)) {
    // Non played matches date is 0001-01-01T00:00:00
    return http.post(`/matches/FrenoyMatchSync?forceSync=${forceSync}`, {id: m.id})
      .then(newmatch => {
        dispatch(simpleLoaded(newmatch));
        broadcastReload('match', newmatch.id);
      }, err => {
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
        .then(newmatch => {
          dispatch(readOnlyLoaded(Object.assign(newmatch, {frenoyDivisionId: match.frenoyDivisionId})));
        }, err => {
          console.error(err); // eslint-disable-line
        });
    }
  };
}

export function forceFrenoySync(matchId) {
  return dispatch => frenoySync(dispatch, {id: matchId}, true);
}

export function loaded(input, dispatch) {
  let data = input;
  if (!data) {
    return null;
  }

  dispatch(simpleLoaded(data));

  if (!_.isArray(data)) {
    data = [data];
  }

  let p = Promise.resolve();
  data.forEach(match => {
    p = p.then(() => frenoySync(dispatch, match));
  });
  return p;
}

export function readOnlyLoaded(data) {
  return {
    type: ActionTypes.READONLY_MATCHES_LOADED,
    payload: data,
  };
}

export function getOpponentMatches(teamId, opponent = {}) {
  const key = `GetOpponentMatches${teamId}${opponent.teamCode}${opponent.clubId}`;
  if (storeUtil.getConfig().get(key)) {
    return {type: 'empty', payload: ''};
  }

  return dispatch => http.get('/matches/GetOpponentMatches', {teamId, ...opponent})
    .then(matches => {
      dispatch(setSetting(key, true));

      if (!matches || !matches.length) {
        return;
      }

      dispatch(readOnlyLoaded(matches));

      matches.forEach(m => {
        dispatch(frenoyReadOnlyMatchSync(m));
      });

    }, err => {
        console.log('GetOpponentMatches!', err); // eslint-disable-line
    });
}


export function selectPlayer(matchId, status, statusNote, playerId) {
  return dispatch => {
    const match = storeUtil.getMatch(matchId);
    const player = storeUtil.getPlayer(playerId);
    const comp = player.getCompetition(match.competition);

    let matchPlayer = match.plays(player);
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
        status,
        statusNote,
      };
    } else {
      matchPlayer.status = status;
    }

    const isMyFormation = statusNote !== null;
    if (isMyFormation) {
      matchPlayer.statusNote = statusNote;
    }

    return http.post(`/matches/${isMyFormation ? 'SetMyFormation' : 'TogglePlayer'}`, matchPlayer)
      .then(data => {
        if (data) {
          dispatch(simpleLoaded(data));
          broadcastReload('match', data.id);
        }

      }, err => {
        console.log('TogglePlayer!', err); // eslint-disable-line
      });
  };
}

export function editMatchPlayers(matchPlayersInfo, doShowSnackbar = true) {
  return dispatch => http.post('/matches/EditMatchPlayers', matchPlayersInfo)
    .then(data => {
      if (data) {
        dispatch(simpleLoaded(data));
        broadcastReload('match', data.id);

        if (doShowSnackbar) {
          const msg = !matchPlayersInfo.blockAlso ? 'snackbarSaved' : 'snackbarBlocked';
          dispatch(showSnackbar(trans(`match.plys.${msg}`)));
        }
      }

    }, err => {
        console.log('editMatchPlayers!', err); // eslint-disable-line
    });
}

export function matchUpdated(dataId, updateType) {
  if (updateType === 'score') {
    return {
      type: ActionTypes.SET_SETTING,
      payload: {key: `newMatchScore${dataId}`, value: true},
    };
  } if (updateType === 'report') {
    return {
      type: ActionTypes.SET_SETTING,
      payload: {key: `newMatchComment${dataId}`, value: true},
    };
  }
  throw Error('Expected updateType score|report');
}

export function updateScore(matchScore) {
  return dispatch => http.post('/matches/UpdateScore', matchScore)
    .then(data => {
      if (!data) {
        return;
      }
      dispatch(simpleLoaded(data));
      broadcastReload('match', data.id, 'score');

    }, err => {
        console.log('UpdateScore!', err); // eslint-disable-line
    });
}

export function frenoyTeamSync(teamId) {
  return dispatch => http.post('/matches/FrenoyTeamSync', {id: teamId})
    .then(() => {
      dispatch(showSnackbar(`${trans('common.apiSuccess')}: Duw F5 om de wijzigingen te zien`));

    }, err => {
        console.log('frenoyTeamSync!', err); // eslint-disable-line
    });
}

export function postReport(matchId, reportText) {
  return dispatch => {
    const user = storeUtil.getUser();
    return http.post('/matches/Report', {matchId, text: reportText, playerId: user.playerId})
      .then(data => {
        if (!data) {
          return;
        }
        dispatch(simpleLoaded(data));
        broadcastReload('match', data.id, 'report');
        dispatch(showSnackbar(trans('match.report.reportPosted')));

      }, err => {
        console.log('Report!', err); // eslint-disable-line
      });
  };
}

export function postComment(comment) {
  return dispatch => http.post('/matches/Comment', comment)
    .then(data => {
      if (!data) {
        return;
      }
      dispatch(simpleLoaded(data));
      broadcastReload('match', data.id, 'report');
      dispatch(showSnackbar(trans('match.report.commentPosted')));

    }, err => {
        console.log('Comment!', err); // eslint-disable-line
    });
}

export function deleteComment(commentId) {
  return dispatch => http.post('/matches/DeleteComment', {id: commentId})
    .then(data => {
      if (!data) {
        return;
      }
      dispatch(simpleLoaded(data));
      broadcastReload('match', data.id);
      dispatch(showSnackbar(trans('match.report.commentDeleted')));

    }, err => {
        console.log('Delete Comment!', err); // eslint-disable-line
    });
}
