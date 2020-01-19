import http from '../utils/httpClient';
import {showSnackbar} from './configActions';
import trans from '../locales';

export function emailFormation(title: string, email: string) {
  return dispatch => http.post('/matches/WeekCompetitionEmail', {title, email})
    .then(() => {
        console.log('Email formation succesfully sent!'); // eslint-disable-line
      dispatch(showSnackbar(trans('week.formationMailed')));
    }, err => {
        console.log('Email formation!', err); // eslint-disable-line
      dispatch(showSnackbar('Fout bij versturen email!?'));
    });
}
