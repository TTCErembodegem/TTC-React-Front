//import Immutable from 'immutable';

import * as ActionTypes from '../actions/ActionTypes.js';
import MatchModel from '../models/MatchModel.js';

export default function matches(state = [], action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.MATCHES_LOADED:
    var result = payload.map(x => new MatchModel(x));
    console.log('MATCHES_LOADED', result[0]); // eslint-disable-line
    return result;
  // case ActionTypes.MATCHES_PLAYER_ADD:
  //   return state;
  case ActionTypes.MATCHES_PLAYER_TOGGLE:
    //console.log(payload);

    var {match, player} = payload;
    if (match.plays(player)) {

    } else {
      var reportPlayer = {
        playerId: player.id
      };
      match.report.players.push(reportPlayer);
    }



    return state;
  default:
    return state;
  }
}