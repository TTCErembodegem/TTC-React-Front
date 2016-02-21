import Immutable from 'immutable';

import * as ActionTypes from '../actions/ActionTypes.js';
import MatchModel from '../models/MatchModel.js';

export default function matches(state = Immutable.List([]), action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.MATCHES_LOADED:
    var result = payload.map(x => new MatchModel(x));
    console.log('MATCHES_LOADED', result); // eslint-disable-line
    return Immutable.List(result);

  case ActionTypes.MATCHES_UPDATE:
    //let newMatch = new MatchModel(Object.assign({}, match, {players: [matchPlayer]}));
    //dispatch(togglePlayerSelection(newMatch));

    // TODO: just one event: MATCHES_LOADED
    // which updates and inserts...

    var match = payload;
    var toReplaceIndex = state.findIndex(m => m.id === match.id);

    // console.log('replace', match);
    // console.log('old', state.toJSON());
    // console.log('intro', toReplaceIndex, match.id);



    var newState = state.update(toReplaceIndex, function() {
      return new MatchModel(match);
    });

    //console.log('new', newState.toJSON());

    return newState;

  default:
    return state;
  }
}