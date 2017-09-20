import * as ActionTypes from './ActionTypes.js';
import http from '../utils/httpClient.js';
import storeUtil from '../storeUtil.js';
import { showSnackbar } from './configActions.js';
import { broadcastSnackbar, broadcastReload } from '../hub.js';


export function emailFormation() {
  console.log('emailFormation!');
  return dispatch => {
    return http.post('/teams/EmailFormation', {id: commentId})
      .then(function(data) {
        //dispatch(simpleLoaded(data));
        //broadcastReload('match', data.id);
        //dispatch(showSnackbar(trans('match.report.commentDeleted')));

      }, function(err) {
        console.log('Email formation!', err); // eslint-disable-line
      }
    );
  };
}
