import Immutable from 'immutable';

function replaceMatch(state, match, classify) {
  var toReplaceIndex = state.findIndex(m => m.id === match.id);
  if (toReplaceIndex === -1) {
    return state.push(classify(match));
  } else {
    return state.update(toReplaceIndex, () => classify(match));
  }
}

export function merge(state, payload, classify) {
  if (state.size === 0) {
    let result = payload.map(classify);
    return Immutable.List(result);

  } else if (payload instanceof Array) {
    //console.log('MATCHES_LOADED BEGIN', state.toArray());
    let newState = state;
    for (let i = 0; i < payload.length; i++) {
      newState = replaceMatch(newState, payload[i], classify);
    }
    console.log('MATCHES_LOADED END', newState.toArray()[0]);
    return newState;

  } else {
    let match = payload;
    return replaceMatch(state, match, classify);
  }
}