import Immutable from 'immutable';

import * as ActionTypes from '../actions/ActionTypes.js';
import MatchModel from '../models/MatchModel.js';

export default function matches(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.MATCHES_LOADED:
    var result = payload.map(x => new MatchModel(x));
    console.log('MATCHES_LOADED', result[0]); // eslint-disable-line
    return Immutable.List(result);
  // case ActionTypes.MATCHES_PLAYER_ADD:
  //   return state;
  case ActionTypes.MATCHES_PLAYER_TOGGLE:
    //console.log(payload);

    var {match, player} = payload;
    if (match.plays(player)) {

    } else {
      var matchPlayer = {
        playerId: player.id
      };

      //var newMatch = Object.a(match);

      // var newPlayers = newMatch.players.push(matchPlayer);
      // var newMatch = new MatchModel(match);

      // console.log('tes', newMatch);

      // console.log(newMatch.players);


      //var newMatch = ma

      // var newState = state.update(
      //   state.findIndex(function(m) {
      //     return m === match.id;
      //   }), function() {
      //     return newMatch;
      //   }
      // );

      // var uhoh = state.find(x => x.id === match.id);
      // var uhohNew = newState.find(x => x.id === match.id);

      // console.log(uhoh === uhohNew, uhoh, uhohNew);
      return state;
    }



    return state;
  default:
    return state;
  }
}