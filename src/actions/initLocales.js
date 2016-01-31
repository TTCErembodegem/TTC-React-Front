import * as ActionTypes from './ActionTypes.js';

var trans = {
  lang: 'nl',
  trans: {
    fullClubName: 'TTC Erembodegem'
  }
};

export default function() {
  return {
    type: ActionTypes.TRANS_LOADED,
    payload: trans
  };
}