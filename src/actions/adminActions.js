import http from '../utils/httpClient.js';
import {showSnackbar} from './configActions.js';
import trans from '../locales.js';

export function emailFormation(title, email) {
  return dispatch => {
    return http.post('/matches/WeekCompetitionEmail', {title, email})
      .then(function() {
        dispatch(showSnackbar(trans('week.formationMailed')));
      }, function(err) {
        console.log('Email formation!', err); // eslint-disable-line
        dispatch(showSnackbar('Fout bij versturen email!?'));
      });
  };
}
