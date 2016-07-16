import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import { util as storeUtil } from '../store.js';
import { showSnackbar, matchesForTeamLoaded } from './configActions.js';
import { broadcastReload } from '../hub.js';
import trans from '../locales.js';
import moment from 'moment';
import _ from 'lodash';

//import MatchModel from '../models/MatchModel.js';

export function simpleLoaded(data) {
  return {
    type: ActionTypes.MATCHES_LOADED,
    payload: data
  };
}

function frenoySync(dispatch, m) {
  if (!m.isSyncedWithFrenoy && moment().isAfter(moment(m.date))) {
    http.post('/matches/FrenoyMatchSync', {id: m.id})
      .then(function(newmatch) {
        dispatch(simpleLoaded(newmatch));
      }, function(err) {
        console.error(err); // eslint-disable-line
      }
    );
  }
}

export function loaded(data, dispatch) {
  if (!data) {
    return;
  }

  dispatch(simpleLoaded(data));

  if (!_.isArray(data)) {
    data = [data];
  }
  data.forEach(match => {
    frenoySync(dispatch, match);

    if (match.isHomeMatch !== null && moment(match.date).month() < 9) {
      // TODO: do not call if already in store
      http.get('/matches/GetFirstRoundMatch', {matchId: match.id})
        .then(function(newmatch) {
          if (!newmatch) {
            return;
          }
          dispatch(simpleLoaded(newmatch));
          frenoySync(dispatch, newmatch);

        }, function(err) {
          console.error(err); // eslint-disable-line
        }
      );
    }
  });
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
      .then(function(matches) {
        if (!matches) {
          return;
        }

        dispatch(readOnlyLoaded(matches));

        matches.forEach(match => {
          if (!match.isSyncedWithFrenoy && moment().isAfter(moment(match.date))) {
            http.post('/matches/FrenoyOtherMatchSync', {id: match.id})
              .then(function(newmatch) {
                dispatch(readOnlyLoaded(newmatch));
              }, function(err) {
                console.error(err); // eslint-disable-line
              }
            );
          }
        });

      }, function(err) {
        console.log('GetLastOpponentMatches!', err); // eslint-disable-line
      }
    );
  };
}

export function getMatchesForTeam(teamId) {
  return dispatch => {
    return http.get('/matches/getMatchesForTeam', {teamId})
      .then(function(matches) {
        if (!matches) {
          return;
        }
        matches.forEach(match => {
          frenoySync(dispatch, match);
        });

        dispatch(simpleLoaded(matches));
        dispatch(matchesForTeamLoaded(teamId));

      }, function(err) {
        console.log('GetMatchesForTeam!', err); // eslint-disable-line
      }
    );
  };
}

export function selectPlayer(matchId, playerId) {
  return dispatch => {
    var match = storeUtil.getMatch(matchId);
    var player = storeUtil.getPlayer(playerId);
    var comp = player.getCompetition(match.competition);

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
        if (data) {
          dispatch(simpleLoaded(data));
          broadcastReload('match', data.id);
        }

      }, function(err) {
        console.log('TogglePlayer!', err); // eslint-disable-line
      }
    );
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
      }
    );
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
      }
    );
  };
}

export function postComment(comment) {
  return (dispatch, getState) => {
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
      }
    );
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
      }
    );
  };
}